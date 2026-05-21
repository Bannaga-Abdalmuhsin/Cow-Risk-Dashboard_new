import { Router, type Request, type Response } from "express";
import { eq, and, isNull, sql, desc } from "drizzle-orm";
import { db, teamUsersTable, techLocationsTable, faultsTable, assignmentsTable, faultTrackingPointsTable } from "@workspace/db";
import { getDirectionsRoute } from "./directions.js";
import { syncPbiToDb, getLastSyncResult } from "../../lib/pbiSync.js";

const router = Router();

/* ─── helpers ─────────────────────────────────────────────────────────────── */

async function sendPush(to: string | null | undefined, title: string, body: string): Promise<void> {
  if (!to || !to.startsWith("ExponentPushToken")) return;
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body:    JSON.stringify({ to, title, body, sound: "default", priority: "high" }),
    });
  } catch {}
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function etaMinutes(distKm: number): number {
  return Math.round((distKm / 40) * 60);
}

function verifyApiKey(req: Request, res: Response): boolean {
  const key = req.headers["x-api-key"] ?? req.query.apiKey;
  const expected = process.env.FAULT_API_KEY;
  if (expected && key !== expected) {
    res.status(401).json({ error: "Invalid API key" });
    return false;
  }
  return true;
}

/* ─── POST /api/faults  (external systems post new faults here) ─────────── */

router.post("/", async (req: Request, res: Response): Promise<void> => {
  if (!verifyApiKey(req, res)) return;

  const {
    ttId, cowId, alarmName, severity,
    powerSource, backupTime,
    siteLat, siteLng, location,
    autoDispatch,
  } = req.body as {
    ttId?: string; cowId?: string; alarmName?: string; severity?: string;
    powerSource?: string; backupTime?: string;
    siteLat?: number; siteLng?: number; location?: string;
    autoDispatch?: boolean;
  };

  if (!ttId || !cowId || !alarmName || !severity || siteLat == null || siteLng == null) {
    res.status(400).json({ error: "ttId, cowId, alarmName, severity, siteLat, siteLng required" });
    return;
  }

  // Idempotency: if an active fault with the same ttId already exists, return it.
  const [existing] = await db
    .select()
    .from(faultsTable)
    .where(and(eq(faultsTable.ttId, ttId), isNull(faultsTable.resolvedAt)));

  if (existing) {
    res.status(200).json(existing);
    return;
  }

  const [fault] = await db
    .insert(faultsTable)
    .values({
      ttId, cowId, alarmName, severity,
      powerSource: powerSource ?? null,
      backupTime:  backupTime  ?? null,
      siteLat, siteLng,
      location: location ?? null,
      dispatchStatus: "new",
    })
    .returning();

  if (autoDispatch !== false) {
    await dispatchNearest(fault.id, siteLat, siteLng, alarmName, cowId, backupTime ?? null);
    const [updated] = await db.select().from(faultsTable).where(eq(faultsTable.id, fault.id));
    res.status(201).json(updated);
    return;
  }

  res.status(201).json(fault);
});

/* ─── GET /api/faults/active ─────────────────────────────────────────────── */

