import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

const DB_PROBE_TIMEOUT_MS = 3000;

router.get("/healthz", async (req, res): Promise<void> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("DB probe timed out")), DB_PROBE_TIMEOUT_MS),
  );
  try {
    await Promise.race([pool.query("SELECT 1"), timeout]);
    res.json({ status: "ok", db: "reachable" });
  } catch (err) {
    req.log.error({ err }, "Health check: database unreachable");
    res.status(503).json({ status: "error", db: "unreachable" });
  }
});

export default router;
