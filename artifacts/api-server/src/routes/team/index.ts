import { Router, type Request, type Response, type NextFunction } from "express";
import { eq, desc, and, isNull } from "drizzle-orm";
import { db, teamUsersTable, techLocationsTable, assignmentsTable, faultsTable, faultTrackingPointsTable } from "@workspace/db";
import type { TeamUser } from "@workspace/db";
import { randomUUID } from "crypto";
import { sendFcmNotification } from "../../lib/firebase.js";
import { broadcastLocation } from "../../lib/wsHub.js";
import { runGeofenceChecks } from "../../lib/geofence.js";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const router = Router();

/* ─── push helper ─────────────────────────────────────────────────────────── */

async function sendPush(to: string | null | undefined, title: string, body: string): Promise<void> {
  if (!to) return;
  try {
    if (to.startsWith("ExponentPushToken")) {
      // Expo push service fallback (development / non-FCM builds)
      await fetch("https://exp.host/--/api/v2/push/send", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ to, title, body, sound: "default", priority: "high" }),
      });
    } else {
      // Raw FCM device token — use Firebase Admin SDK (FCM v1 API)
      await sendFcmNotification(to, title, body);
    }
  } catch {}
}

/* ─── auth middleware ─────────────────────────────────────────────────────── */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      teamUser?: TeamUser;
    }
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token  = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [user] = await db.select().from(teamUsersTable).where(eq(teamUsersTable.token, token));
  if (!user)   { res.status(401).json({ error: "Invalid token" }); return; }
  req.teamUser = user;
  next();
}

async function requireManager(req: Request, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    if (req.teamUser!.role !== "manager") {
      res.status(403).json({ error: "Manager only" });
      return;
    }
    next();
  });
}

/* ─── POST /api/team/login ───────────────────────────────────────────────── */

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { name, pin } = req.body as { name?: string; pin?: string };
  if (!name || !pin) { res.status(400).json({ error: "name and pin required" }); return; }

  const [user] = await db
    .select()
    .from(teamUsersTable)
    .where(eq(teamUsersTable.name, name));

  if (!user || user.pin !== pin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = user.token ?? randomUUID();
  if (!user.token) {
    await db.update(teamUsersTable).set({ token }).where(eq(teamUsersTable.id, user.id));
  }

  res.json({
    user:  { id: user.id, name: user.name, role: user.role },
    token,
  });
});

/* ─── POST /api/team/push-token ──────────────────────────────────────────── */

router.post("/push-token", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { pushToken } = req.body as { pushToken?: string };
  if (!pushToken) { res.status(400).json({ error: "pushToken required" }); return; }

  await db
    .update(teamUsersTable)
    .set({ pushToken })
    .where(eq(teamUsersTable.id, req.teamUser!.id));

  res.json({ ok: true });
});

/* ─── PUT /api/team/location ─────────────────────────────────────────────── */

router.put("/location", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { lat, lng, area, isOnDuty, speed, heading, accuracy } = req.body as {
    lat?: number; lng?: number; area?: string; isOnDuty?: boolean;
    speed?: number; heading?: number; accuracy?: number;
  };
  if (lat == null || lng == null) { res.status(400).json({ error: "lat/lng required" }); return; }

  /* ── 25 m accuracy filter — silently accept but skip DB write for noisy readings ── */
  if (accuracy != null && accuracy > 25) {
    res.json({ ok: true, filtered: true });
    return;
  }

  const user      = req.teamUser!;
  const userId    = user.id;
  const updatedAt = new Date();

  await db
    .insert(techLocationsTable)
    .values({
      userId, lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt,
      speed: speed ?? null, heading: heading ?? null, accuracy: accuracy ?? null,
    })
    .onConflictDoUpdate({
      target: techLocationsTable.userId,
      set:    {
        lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt,
        speed: speed ?? null, heading: heading ?? null, accuracy: accuracy ?? null,
      },
    });

  /* ── push real-time update to all WS subscribers ── */
  broadcastLocation({
    id:          userId,
    userId,
    userName:    user.name,
    role:        user.role,
    defaultArea: user.defaultArea ?? null,
    lat, lng,
    accuracy: accuracy ?? null,
    speed:    speed    ?? null,
    heading:  heading  ?? null,
    area:     area     ?? null,
    isOnDuty: isOnDuty ?? true,
    updatedAt: updatedAt.toISOString(),
  });

  /* ── Geofence: MC departure (50 m) + site arrival (100 m) ─────────────── */
  await runGeofenceChecks(
    userId, lat, lng,
    speed ?? null, heading ?? null, accuracy ?? null,
    user.mcLat ?? null, user.mcLng ?? null,
  );

  res.json({ ok: true });
});