router.get("/active", async (_req: Request, res: Response): Promise<void> => {
  const rows = await db
    .select({
      id:             faultsTable.id,
      ttId:           faultsTable.ttId,
      cowId:          faultsTable.cowId,
      alarmName:      faultsTable.alarmName,
      severity:       faultsTable.severity,
      powerSource:    faultsTable.powerSource,
      backupTime:     faultsTable.backupTime,
      siteLat:        faultsTable.siteLat,
      siteLng:        faultsTable.siteLng,
      location:       faultsTable.location,
      dispatchStatus: faultsTable.dispatchStatus,
      eta:            faultsTable.eta,
      receivedAt:     faultsTable.receivedAt,
      dispatchedAt:   faultsTable.dispatchedAt,
      assignedTechId: faultsTable.assignedTechId,
      assignedTech:   teamUsersTable.name,
      techLat:       techLocationsTable.lat,
      techLng:       techLocationsTable.lng,
      techArea:      techLocationsTable.area,
      techUpdatedAt: techLocationsTable.updatedAt,
      techSpeed:     techLocationsTable.speed,
      techHeading:   techLocationsTable.heading,
    })
    .from(faultsTable)
    .leftJoin(teamUsersTable,     eq(faultsTable.assignedTechId, teamUsersTable.id))
    .leftJoin(techLocationsTable, eq(faultsTable.assignedTechId, techLocationsTable.userId))
    .where(isNull(faultsTable.resolvedAt))
    .orderBy(sql`${faultsTable.receivedAt} DESC`);

  const enriched = await Promise.all(rows.map(async row => {
    if (row.techLat == null || row.techLng == null) {
      return { ...row, routePolyline: null, distanceKm: null, roadEta: row.eta };
    }
    const route = await getDirectionsRoute(
      row.techLat, row.techLng,
      row.siteLat, row.siteLng,
    );
    if (!route) {
      return { ...row, routePolyline: null, distanceKm: null, roadEta: row.eta };
    }
    if (route.etaMinutes !== row.eta) {
      await db.update(faultsTable)
        .set({ eta: route.etaMinutes })
        .where(eq(faultsTable.id, row.id));
    }
    return {
      ...row,
      routePolyline: route.polyline,
      distanceKm:    Math.round(route.distanceKm * 10) / 10,
      roadEta:       route.etaMinutes,
    };
  }));

  res.json(enriched);
});

/* ─── GET /api/faults/pbi-status ────────────────────────────────────────── */

router.get("/pbi-status", (_req: Request, res: Response): void => {
  const result = getLastSyncResult();
  if (!result) {
    res.json({ ok: false, syncedAt: null, pbiCount: 0, upserted: 0, closed: 0, errors: ["No sync has run yet"] });
    return;
  }
  res.json(result);
});

/* ─── POST /api/faults/pbi-sync  (manual trigger) ───────────────────────── */

router.post("/pbi-sync", async (_req: Request, res: Response): Promise<void> => {
  const result = await syncPbiToDb();
  res.json(result);
});

/* ─── GET /api/faults/pbi-probe  (show raw PBI column names for debugging) ─ */

router.get("/pbi-probe", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { probeColumns } = await import("../../lib/pbiSync.js");
    const result = await probeColumns();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ─── POST /api/faults/:id/dispatch  (manual or re-dispatch) ────────────── */

router.post("/:id/dispatch", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const { techId } = req.body as { techId?: number };

  const [fault] = await db.select().from(faultsTable).where(eq(faultsTable.id, id));
  if (!fault) { res.status(404).json({ error: "Fault not found" }); return; }

  if (techId) {
    await assignTech(id, techId, fault.siteLat, fault.siteLng, fault.alarmName, fault.cowId, fault.backupTime);
  } else {
    await dispatchNearest(id, fault.siteLat, fault.siteLng, fault.alarmName, fault.cowId, fault.backupTime);
  }

  const [updated] = await db
    .select({
      id:             faultsTable.id,
      dispatchStatus: faultsTable.dispatchStatus,
      assignedTechId: faultsTable.assignedTechId,
      eta:            faultsTable.eta,
      assignedTech:   teamUsersTable.name,
    })
    .from(faultsTable)
    .leftJoin(teamUsersTable, eq(faultsTable.assignedTechId, teamUsersTable.id))
    .where(eq(faultsTable.id, id));

  res.json(updated);
});

/* ─── PATCH /api/faults/:id/status ──────────────────────────────────────── */

router.patch("/:id/status", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const { status } = req.body as { status?: string };
  const valid = ["new","assigned","en_route","on_site","resolved","closed"];
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    return;
  }

  const updates: Record<string, unknown> = { dispatchStatus: status };
  if (status === "resolved" || status === "closed") updates.resolvedAt = new Date();

  await db.update(faultsTable).set(updates).where(eq(faultsTable.id, id));
  res.json({ ok: true });
});

/* ─── GET /api/faults/:id/route  (live tech location for ETA) ────────────── */

