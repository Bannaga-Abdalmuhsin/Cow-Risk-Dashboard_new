import pg from "pg";
import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../public/team-data.json");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("[fetch-team] No DATABASE_URL — keeping existing team-data.json");
  process.exit(0);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const { rows } = await pool.query(`
    SELECT
      id,
      name,
      role,
      default_area  AS "defaultArea",
      mc_name       AS "mcName",
      mobile_number AS "mobileNumber"
    FROM team_users
    ORDER BY role, name
  `);
  writeFileSync(outPath, JSON.stringify(rows, null, 2));
  console.log(`[fetch-team] Wrote ${rows.length} team members to team-data.json`);
} catch (err) {
  console.error("[fetch-team] DB error — keeping existing team-data.json:", err.message);
} finally {
  await pool.end();
}
