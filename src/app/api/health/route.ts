import { db, demoModeEnabled } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return Response.json(
      {
        ok: demoModeEnabled,
        database: "not-configured",
        mode: demoModeEnabled ? "demo" : "unavailable",
      },
      { status: demoModeEnabled ? 200 : 503 },
    );
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, database: "connected", mode: "database" });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