/* ─── GET /api/team/my-fault  (active fault assigned to the requesting tech) */

router.get("/my-fault", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.teamUser!.id;

  const [fault] = await db
    .select({
      id:             faultsTable.id,
      cowId:          faultsTable.cowId,
      alarmName:      faultsTable.alarmName,
      severity:       faultsTable.severity,
      siteLat:        faultsTable.siteLat,
      siteLng:        faultsTable.siteLng,
      location:       faultsTable.location,
      dispatchStatus: faultsTable.dispatchStatus,
      eta:            faultsTable.eta,
      dispatchedAt:   faultsTable.dispatchedAt,
    })
    .from(faultsTable)
    .where(and(
      eq(faultsTable.assignedTechId, userId),
      isNull(faultsTable.resolvedAt),
    ))
    .orderBy(desc(faultsTable.receivedAt))
    .limit(1);

  res.json(fault ?? null);
});

/* ─── GET /api/team/locations ────────────────────────────────────────────── */

router.get("/locations", async (_req: Request, res: Response): Promise<void> => {
  const rows = await db
    .select({
      id:          techLocationsTable.id,
      userId:      techLocationsTable.userId,
      userName:    teamUsersTable.name,
      role:        teamUsersTable.role,
      defaultArea: teamUsersTable.defaultArea,
      lat:         techLocationsTable.lat,
      lng:         techLocationsTable.lng,
      area:        techLocationsTable.area,
      isOnDuty:    techLocationsTable.isOnDuty,
      updatedAt:   techLocationsTable.updatedAt,
    })
    .from(techLocationsTable)
    .innerJoin(teamUsersTable, eq(techLocationsTable.userId, teamUsersTable.id));

  res.json(rows);
});

/* ─── GET /api/team/users ─────────────────────────────────────────────────── */

router.get("/users", async (_req: Request, res: Response): Promise<void> => {
  const users = await db
    .select({
      id:           teamUsersTable.id,
      name:         teamUsersTable.name,
      role:         teamUsersTable.role,
      defaultArea:  teamUsersTable.defaultArea,
      mcName:       teamUsersTable.mcName,
      mcLat:        teamUsersTable.mcLat,
      mcLng:        teamUsersTable.mcLng,
      mobileNumber: teamUsersTable.mobileNumber,
    })
    .from(teamUsersTable);
  res.json(users);
});

/* ─── POST /api/team/users ────────────────────────────────────────────────── */

router.post("/users", requireManager, async (req: Request, res: Response): Promise<void> => {
  const { name, pin, role, defaultArea, mcName, mcLat, mcLng, mobileNumber } = req.body as {
    name?: string; pin?: string; role?: string; defaultArea?: string;
    mcName?: string; mcLat?: number; mcLng?: number; mobileNumber?: string;
  };
  if (!name || !pin) { res.status(400).json({ error: "name and pin required" }); return; }

  const existing = await db.select().from(teamUsersTable).where(eq(teamUsersTable.name, name));
  if (existing.length > 0) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  const [user] = await db
    .insert(teamUsersTable)
    .values({
      name,
      pin,
      role:         role ?? "technician",
      defaultArea:  defaultArea ?? null,
      mcName:       mcName ?? null,
      mcLat:        mcLat  ?? null,
      mcLng:        mcLng  ?? null,
      mobileNumber: mobileNumber ?? null,
    })
    .returning({
      id: teamUsersTable.id, name: teamUsersTable.name, role: teamUsersTable.role,
      defaultArea: teamUsersTable.defaultArea, mcName: teamUsersTable.mcName,
      mcLat: teamUsersTable.mcLat, mcLng: teamUsersTable.mcLng,
      mobileNumber: teamUsersTable.mobileNumber,
    });

  res.status(201).json(user);
});

