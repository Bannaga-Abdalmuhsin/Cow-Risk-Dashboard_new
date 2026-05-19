var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// src/lib/logger.ts
import pino from "pino";
var isProduction = process.env.NODE_ENV === "production";
var logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']"
  ],
  ...isProduction ? {} : {
    transport: {
      target: "pino-pretty",
      options: { colorize: true }
    }
  }
});

// src/routes/index.ts
import { Router as Router3 } from "express";

// src/routes/health.ts
import { Router } from "express";
var router = Router();
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});
var health_default = router;

// src/routes/team/index.ts
import { Router as Router2 } from "express";
import { eq, desc } from "drizzle-orm";

// ../../lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ../../lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  assignmentsTable: () => assignmentsTable,
  teamUsersTable: () => teamUsersTable,
  techLocationsTable: () => techLocationsTable
});

// ../../lib/db/src/schema/team.ts
import {
  pgTable,
  text,
  serial,
  real,
  integer,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";
var teamUsersTable = pgTable("team_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  pin: text("pin").notNull(),
  token: text("token"),
  defaultArea: text("default_area"),
  mcName: text("mc_name"),
  mobileNumber: text("mobile_number"),
  pushToken: text("push_token"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var techLocationsTable = pgTable("tech_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => teamUsersTable.id),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  area: text("area"),
  isOnDuty: boolean("is_on_duty").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var assignmentsTable = pgTable("assignments", {
  id: serial("id").primaryKey(),
  techId: integer("tech_id").notNull().references(() => teamUsersTable.id),
  managerId: integer("manager_id").notNull().references(() => teamUsersTable.id),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  reply: text("reply"),
  repliedAt: timestamp("replied_at")
});

// ../../lib/db/src/index.ts
var { Pool } = pg;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// src/routes/team/index.ts
import { randomUUID } from "crypto";
var router2 = Router2();
async function sendPush(to, title, body) {
  if (!to || !to.startsWith("ExponentPushToken")) return;
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ to, title, body, sound: "default", priority: "high" })
    });
  } catch {
  }
}
async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(teamUsersTable).where(eq(teamUsersTable.token, token));
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  req.teamUser = user;
  next();
}
async function requireManager(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.teamUser.role !== "manager") {
      res.status(403).json({ error: "Manager only" });
      return;
    }
    next();
  });
}
router2.post("/login", async (req, res) => {
  const { name, pin } = req.body;
  if (!name || !pin) {
    res.status(400).json({ error: "name and pin required" });
    return;
  }
  const [user] = await db.select().from(teamUsersTable).where(eq(teamUsersTable.name, name));
  if (!user || user.pin !== pin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = user.token ?? randomUUID();
  if (!user.token) {
    await db.update(teamUsersTable).set({ token }).where(eq(teamUsersTable.id, user.id));
  }
  res.json({
    user: { id: user.id, name: user.name, role: user.role },
    token
  });
});
router2.post("/push-token", requireAuth, async (req, res) => {
  const { pushToken } = req.body;
  if (!pushToken) {
    res.status(400).json({ error: "pushToken required" });
    return;
  }
  await db.update(teamUsersTable).set({ pushToken }).where(eq(teamUsersTable.id, req.teamUser.id));
  res.json({ ok: true });
});
router2.put("/location", requireAuth, async (req, res) => {
  const { lat, lng, area, isOnDuty } = req.body;
  if (lat == null || lng == null) {
    res.status(400).json({ error: "lat/lng required" });
    return;
  }
  const userId = req.teamUser.id;
  const updatedAt = /* @__PURE__ */ new Date();
  await db.insert(techLocationsTable).values({ userId, lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt }).onConflictDoUpdate({
    target: techLocationsTable.userId,
    set: { lat, lng, area: area ?? null, isOnDuty: isOnDuty ?? true, updatedAt }
  });
  res.json({ ok: true });
});
router2.get("/locations", async (_req, res) => {
  const rows = await db.select({
    id: techLocationsTable.id,
    userId: techLocationsTable.userId,
    userName: teamUsersTable.name,
    role: teamUsersTable.role,
    defaultArea: teamUsersTable.defaultArea,
    lat: techLocationsTable.lat,
    lng: techLocationsTable.lng,
    area: techLocationsTable.area,
    isOnDuty: techLocationsTable.isOnDuty,
    updatedAt: techLocationsTable.updatedAt
  }).from(techLocationsTable).innerJoin(teamUsersTable, eq(techLocationsTable.userId, teamUsersTable.id));
  res.json(rows);
});
router2.get("/users", async (_req, res) => {
  const users = await db.select({
    id: teamUsersTable.id,
    name: teamUsersTable.name,
    role: teamUsersTable.role,
    defaultArea: teamUsersTable.defaultArea,
    mcName: teamUsersTable.mcName,
    mobileNumber: teamUsersTable.mobileNumber
  }).from(teamUsersTable);
  res.json(users);
});
router2.post("/users", requireManager, async (req, res) => {
  const { name, pin, role, defaultArea, mcName, mobileNumber } = req.body;
  if (!name || !pin) {
    res.status(400).json({ error: "name and pin required" });
    return;
  }
  const existing = await db.select().from(teamUsersTable).where(eq(teamUsersTable.name, name));
  if (existing.length > 0) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }
  const [user] = await db.insert(teamUsersTable).values({
    name,
    pin,
    role: role ?? "technician",
    defaultArea: defaultArea ?? null,
    mcName: mcName ?? null,
    mobileNumber: mobileNumber ?? null
  }).returning({
    id: teamUsersTable.id,
    name: teamUsersTable.name,
    role: teamUsersTable.role,
    defaultArea: teamUsersTable.defaultArea,
    mcName: teamUsersTable.mcName,
    mobileNumber: teamUsersTable.mobileNumber
  });
  res.status(201).json(user);
});
router2.patch("/users/:id", requireManager, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const { name, pin, defaultArea, mcName, mobileNumber } = req.body;
  if (name) {
    const existing = await db.select().from(teamUsersTable).where(eq(teamUsersTable.name, name));
    if (existing.length > 0 && existing[0].id !== id) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
  }
  const updates = {};
  if (name !== void 0) updates.name = name;
  if (pin !== void 0) updates.pin = pin;
  if (defaultArea !== void 0) updates.defaultArea = defaultArea || null;
  if (mcName !== void 0) updates.mcName = mcName || null;
  if (mobileNumber !== void 0) updates.mobileNumber = mobileNumber || null;
  const [user] = await db.update(teamUsersTable).set(updates).where(eq(teamUsersTable.id, id)).returning({
    id: teamUsersTable.id,
    name: teamUsersTable.name,
    role: teamUsersTable.role,
    defaultArea: teamUsersTable.defaultArea,
    mcName: teamUsersTable.mcName,
    mobileNumber: teamUsersTable.mobileNumber
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});
router2.delete("/users/:id", requireManager, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  if (id === req.teamUser.id) {
    res.status(400).json({ error: "Cannot delete yourself" });
    return;
  }
  await db.delete(techLocationsTable).where(eq(techLocationsTable.userId, id));
  await db.delete(assignmentsTable).where(eq(assignmentsTable.techId, id));
  await db.delete(teamUsersTable).where(eq(teamUsersTable.id, id));
  res.json({ ok: true });
});
router2.post("/assignments", requireAuth, async (req, res) => {
  if (req.teamUser.role !== "manager") {
    res.status(403).json({ error: "Manager only" });
    return;
  }
  const { techId, message } = req.body;
  if (!techId || !message) {
    res.status(400).json({ error: "techId and message required" });
    return;
  }
  const [assignment] = await db.insert(assignmentsTable).values({ techId, managerId: req.teamUser.id, message }).returning();
  const [tech] = await db.select({ pushToken: teamUsersTable.pushToken }).from(teamUsersTable).where(eq(teamUsersTable.id, techId));
  sendPush(tech?.pushToken, `Task from ${req.teamUser.name}`, message);
  res.status(201).json(assignment);
});
router2.post("/broadcast", requireManager, async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "message required" });
    return;
  }
  const techs = await db.select({ id: teamUsersTable.id, pushToken: teamUsersTable.pushToken }).from(teamUsersTable).where(eq(teamUsersTable.role, "technician"));
  const managerId = req.teamUser.id;
  const rows = techs.map((t) => ({ techId: t.id, managerId, message }));
  if (rows.length > 0) {
    await db.insert(assignmentsTable).values(rows);
    for (const t of techs) {
      sendPush(t.pushToken, `Broadcast from ${req.teamUser.name}`, message);
    }
  }
  res.json({ sent: rows.length });
});
router2.get("/assignments/my", requireAuth, async (req, res) => {
  const [assignment] = await db.select({
    id: assignmentsTable.id,
    message: assignmentsTable.message,
    sentAt: assignmentsTable.sentAt,
    readAt: assignmentsTable.readAt,
    reply: assignmentsTable.reply,
    repliedAt: assignmentsTable.repliedAt,
    managerName: teamUsersTable.name,
    managerId: assignmentsTable.managerId
  }).from(assignmentsTable).innerJoin(teamUsersTable, eq(assignmentsTable.managerId, teamUsersTable.id)).where(eq(assignmentsTable.techId, req.teamUser.id)).orderBy(desc(assignmentsTable.sentAt)).limit(1);
  res.json(assignment ?? null);
});
router2.get("/assignments/:techId/history", requireAuth, async (req, res) => {
  const rawId = Array.isArray(req.params.techId) ? req.params.techId[0] : req.params.techId;
  const techId = parseInt(rawId, 10);
  if (isNaN(techId)) {
    res.status(400).json({ error: "invalid techId" });
    return;
  }
  const rows = await db.select({
    id: assignmentsTable.id,
    message: assignmentsTable.message,
    sentAt: assignmentsTable.sentAt,
    readAt: assignmentsTable.readAt,
    reply: assignmentsTable.reply,
    repliedAt: assignmentsTable.repliedAt
  }).from(assignmentsTable).where(eq(assignmentsTable.techId, techId)).orderBy(desc(assignmentsTable.sentAt)).limit(30);
  res.json(rows);
});
router2.get("/assignments/:techId", requireAuth, async (req, res) => {
  const rawId = Array.isArray(req.params.techId) ? req.params.techId[0] : req.params.techId;
  const techId = parseInt(rawId, 10);
  if (isNaN(techId)) {
    res.status(400).json({ error: "invalid techId" });
    return;
  }
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.techId, techId)).orderBy(desc(assignmentsTable.sentAt)).limit(1);
  res.json(assignment ?? null);
});
router2.patch("/assignments/:id/read", requireAuth, async (req, res) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  await db.update(assignmentsTable).set({ readAt: /* @__PURE__ */ new Date() }).where(eq(assignmentsTable.id, id));
  res.json({ ok: true });
});
router2.patch("/assignments/:id/reply", requireAuth, async (req, res) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const { reply } = req.body;
  if (!reply?.trim()) {
    res.status(400).json({ error: "reply required" });
    return;
  }
  const [updated] = await db.update(assignmentsTable).set({ reply: reply.trim(), repliedAt: /* @__PURE__ */ new Date(), readAt: /* @__PURE__ */ new Date() }).where(eq(assignmentsTable.id, id)).returning({ managerId: assignmentsTable.managerId, techId: assignmentsTable.techId });
  if (!updated) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  const [tech] = await db.select({ name: teamUsersTable.name }).from(teamUsersTable).where(eq(teamUsersTable.id, updated.techId));
  const [manager] = await db.select({ pushToken: teamUsersTable.pushToken }).from(teamUsersTable).where(eq(teamUsersTable.id, updated.managerId));
  sendPush(manager?.pushToken, `Reply from ${tech?.name ?? "Technician"}`, reply.trim());
  res.json({ ok: true });
});
var team_default = router2;

