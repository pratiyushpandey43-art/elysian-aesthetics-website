import { randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, demoModeEnabled } from "@/db";
import {
  listDemoBookings,
  saveDemoBooking,
} from "@/db/demo-store";
import { bookings } from "@/db/schema";
import {
  FIRST_AVAILABLE_PROVIDER,
  NAMED_PROVIDERS,
  getTimeSlotsForDate,
  isBookingService,
  isNamedProvider,
  isOpenBookingDate,
  isProviderOption,
} from "@/lib/booking-options";

type ExistingBooking = {
  time: string;
  provider: string | null;
};

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(
    randomBytes(6),
    (byte) => alphabet[byte % alphabet.length],
  ).join("");
  return `ELY-${suffix}`;
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function slotConflict(existing: ExistingBooking[], provider: string | null) {
  if (existing.length >= NAMED_PROVIDERS.length) {
    return "That time has just filled. Please choose another available time.";
  }

  if (
    provider !== null &&
    existing.some((booking) => booking.provider === provider)
  ) {
    return `${provider} is not available at that time. Please choose another time or select First Available.`;
  }

  return null;
}

async function findBookings(date: string, time?: string) {
  if (!db) {
    return listDemoBookings(date, time).map(({ time: slot, provider }) => ({
      time: slot,
      provider,
    }));
  }

  const where = time
    ? and(eq(bookings.date, date), eq(bookings.time, time))
    : eq(bookings.date, date);

  return db
    .select({ time: bookings.time, provider: bookings.provider })
    .from(bookings)
    .where(where);
}

export async function GET(request: Request) {
  try {
    if (!db && !demoModeEnabled) {
      return jsonError(
        "Online booking is temporarily unavailable. Please call (972) 636-6299.",
        503,
      );
    }

    const date = new URL(request.url).searchParams.get("date")?.trim() ?? "";
    if (!isOpenBookingDate(date)) {
      return jsonError(
        "Please choose a future Tuesday through Saturday appointment date.",
      );
    }

    const rows = await findBookings(date);
    const counts = new Map<string, number>();
    for (const row of rows) {
      counts.set(row.time, (counts.get(row.time) ?? 0) + 1);
    }

    const unavailableTimes = getTimeSlotsForDate(date).filter(
      (time) => (counts.get(time) ?? 0) >= NAMED_PROVIDERS.length,
    );

    return NextResponse.json(
      {
        ok: true,
        date,
        unavailableTimes,
        mode: db ? "database" : "demo",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Booking availability lookup failed:", error);
    return jsonError("Availability could not be loaded. Please try again.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!db && !demoModeEnabled) {
      return jsonError(
        "Online booking is temporarily unavailable. Please call (972) 636-6299.",
        503,
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const service = typeof body.service === "string" ? body.service.trim() : "";
    const requestedProvider =
      typeof body.provider === "string" && body.provider.trim()
        ? body.provider.trim()
        : FIRST_AVAILABLE_PROVIDER;
    const date = typeof body.date === "string" ? body.date.trim() : "";
    const time = typeof body.time === "string" ? body.time.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    if (name.length < 2 || name.length > 120) {
      return jsonError("Please enter your full name.");
    }
    if (
      email.length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return jsonError("Please enter a valid email address.");
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (
      phone.length > 40 ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      return jsonError("Please enter a valid phone number.");
    }
    if (!isBookingService(service)) {
      return jsonError("Please select a valid service.");
    }
    if (!isProviderOption(requestedProvider)) {
      return jsonError("Please select a valid provider preference.");
    }
    if (!isOpenBookingDate(date)) {
      return jsonError(
        "Please choose a future Tuesday through Saturday appointment date.",
      );
    }
    if (!getTimeSlotsForDate(date).includes(time)) {
      return jsonError("Please choose a time during clinic hours.");
    }
    if (notes && notes.length > 3000) {
      return jsonError("Please shorten your notes to 3,000 characters or fewer.");
    }

    const provider = isNamedProvider(requestedProvider)
      ? requestedProvider
      : null;
    const code = makeCode();

    if (!db) {
      const existing = listDemoBookings(date, time);
      const conflict = slotConflict(existing, provider);
      if (conflict) return jsonError(conflict, 409);

      saveDemoBooking({
        code,
        name,
        email,
        phone,
        service,
        provider,
        date,
        time,
        notes: notes || null,
        createdAt: new Date(),
      });

      return NextResponse.json(
        { ok: true, id: `demo-${code}`, code, mode: "demo" },
        { status: 201 },
      );
    }

    const result = await db.transaction(async (transaction) => {
      const lockKey = `${date}|${time}`;
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${lockKey}))`,
      );

      const existing = await transaction
        .select({ time: bookings.time, provider: bookings.provider })
        .from(bookings)
        .where(and(eq(bookings.date, date), eq(bookings.time, time)));
      const conflict = slotConflict(existing, provider);
      if (conflict) return { conflict, row: null };

      const [row] = await transaction
        .insert(bookings)
        .values({
          code,
          name,
          email,
          phone,
          service,
          provider,
          date,
          time,
          notes: notes || null,
        })
        .returning({ id: bookings.id, code: bookings.code });

      return { conflict: null, row: row ?? null };
    });

    if (result.conflict) {
      return jsonError(result.conflict, 409);
    }

    const { row } = result;

    if (!row) {
      throw new Error("Booking insert returned no record.");
    }

    return NextResponse.json(
      { ok: true, id: row.id, code: row.code, mode: "database" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