/* ─── PATCH /api/team/users/:id ───────────────────────────────────────────── */

router.patch("/users/:id", requireManager, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const { name, pin, defaultArea, mcName, mcLat, mcLng, mobileNumber } = req.body as {
    name?: string; pin?: string; defaultArea?: string;
    mcName?: string; mcLat?: number | null; mcLng?: number | null; mobileNumber?: string;
  };

  if (name) {
    const existing = await db.select().from(teamUsersTable).where(eq(teamUsersTable.name, name));
    if (existing.length > 0 && existing[0].id !== id) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
  }

  const updates: Record<string, unknown> = {};
  if (name         !== undefined) updates.name         = name;
  if (pin          !== undefined) updates.pin          = pin;
  if (defaultArea  !== undefined) updates.defaultArea  = defaultArea || null;
  if (mcName       !== undefined) updates.mcName       = mcName || null;
  if (mcLat        !== undefined) updates.mcLat        = mcLat  ?? null;
  if (mcLng        !== undefined) updates.mcLng        = mcLng  ?? null;
  if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber || null;

  const [user] = await db
    .update(teamUsersTable)
    .set(updates)
    .where(eq(teamUsersTable.id, id))
    .returning({
      id: teamUsersTable.id, name: teamUsersTable.name, role: teamUsersTable.role,
      defaultArea: teamUsersTable.defaultArea, mcName: teamUsersTable.mcName,
      mcLat: teamUsersTable.mcLat, mcLng: teamUsersTable.mcLng,
      mobileNumber: teamUsersTable.mobileNumber,
    });

  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

/* ─── DELETE /api/team/users/:id ──────────────────────────────────────────── */

router.delete("/users/:id", requireManager, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }
  if (id === req.teamUser!.id) { res.status(400).json({ error: "Cannot delete yourself" }); return; }

  await db.delete(techLocationsTable).where(eq(techLocationsTable.userId, id));
  await db.delete(assignmentsTable).where(eq(assignmentsTable.techId, id));
  await db.delete(teamUsersTable).where(eq(teamUsersTable.id, id));

  res.json({ ok: true });
});

/* ─── POST /api/team/assignments ─────────────────────────────────────────── */

router.post("/assignments", requireAuth, async (req: Request, res: Response): Promise<void> => {
  if (req.teamUser!.role !== "manager") {
    res.status(403).json({ error: "Manager only" });
    return;
  }
  const { techId, message } = req.body as { techId?: number; message?: string };
  if (!techId || !message) { res.status(400).json({ error: "techId and message required" }); return; }

  const [assignment] = await db
    .insert(assignmentsTable)
    .values({ techId, managerId: req.teamUser!.id, message })
    .returning();

  const [tech] = await db
    .select({ pushToken: teamUsersTable.pushToken })
    .from(teamUsersTable)
    .where(eq(teamUsersTable.id, techId));

  sendPush(tech?.pushToken, `Task from ${req.teamUser!.name}`, message);

  res.status(201).json(assignment);
});

/* ─── POST /api/team/broadcast ───────────────────────────────────────────── */

router.post("/broadcast", requireManager, async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body as { message?: string };
  if (!message) { res.status(400).json({ error: "message required" }); return; }

  const techs = await db
    .select({ id: teamUsersTable.id, pushToken: teamUsersTable.pushToken })
    .from(teamUsersTable)
    .where(eq(teamUsersTable.role, "technician"));

  const managerId = req.teamUser!.id;
  const rows = techs.map(t => ({ techId: t.id, managerId, message }));
  if (rows.length > 0) {
    await db.insert(assignmentsTable).values(rows);
    for (const t of techs) {
      sendPush(t.pushToken, `Broadcast from ${req.teamUser!.name}`, message);
    }
  }

  res.json({ sent: rows.length });
});

/* ─── GET /api/team/assignments/my ──────────────────────────────────────── */