// src/routes/index.ts
var router3 = Router3();
router3.use(health_default);
router3.use("/team", team_default);
var routes_default = router3;

// src/app.ts
var __dirnameEsm = dirname(fileURLToPath(import.meta.url));
var dashboardDist = join(__dirnameEsm, "../../hajj-dashboard/dist/public");
var app = express();
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      }
    }
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", routes_default);
if (process.env.NODE_ENV === "production" && existsSync(dashboardDist)) {
  app.use(express.static(dashboardDist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(join(dashboardDist, "index.html"));
  });
}
var app_default = app;

// src/seed.ts
var SEED_USERS = [
  { name: "Bannaga", role: "manager", pin: "1234@MSD" },
  { name: "Tech-01", role: "technician", pin: "0001" },
  { name: "Tech-02", role: "technician", pin: "0002" },
  { name: "Tech-03", role: "technician", pin: "0003" },
  { name: "Tech-04", role: "technician", pin: "0004" },
  { name: "Tech-05", role: "technician", pin: "0005" },
  { name: "Tech-06", role: "technician", pin: "0006" },
  { name: "Tech-07", role: "technician", pin: "0007" },
  { name: "Tech-08", role: "technician", pin: "0008" },
  { name: "Tech-09", role: "technician", pin: "0009" },
  { name: "Tech-10", role: "technician", pin: "0010" },
  { name: "Tech-11", role: "technician", pin: "0011" },
  { name: "Tech-12", role: "technician", pin: "0012" },
  { name: "Tech-13", role: "technician", pin: "0013" },
  { name: "Tech-14", role: "technician", pin: "0014" },
  { name: "Tech-15", role: "technician", pin: "0015" },
  { name: "Tech-16", role: "technician", pin: "0016" }
];
async function seedTeam() {
  const existing = await db.select().from(teamUsersTable).limit(1);
  if (existing.length > 0) {
    logger.info("Team users already seeded \u2014 skipping");
    return;
  }
  await db.insert(teamUsersTable).values(SEED_USERS);
  logger.info({ count: SEED_USERS.length }, "Team users seeded");
}

// src/index.ts
var PORT = Number(process.env.PORT ?? 8080);
app_default.listen(PORT, "0.0.0.0", async () => {
  logger.info({ port: PORT }, "API server started");
  try {
    await seedTeam();
  } catch (err) {
    logger.error({ err }, "Seed failed \u2014 continuing anyway");
  }
});
