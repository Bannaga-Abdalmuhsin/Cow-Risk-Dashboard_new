import { Router, type Request, type Response, type NextFunction } from "express";
import { eq, desc, ne } from "drizzle-orm";
import { db, teamUsersTable, techLocationsTable, assignmentsTable } from "@workspace/db";
import type { TeamUser } from "@workspace/db";
import { randomUUID } from "crypto";

const router = Router();

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

  const token = randomUUID();
  await db.update(teamUsersTable).set({ token }).where(eq(teamUsersTable.id, user.id));

  res.json({
    user:  { id: user.id, name: user.name, role: user.role },
    token,
  });
});

/* ─── PUT /api/team/location ─────────────────────────────────────────────── */

router.put("/location", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { lat, lng, area, isOnDuty } = req.body as {
    lat?: number; lng?: number; area?: string; isOnDuty?: boolean;
  };
  if (lat == null || lng == null) { res.status(400).json({ error: "lat/lng required" }); return; }

  const userId    = req.teamUser!.id;
  const updatedAt = new Date();

  await db
    .insert(techLocationsTable)
    .values({ userId, lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt })
    .onConflictDoUpdate({
      target: techLocationsTable.userId,
      set:    { lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt },
    });

  res.json({ ok: true });
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
      id:          teamUsersTable.id,
      name:        teamUsersTable.name,
      role:        teamUsersTable.role,
      defaultArea: teamUsersTable.defaultArea,
    })
    .from(teamUsersTable);
  res.json(users);
});

/* ─── POST /api/team/users ────────────────────────────────────────────────── */

router.post("/users", requireManager, async (req: Request, res: Response): Promise<void> => {
  const { name, pin, role, defaultArea } = req.body as {
    name?: string; pin?: string; role?: string; defaultArea?: string;
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
      role:        role ?? "technician",
      defaultArea: defaultArea ?? null,
    })
    .returning({ id: teamUsersTable.id, name: teamUsersTable.name, role: teamUsersTable.role, defaultArea: teamUsersTable.defaultArea });

  res.status(201).json(user);
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

  res.status(201).json(assignment);
});

/* ─── POST /api/team/broadcast ───────────────────────────────────────────── */

router.post("/broadcast", requireManager, async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body as { message?: string };
  if (!message) { res.status(400).json({ error: "message required" }); return; }

  const techs = await db
    .select({ id: teamUsersTable.id })
    .from(teamUsersTable)
    .where(eq(teamUsersTable.role, "technician"));

  const managerId = req.teamUser!.id;
  const rows = techs.map(t => ({ techId: t.id, managerId, message }));
  if (rows.length > 0) {
    await db.insert(assignmentsTable).values(rows);
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
      managerName: teamUsersTable.name,
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
      id:      assignmentsTable.id,
      message: assignmentsTable.message,
      sentAt:  assignmentsTable.sentAt,
      readAt:  assignmentsTable.readAt,
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

export default router;