router.get("/assignments/my", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const [assignment] = await db
    .select({
      id:          assignmentsTable.id,
      message:     assignmentsTable.message,
      sentAt:      assignmentsTable.sentAt,
      readAt:      assignmentsTable.readAt,
      reply:       assignmentsTable.reply,
      repliedAt:   assignmentsTable.repliedAt,
      managerName: teamUsersTable.name,
      managerId:   assignmentsTable.managerId,
    })
    .from(assignmentsTable)
    .innerJoin(teamUsersTable, eq(assignmentsTable.managerId, teamUsersTable.id))
    .where(eq(assignmentsTable.techId, req.teamUser!.id))
    .orderBy(desc(assignmentsTable.sentAt))
    .limit(1);

  res.json(assignment ?? null);
});

/* ─── GET /api/team/assignments/:techId/history ──────────────────────────── */

router.get("/assignments/:techId/history", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.techId) ? req.params.techId[0] : req.params.techId;
  const techId = parseInt(rawId, 10);
  if (isNaN(techId)) { res.status(400).json({ error: "invalid techId" }); return; }

  const rows = await db
    .select({
      id:        assignmentsTable.id,
      message:   assignmentsTable.message,
      sentAt:    assignmentsTable.sentAt,
      readAt:    assignmentsTable.readAt,
      reply:     assignmentsTable.reply,
      repliedAt: assignmentsTable.repliedAt,
    })
    .from(assignmentsTable)
    .where(eq(assignmentsTable.techId, techId))
    .orderBy(desc(assignmentsTable.sentAt))
    .limit(30);

  res.json(rows);
});

/* ─── GET /api/team/assignments/:techId ──────────────────────────────────── */

router.get("/assignments/:techId", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.techId) ? req.params.techId[0] : req.params.techId;
  const techId = parseInt(rawId, 10);
  if (isNaN(techId)) { res.status(400).json({ error: "invalid techId" }); return; }

  const [assignment] = await db
    .select()
    .from(assignmentsTable)
    .where(eq(assignmentsTable.techId, techId))
    .orderBy(desc(assignmentsTable.sentAt))
    .limit(1);

  res.json(assignment ?? null);
});

/* ─── PATCH /api/team/assignments/:id/read ───────────────────────────────── */

router.patch("/assignments/:id/read", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  await db
    .update(assignmentsTable)
    .set({ readAt: new Date() })
    .where(eq(assignmentsTable.id, id));

  res.json({ ok: true });
});

/* ─── PATCH /api/team/assignments/:id/reply ──────────────────────────────── */

router.patch("/assignments/:id/reply", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const { reply } = req.body as { reply?: string };
  if (!reply?.trim()) { res.status(400).json({ error: "reply required" }); return; }

  const [updated] = await db
    .update(assignmentsTable)
    .set({ reply: reply.trim(), repliedAt: new Date(), readAt: new Date() })
    .where(eq(assignmentsTable.id, id))
    .returning({ managerId: assignmentsTable.managerId, techId: assignmentsTable.techId });

  if (!updated) { res.status(404).json({ error: "Assignment not found" }); return; }

  const [tech]    = await db.select({ name: teamUsersTable.name }).from(teamUsersTable).where(eq(teamUsersTable.id, updated.techId));
  const [manager] = await db.select({ pushToken: teamUsersTable.pushToken }).from(teamUsersTable).where(eq(teamUsersTable.id, updated.managerId));

  sendPush(manager?.pushToken, `Reply from ${tech?.name ?? "Technician"}`, reply.trim());

  res.json({ ok: true });
});

/* ─── POST /api/team/admin/cleanup-dupes ─────────────────────────────────── */

router.post("/admin/cleanup-dupes", requireManager, async (_req: Request, res: Response): Promise<void> => {
  const { sql } = await import("drizzle-orm");
  const result = await db.execute(sql`
    DELETE FROM team_users
    WHERE id NOT IN (SELECT MIN(id) FROM team_users GROUP BY name)
    RETURNING id, name
  `);
  const rows = result.rows as { id: number; name: string }[];
  res.json({ deleted: rows.length, users: rows });
});

export default router;
