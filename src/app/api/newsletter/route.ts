import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, demoModeEnabled } from "@/db";
import { saveDemoNewsletterSubscriber } from "@/db/demo-store";
import { newsletterSubscribers } from "@/db/schema";

export async function POST(request: Request) {
  try {
    if (!db && !demoModeEnabled) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Newsletter signup is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!db) {
      saveDemoNewsletterSubscriber(email);
      return NextResponse.json({ ok: true, mode: "demo" });
    }

    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { createdAt: sql`now()` },
      });

    return NextResponse.json({ ok: true, mode: "database" });
  } catch (error) {
    console.error("Newsletter signup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
