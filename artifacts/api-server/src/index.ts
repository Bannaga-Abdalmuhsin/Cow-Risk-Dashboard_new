import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seedTeam } from "./seed.js";
import { pool } from "@workspace/db";

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
  logger.info("Migrations complete");
}

app.listen(PORT, "0.0.0.0", async () => {
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
});