router.get("/:id/route", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const [fault] = await db
    .select({
      id:             faultsTable.id,
      cowId:          faultsTable.cowId,
      siteLat:        faultsTable.siteLat,
      siteLng:        faultsTable.siteLng,
      dispatchStatus: faultsTable.dispatchStatus,
      assignedTechId: faultsTable.assignedTechId,
    })
    .from(faultsTable)
    .where(eq(faultsTable.id, id));

  if (!fault || !fault.assignedTechId) {
    res.status(404).json({ error: "Fault not found or no tech assigned" });
    return;
  }

  const [loc] = await db
    .select({ lat: techLocationsTable.lat, lng: techLocationsTable.lng, updatedAt: techLocationsTable.updatedAt })
    .from(techLocationsTable)
    .where(eq(techLocationsTable.userId, fault.assignedTechId));

  if (!loc) {
    res.json({ fault, techLocation: null, distanceKm: null, etaMinutes: null });
    return;
  }

  const distKm = haversineKm(loc.lat, loc.lng, fault.siteLat, fault.siteLng);
  const eta    = etaMinutes(distKm);

  await db.update(faultsTable).set({ eta }).where(eq(faultsTable.id, id));

  res.json({
    fault,
    techLocation: { lat: loc.lat, lng: loc.lng, updatedAt: loc.updatedAt },
    distanceKm:  Math.round(distKm * 10) / 10,
    etaMinutes:  eta,
  });
});

/* ─── internal helpers ───────────────────────────────────────────────────── */

async function dispatchNearest(
  faultId: number,
  siteLat: number, siteLng: number,
  alarmName: string, cowId: string,
  backupTime: string | null,
): Promise<void> {
  const locs = await db
    .select({
      userId:    techLocationsTable.userId,
      lat:       techLocationsTable.lat,
      lng:       techLocationsTable.lng,
      pushToken: teamUsersTable.pushToken,
      name:      teamUsersTable.name,
    })
    .from(techLocationsTable)
    .innerJoin(teamUsersTable, eq(techLocationsTable.userId, teamUsersTable.id))
    .where(
      and(
        eq(techLocationsTable.isOnDuty, true),
        eq(teamUsersTable.role, "technician"),
      ),
    );

  if (locs.length === 0) return;

  const sorted = locs
    .map(l => ({ ...l, dist: haversineKm(l.lat, l.lng, siteLat, siteLng) }))
    .sort((a, b) => a.dist - b.dist);

  const nearest = sorted[0];
  await assignTech(faultId, nearest.userId, siteLat, siteLng, alarmName, cowId, backupTime);
}

async function assignTech(
  faultId: number,
  techId: number,
  siteLat: number, siteLng: number,
  alarmName: string, cowId: string,
  backupTime: string | null,
): Promise<void> {
  const [loc] = await db
    .select({ lat: techLocationsTable.lat, lng: techLocationsTable.lng })
    .from(techLocationsTable)
    .where(eq(techLocationsTable.userId, techId));

  const distKm = loc ? haversineKm(loc.lat, loc.lng, siteLat, siteLng) : null;
  const eta    = distKm != null ? etaMinutes(distKm) : null;

  await db.update(faultsTable).set({
    assignedTechId: techId,
    dispatchStatus: "assigned",
    dispatchedAt:   new Date(),
    eta,
  }).where(eq(faultsTable.id, techId === techId ? faultId : faultId));

  const [tech] = await db
    .select({ pushToken: teamUsersTable.pushToken, name: teamUsersTable.name })
    .from(teamUsersTable)
    .where(eq(teamUsersTable.id, techId));

  const msg = [
    `🚨 NEW TT ASSIGNED`,
    `COW: ${cowId}`,
    `Alarm: ${alarmName}`,
    backupTime ? `Backup Time: ${backupTime}` : null,
    eta != null ? `ETA Required: ${eta} min` : null,
  ].filter(Boolean).join("\n");

  await sendPush(tech?.pushToken, "NEW TT ASSIGNED", msg);

  await db.insert(assignmentsTable).values({
    techId,
    managerId: 1,
    message: msg,
  }).catch(() => {});
}

/* ─── GET /api/faults/:id/trail  (breadcrumb history for live tracking) ──── */

router.get("/:id/trail", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const points = await db
    .select({
      lat:     faultTrackingPointsTable.lat,
      lng:     faultTrackingPointsTable.lng,
      speed:   faultTrackingPointsTable.speed,
      heading: faultTrackingPointsTable.heading,
      ts:      faultTrackingPointsTable.createdAt,
    })
    .from(faultTrackingPointsTable)
    .where(eq(faultTrackingPointsTable.faultId, id))
    .orderBy(faultTrackingPointsTable.createdAt)
    .limit(300);

  res.json(points);
});

export default router;
