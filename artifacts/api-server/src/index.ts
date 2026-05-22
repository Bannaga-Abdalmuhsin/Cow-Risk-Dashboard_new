import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seedTeam } from "./seed.js";
import { pool } from "@workspace/db";
import { handleUpgrade } from "./lib/wsHub.js";

const PORT = Number(process.env.PORT ?? 8080);

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS faults (
      id              SERIAL PRIMARY KEY,
      tt_id           TEXT NOT NULL,
      cow_id          TEXT NOT NULL,
      alarm_name      TEXT NOT NULL,
      severity        TEXT NOT NULL,
      power_source    TEXT,
      backup_time     TEXT,
      site_lat        REAL NOT NULL,
      site_lng        REAL NOT NULL,
      location        TEXT,
      assigned_tech_id INTEGER REFERENCES team_users(id),
      dispatch_status TEXT NOT NULL DEFAULT 'new',
      eta             INTEGER,
      received_at     TIMESTAMP DEFAULT NOW() NOT NULL,
      dispatched_at   TIMESTAMP,
      resolved_at     TIMESTAMP,
      api_key         TEXT
    )
  `);
  // Prevent duplicate active tickets for the same TT number.
  // A resolved fault (resolved_at IS NOT NULL) is excluded so the same TT
  // can be re-opened later without violating this constraint.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS faults_active_ttid_idx
    ON faults(tt_id)
    WHERE resolved_at IS NULL
  `);
  logger.info("Migrations complete");
}

const server = app.listen(PORT, "0.0.0.0", async () => {
  logger.info({ port: PORT }, "API server started");
  try {
    await runMigrations();
  } catch (err) {
    logger.error({ err }, "Migration failed — continuing anyway");
  }
  try {
    await seedTeam();
  } catch (err) {
    logger.error({ err }, "Seed failed — continuing anyway");
  }

  // ── WebSocket upgrade ─────────────────────────────────────────────────────
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/team/ws") {
      handleUpgrade(req, socket, head as Buffer);
    } else {
      socket.destroy();
    }
  });

  // ── PBI background sync ──────────────────────────────────────────────────
  // Runs once on startup, then every 60 s.
  // Skipped silently if PBI env vars are not set.
  if (process.env.PBI_TENANT_ID && process.env.PBI_CLIENT_ID && process.env.PBI_DATASET_ID) {
    const { syncPbiToDb } = await import("./lib/pbiSync.js");
    const runSync = () =>
      syncPbiToDb().catch((err: unknown) => logger.warn({ err }, "PBI sync failed"));
    runSync();
    setInterval(runSync, 60_000);
    logger.info("PBI auto-sync started (60 s interval)");
  } else {
    logger.warn("PBI env vars not set — auto-sync disabled");
  }
});
