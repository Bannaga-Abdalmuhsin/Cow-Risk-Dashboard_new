var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/logger.ts
import pino from "pino";
var isProduction, logger;
var init_logger = __esm({
  "src/lib/logger.ts"() {
    "use strict";
    isProduction = process.env.NODE_ENV === "production";
    logger = pino({
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
  }
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
var teamUsersTable, techLocationsTable, assignmentsTable, faultsTable;
var init_team = __esm({
  "../../lib/db/src/schema/team.ts"() {
    "use strict";
    teamUsersTable = pgTable("team_users", {
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
    techLocationsTable = pgTable("tech_locations", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().unique().references(() => teamUsersTable.id),
      lat: real("lat").notNull(),
      lng: real("lng").notNull(),
      area: text("area"),
      isOnDuty: boolean("is_on_duty").default(false).notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    assignmentsTable = pgTable("assignments", {
      id: serial("id").primaryKey(),
      techId: integer("tech_id").notNull().references(() => teamUsersTable.id),
      managerId: integer("manager_id").notNull().references(() => teamUsersTable.id),
      message: text("message").notNull(),
      sentAt: timestamp("sent_at").defaultNow().notNull(),
      readAt: timestamp("read_at"),
      reply: text("reply"),
      repliedAt: timestamp("replied_at")
    });
    faultsTable = pgTable("faults", {
      id: serial("id").primaryKey(),
      ttId: text("tt_id").notNull(),
      cowId: text("cow_id").notNull(),
      alarmName: text("alarm_name").notNull(),
      severity: text("severity").notNull(),
      powerSource: text("power_source"),
      backupTime: text("backup_time"),
      siteLat: real("site_lat").notNull(),
      siteLng: real("site_lng").notNull(),
      location: text("location"),
      assignedTechId: integer("assigned_tech_id").references(() => teamUsersTable.id),
      dispatchStatus: text("dispatch_status").notNull().default("new"),
      eta: integer("eta"),
      receivedAt: timestamp("received_at").defaultNow().notNull(),
      dispatchedAt: timestamp("dispatched_at"),
      resolvedAt: timestamp("resolved_at"),
      apiKey: text("api_key")
    });
  }
});

// ../../lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  assignmentsTable: () => assignmentsTable,
  faultsTable: () => faultsTable,
  teamUsersTable: () => teamUsersTable,
  techLocationsTable: () => techLocationsTable
});
var init_schema = __esm({
  "../../lib/db/src/schema/index.ts"() {
    "use strict";
    init_team();
  }
});

// ../../lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
var Pool, pool, db;
var init_src = __esm({
  "../../lib/db/src/index.ts"() {
    "use strict";
    init_schema();
    init_schema();
    ({ Pool } = pg);
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// src/lib/pbiSync.ts
var pbiSync_exports = {};
__export(pbiSync_exports, {
  getLastSyncResult: () => getLastSyncResult,
  probeColumns: () => probeColumns,
  syncPbiToDb: () => syncPbiToDb
});
import { eq as eq2, isNull } from "drizzle-orm";
function getLastSyncResult() {
  return lastSyncResult;
}
function bareKey(k) {
  return k.replace(/^[^[]*\[(.+)\]$/, "$1").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function col(row, ...names) {
  const needles = names.map((n) => n.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [k, v] of Object.entries(row)) {
    if (needles.includes(bareKey(k))) return v;
  }
  return void 0;
}
function str(v) {
  return v == null ? "" : String(v).trim();
}
function mapRow(row, source) {
  const ttId = str(col(row, "TT Number", "TTNumber", "TT ID", "TTID"));
  if (!ttId) return null;
  const rawSiteId = source === "power" ? str(col(row, "SITE ID", "SiteID", "Site ID", "Site")) : str(col(row, "Site", "SITE ID", "Site ID"));
  const cwnMatch = rawSiteId.match(/CWN\d{3}/i);
  const cowId = (cwnMatch ? cwnMatch[0] : rawSiteId).toUpperCase();
  if (!cowId) return null;
  const alarmName = source === "power" ? str(col(row, "Problem Description", "Issue", "SUMMARY", "Alarm Description")) || "Power Fault" : str(col(row, "Alarms Description", "Fault Type", "SUMMARY", "Problem Description")) || "Telecom Fault";
  const rawSev = str(col(row, "TT Severity", "Severity", "Priority")).toLowerCase();
  const severity = rawSev === "high" || rawSev === "critical" ? "critical" : rawSev === "medium" ? "major" : rawSev === "low" ? "minor" : "major";
  const location = source === "power" ? str(col(row, "District", "Region", "Area")) || null : str(col(row, "Area", "Region", "District")) || null;
  const powerSource = str(col(row, "Power Source", "Power source", "PowerSource")) || null;
  const tryKeys = [
    ...rawSiteId.toUpperCase().match(/CWN\d{3}/gi) ?? [],
    cowId.replace(/[^A-Z0-9]/g, "")
  ];
  let coords;
  for (const k of tryKeys) {
    coords = SITE_COORDS[k];
    if (coords) break;
  }
  if (!coords) return null;
  return {
    ttId,
    cowId,
    alarmName,
    severity,
    siteLat: coords.lat,
    siteLng: coords.lng,
    location,
    powerSource,
    source
  };
}
async function getAzureToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 6e4) return tokenCache.token;
  const tenantId = process.env.PBI_TENANT_ID;
  const clientId = process.env.PBI_CLIENT_ID;
  const clientSecret = process.env.PBI_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("PBI_TENANT_ID, PBI_CLIENT_ID, PBI_CLIENT_SECRET must be set");
  }
  const resp = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      }).toString()
    }
  );
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Azure AD token failed (${resp.status}): ${txt}`);
  }
  const data = await resp.json();
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1e3 };
  return tokenCache.token;
}
async function queryTable(token, workspaceId, datasetId, dax) {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/executeQueries`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      queries: [{ query: dax }],
      serializerSettings: { includeNulls: true }
    })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`PBI executeQueries failed (${resp.status}): ${txt}`);
  }
  const data = await resp.json();
  return data.results?.[0]?.tables?.[0]?.rows ?? [];
}
async function fetchPbiTickets() {
  const token = await getAzureToken();
  const workspaceId = process.env.PBI_WORKSPACE_ID;
  const datasetId = process.env.PBI_DATASET_ID;
  const [powerRows, sirRows] = await Promise.all([
    queryTable(
      token,
      workspaceId,
      datasetId,
      `EVALUATE FILTER('Input Record', 'Input Record'[Status] <> "Closed" && 'Input Record'[Region] = "WR-HAJJ")`
    ),
    queryTable(
      token,
      workspaceId,
      datasetId,
      `EVALUATE FILTER('SIR', 'SIR'[Status] <> "Closed" && 'SIR'[Region] = "WR-HAJJ")`
    )
  ]);
  const tickets = [];
  for (const row of powerRows) {
    const t = mapRow(row, "power");
    if (t) tickets.push(t);
  }
  for (const row of sirRows) {
    const t = mapRow(row, "sir");
    if (t) tickets.push(t);
  }
  return { tickets, powerCount: powerRows.length, sirCount: sirRows.length };
}
async function probeColumns() {
  const token = await getAzureToken();
  const workspaceId = process.env.PBI_WORKSPACE_ID;
  const datasetId = process.env.PBI_DATASET_ID;
  const [powerRows, sirRows] = await Promise.all([
    queryTable(
      token,
      workspaceId,
      datasetId,
      `EVALUATE SELECTCOLUMNS(FILTER('Input Record', 'Input Record'[Status] <> "Closed"), "TT", 'Input Record'[TT Number], "SITEID", 'Input Record'[SITE ID], "Status", 'Input Record'[Status], "Sev", 'Input Record'[TT Severity], "Region", 'Input Record'[Region])`
    ),
    queryTable(
      token,
      workspaceId,
      datasetId,
      `EVALUATE SELECTCOLUMNS(FILTER('SIR', 'SIR'[Status] <> "Closed"), "TT", 'SIR'[TT Number], "Site", 'SIR'[Site], "Status", 'SIR'[Status], "Sev", 'SIR'[TT Severity], "Region", 'SIR'[Region])`
    )
  ]);
  return {
    inputRecord: { columns: powerRows[0] ? Object.keys(powerRows[0]) : [], openRows: powerRows },
    sir: { columns: sirRows[0] ? Object.keys(sirRows[0]) : [], openRows: sirRows.slice(0, 10) }
  };
}
async function syncPbiToDb() {
  if (syncInProgress) {
    return lastSyncResult ?? {
      syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      pbiCount: 0,
      powerCount: 0,
      sirCount: 0,
      upserted: 0,
      closed: 0,
      errors: ["Sync already in progress"],
      ok: false
    };
  }
  syncInProgress = true;
  const errors = [];
  let upserted = 0;
  let closed = 0;
  let pbiCount = 0;
  let powerCount = 0;
  let sirCount = 0;
  try {
    const result = await fetchPbiTickets();
    pbiCount = result.tickets.length;
    powerCount = result.powerCount;
    sirCount = result.sirCount;
    const pbiTtIds = new Set(result.tickets.map((t) => t.ttId));
    const openFaults = await db.select({ id: faultsTable.id, ttId: faultsTable.ttId }).from(faultsTable).where(isNull(faultsTable.resolvedAt));
    const dbOpenTtIds = new Set(openFaults.map((f) => f.ttId));
    for (const ticket of result.tickets) {
      if (dbOpenTtIds.has(ticket.ttId)) continue;
      try {
        await db.insert(faultsTable).values({
          ttId: ticket.ttId,
          cowId: ticket.cowId,
          alarmName: ticket.alarmName,
          severity: ticket.severity,
          siteLat: ticket.siteLat,
          siteLng: ticket.siteLng,
          location: ticket.location,
          powerSource: ticket.powerSource,
          dispatchStatus: "new",
          apiKey: `pbi-sync:${ticket.source}`
        });
        upserted++;
        logger.info({ ttId: ticket.ttId, cowId: ticket.cowId, source: ticket.source }, "PBI: new ticket inserted");
      } catch (err) {
        const msg = String(err);
        if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("23505")) {
          logger.info({ ttId: ticket.ttId }, "PBI: skipping duplicate insert (already exists)");
        } else {
          errors.push(`insert ${ticket.ttId}: ${msg}`);
        }
      }
    }
    for (const fault of openFaults) {
      if (pbiTtIds.has(fault.ttId)) continue;
      try {
        await db.update(faultsTable).set({ dispatchStatus: "closed", resolvedAt: /* @__PURE__ */ new Date() }).where(eq2(faultsTable.id, fault.id));
        closed++;
        logger.info({ ttId: fault.ttId }, "PBI: ticket auto-closed (absent from PBI)");
      } catch (err) {
        errors.push(`close ${fault.ttId}: ${String(err)}`);
      }
    }
  } catch (err) {
    errors.push(String(err));
    logger.warn({ err }, "PBI sync error");
  } finally {
    syncInProgress = false;
  }
  const syncResult = {
    syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    pbiCount,
    powerCount,
    sirCount,
    upserted,
    closed,
    errors,
    ok: errors.length === 0
  };
  lastSyncResult = syncResult;
  if (errors.length > 0) {
    logger.warn({ errors }, "PBI sync finished with errors");
  } else {
    logger.info({ pbiCount, powerCount, sirCount, upserted, closed }, "PBI sync OK");
  }
  return syncResult;
}
var SITE_COORDS, lastSyncResult, syncInProgress, tokenCache;
var init_pbiSync = __esm({
  "src/lib/pbiSync.ts"() {
    "use strict";
    init_src();
    init_logger();
    SITE_COORDS = {
      CWN960: { lat: 21.347135, lng: 39.992573 },
      CWN072: { lat: 21.34196, lng: 39.97602 },
      CWN922: { lat: 21.404058, lng: 39.916064 },
      CWN970: { lat: 21.409075, lng: 39.905872 },
      CWN992: { lat: 21.389249, lng: 39.906895 },
      CWN021: { lat: 21.3934192, lng: 39.9166466 },
      CWN997: { lat: 21.38314, lng: 39.904478 },
      CWN008: { lat: 21.3513851, lng: 39.9812917 },
      CWN906: { lat: 21.37625, lng: 39.98233 },
      CWN213: { lat: 21.3645, lng: 39.9082 },
      CWN074: { lat: 21.388397, lng: 39.90236 },
      CWN068: { lat: 21.39217, lng: 39.91244 },
      CWN212: { lat: 21.366124, lng: 39.984126 },
      CWN300: { lat: 21.386604, lng: 39.897081 },
      CWN214: { lat: 21.39194, lng: 39.903738 },
      CWN073: { lat: 21.3738433, lng: 39.9865483 },
      CWN996: { lat: 21.374231, lng: 39.980616 },
      CWN923: { lat: 21.361257, lng: 39.973944 },
      CWN002: { lat: 21.42045, lng: 39.87142 },
      CWN998: { lat: 21.647214, lng: 40.389186 },
      CWN203: { lat: 21.354658, lng: 39.986218 },
      CWN961: { lat: 21.398381, lng: 39.89731 },
      CWN066: { lat: 21.3905912, lng: 39.9199632 },
      CWN777: { lat: 21.395908, lng: 39.899677 },
      CWN105: { lat: 21.356535, lng: 39.984813 },
      CWN984: { lat: 21.348754, lng: 39.995701 },
      CWN967: { lat: 21.631015, lng: 40.427249 },
      CWN020: { lat: 21.35047, lng: 39.96813 },
      CWN004: { lat: 21.387678, lng: 39.896187 },
      CWN211: { lat: 21.386633, lng: 39.911309 },
      CWN050: { lat: 21.38536, lng: 40.00519 },
      CWN084: { lat: 21.342528, lng: 39.962167 },
      CWN301: { lat: 21.386942, lng: 39.89955 },
      CWN201: { lat: 21.4206848, lng: 39.8809927 },
      CWN208: { lat: 21.402445, lng: 39.916322 },
      CWN001: { lat: 21.33728, lng: 39.957769 },
      CWN080: { lat: 21.378152, lng: 39.990098 },
      CWN078: { lat: 21.34051, lng: 39.99548 },
      CWN075: { lat: 21.346996, lng: 39.957369 },
      CWN087: { lat: 21.35694, lng: 39.97782 },
      CWN085: { lat: 21.36681, lng: 39.96439 },
      CWN089: { lat: 21.384184, lng: 39.910808 },
      CWN076: { lat: 21.3692, lng: 39.977127 },
      CWN955: { lat: 21.389818, lng: 39.897434 },
      CWN081: { lat: 20.99354, lng: 39.58815 },
      CWN083: { lat: 21.331372, lng: 39.965547 },
      CWN108: { lat: 21.34916, lng: 39.98367 },
      CWN036: { lat: 21.37989, lng: 39.944133 },
      CWN994: { lat: 21.42346, lng: 39.89534 },
      CWN951: { lat: 21.36258, lng: 39.96906 },
      CWN956: { lat: 21.3704107, lng: 39.9854222 },
      CWN202: { lat: 21.397049, lng: 39.903512 },
      CWN901: { lat: 21.372652, lng: 39.989533 },
      CWN914: { lat: 21.365421, lng: 39.971661 },
      CWN953: { lat: 21.418835, lng: 39.892713 },
      CWN976: { lat: 21.40275, lng: 39.89751 },
      CWN980: { lat: 21.371837, lng: 39.985979 },
      CWN978: { lat: 21.421776, lng: 39.891894 },
      CWN015: { lat: 21.377645, lng: 39.986816 },
      CWN959: { lat: 21.417782, lng: 39.910356 },
      CWN991: { lat: 21.37224, lng: 39.93826 },
      CWN915: { lat: 21.383061, lng: 39.925555 },
      CWN101: { lat: 21.388356, lng: 39.927744 },
      CWN093: { lat: 21.3568, lng: 39.93535 },
      CWN104: { lat: 21.376644, lng: 39.918992 },
      CWN972: { lat: 21.360682, lng: 39.916155 },
      CWN032: { lat: 21.3599709, lng: 39.9122733 },
      CWN079: { lat: 21.3615, lng: 39.9179 },
      CWN903: { lat: 21.359944, lng: 39.947977 },
      CWN102: { lat: 21.364592, lng: 39.905877 },
      CWN022: { lat: 21.335685, lng: 39.989205 },
      CWN205: { lat: 21.396241, lng: 39.914628 },
      CWN062: { lat: 21.3818, lng: 39.89885 },
      CWN038: { lat: 21.328514, lng: 39.961343 },
      CWN907: { lat: 21.4011089, lng: 39.9086724 },
      CWN099: { lat: 21.369688, lng: 39.901264 },
      CWN092: { lat: 21.333244, lng: 39.971526 },
      CWN206: { lat: 21.390274, lng: 39.928265 }
    };
    lastSyncResult = null;
    syncInProgress = false;
    tokenCache = null;
  }
});

// src/app.ts
init_logger();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// src/routes/index.ts
import { Router as Router4 } from "express";

// src/routes/health.ts
import { Router } from "express";
var router = Router();
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});
var health_default = router;

// src/routes/team/index.ts
init_src();
import { Router as Router2 } from "express";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

// src/lib/firebase.ts
init_logger();
import admin from "firebase-admin";
var _app = null;
function getApp() {
  if (_app) return _app;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
  const cert = JSON.parse(raw);
  _app = admin.initializeApp({ credential: admin.credential.cert(cert) });
  logger.info({ projectId: cert.projectId }, "Firebase Admin SDK initialised");
  return _app;
}
async function sendFcmNotification(token, title, body) {
  const app2 = getApp();
  await app2.messaging().send({
    token,
    notification: { title, body },
    android: {
      priority: "high",
      notification: { sound: "default", channelId: "aces-tasks" }
    }
  });
}

// src/routes/team/index.ts
var router2 = Router2();
async function sendPush(to, title, body) {
  if (!to) return;
  try {
    if (to.startsWith("ExponentPushToken")) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ to, title, body, sound: "default", priority: "high" })
      });
    } else {
      await sendFcmNotification(to, title, body);
    }
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
router2.post("/admin/cleanup-dupes", requireManager, async (_req, res) => {
  const { sql: sql2 } = await import("drizzle-orm");
  const result = await db.execute(sql2`
    DELETE FROM team_users
    WHERE id NOT IN (SELECT MIN(id) FROM team_users GROUP BY name)
    RETURNING id, name
  `);
  const rows = result.rows;
  res.json({ deleted: rows.length, users: rows });
});
var team_default = router2;

// src/routes/faults/index.ts
init_src();
import { Router as Router3 } from "express";
import { eq as eq3, and, isNull as isNull2, sql } from "drizzle-orm";

// src/routes/faults/directions.ts
var GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "";
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}
async function getDirectionsRoute(originLat, originLng, destLat, destLng) {
  if (!GOOGLE_API_KEY) return null;
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.set("origin", `${originLat},${originLng}`);
    url.searchParams.set("destination", `${destLat},${destLng}`);
    url.searchParams.set("mode", "driving");
    url.searchParams.set("key", GOOGLE_API_KEY);
    const resp = await fetch(url.toString());
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.status !== "OK" || data.routes.length === 0) return null;
    const route = data.routes[0];
    const leg = route.legs[0];
    const distKm = leg.distance.value / 1e3;
    const etaMins = Math.ceil(leg.duration.value / 60);
    const polyline = decodePolyline(route.overview_polyline.points);
    return { polyline, distanceKm: distKm, etaMinutes: etaMins };
  } catch {
    return null;
  }
}

// src/routes/faults/index.ts
init_pbiSync();
var router3 = Router3();
async function sendPush2(to, title, body) {
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
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function etaMinutes(distKm) {
  return Math.round(distKm / 40 * 60);
}
function verifyApiKey(req, res) {
  const key = req.headers["x-api-key"] ?? req.query.apiKey;
  const expected = process.env.FAULT_API_KEY;
  if (expected && key !== expected) {
    res.status(401).json({ error: "Invalid API key" });
    return false;
  }
  return true;
}
router3.post("/", async (req, res) => {
  if (!verifyApiKey(req, res)) return;
  const {
    ttId,
    cowId,
    alarmName,
    severity,
    powerSource,
    backupTime,
    siteLat,
    siteLng,
    location,
    autoDispatch
  } = req.body;
  if (!ttId || !cowId || !alarmName || !severity || siteLat == null || siteLng == null) {
    res.status(400).json({ error: "ttId, cowId, alarmName, severity, siteLat, siteLng required" });
    return;
  }
  const [existing] = await db.select().from(faultsTable).where(and(eq3(faultsTable.ttId, ttId), isNull2(faultsTable.resolvedAt)));
  if (existing) {
    res.status(200).json(existing);
    return;
  }
  const [fault] = await db.insert(faultsTable).values({
    ttId,
    cowId,
    alarmName,
    severity,
    powerSource: powerSource ?? null,
    backupTime: backupTime ?? null,
    siteLat,
    siteLng,
    location: location ?? null,
    dispatchStatus: "new"
  }).returning();
  if (autoDispatch !== false) {
    await dispatchNearest(fault.id, siteLat, siteLng, alarmName, cowId, backupTime ?? null);
    const [updated] = await db.select().from(faultsTable).where(eq3(faultsTable.id, fault.id));
    res.status(201).json(updated);
    return;
  }
  res.status(201).json(fault);
});
router3.get("/active", async (_req, res) => {
  const rows = await db.select({
    id: faultsTable.id,
    ttId: faultsTable.ttId,
    cowId: faultsTable.cowId,
    alarmName: faultsTable.alarmName,
    severity: faultsTable.severity,
    powerSource: faultsTable.powerSource,
    backupTime: faultsTable.backupTime,
    siteLat: faultsTable.siteLat,
    siteLng: faultsTable.siteLng,
    location: faultsTable.location,
    dispatchStatus: faultsTable.dispatchStatus,
    eta: faultsTable.eta,
    receivedAt: faultsTable.receivedAt,
    dispatchedAt: faultsTable.dispatchedAt,
    assignedTechId: faultsTable.assignedTechId,
    assignedTech: teamUsersTable.name,
    techLat: techLocationsTable.lat,
    techLng: techLocationsTable.lng,
    techArea: techLocationsTable.area
  }).from(faultsTable).leftJoin(teamUsersTable, eq3(faultsTable.assignedTechId, teamUsersTable.id)).leftJoin(techLocationsTable, eq3(faultsTable.assignedTechId, techLocationsTable.userId)).where(isNull2(faultsTable.resolvedAt)).orderBy(sql`${faultsTable.receivedAt} DESC`);
  const enriched = await Promise.all(rows.map(async (row) => {
    if (row.techLat == null || row.techLng == null) {
      return { ...row, routePolyline: null, distanceKm: null, roadEta: row.eta };
    }
    const route = await getDirectionsRoute(
      row.techLat,
      row.techLng,
      row.siteLat,
      row.siteLng
    );
    if (!route) {
      return { ...row, routePolyline: null, distanceKm: null, roadEta: row.eta };
    }
    if (route.etaMinutes !== row.eta) {
      await db.update(faultsTable).set({ eta: route.etaMinutes }).where(eq3(faultsTable.id, row.id));
    }
    return {
      ...row,
      routePolyline: route.polyline,
      distanceKm: Math.round(route.distanceKm * 10) / 10,
      roadEta: route.etaMinutes
    };
  }));
  res.json(enriched);
});
router3.get("/pbi-status", (_req, res) => {
  const result = getLastSyncResult();
  if (!result) {
    res.json({ ok: false, syncedAt: null, pbiCount: 0, upserted: 0, closed: 0, errors: ["No sync has run yet"] });
    return;
  }
  res.json(result);
});
router3.post("/pbi-sync", async (_req, res) => {
  const result = await syncPbiToDb();
  res.json(result);
});
router3.get("/pbi-probe", async (_req, res) => {
  try {
    const { probeColumns: probeColumns2 } = await Promise.resolve().then(() => (init_pbiSync(), pbiSync_exports));
    const result = await probeColumns2();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
router3.post("/:id/dispatch", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const { techId } = req.body;
  const [fault] = await db.select().from(faultsTable).where(eq3(faultsTable.id, id));
  if (!fault) {
    res.status(404).json({ error: "Fault not found" });
    return;
  }
  if (techId) {
    await assignTech(id, techId, fault.siteLat, fault.siteLng, fault.alarmName, fault.cowId, fault.backupTime);
  } else {
    await dispatchNearest(id, fault.siteLat, fault.siteLng, fault.alarmName, fault.cowId, fault.backupTime);
  }
  const [updated] = await db.select({
    id: faultsTable.id,
    dispatchStatus: faultsTable.dispatchStatus,
    assignedTechId: faultsTable.assignedTechId,
    eta: faultsTable.eta,
    assignedTech: teamUsersTable.name
  }).from(faultsTable).leftJoin(teamUsersTable, eq3(faultsTable.assignedTechId, teamUsersTable.id)).where(eq3(faultsTable.id, id));
  res.json(updated);
});
router3.patch("/:id/status", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const { status } = req.body;
  const valid = ["new", "assigned", "en_route", "on_site", "resolved", "closed"];
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    return;
  }
  const updates = { dispatchStatus: status };
  if (status === "resolved" || status === "closed") updates.resolvedAt = /* @__PURE__ */ new Date();
  await db.update(faultsTable).set(updates).where(eq3(faultsTable.id, id));
  res.json({ ok: true });
});
router3.get("/:id/route", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const [fault] = await db.select({
    id: faultsTable.id,
    cowId: faultsTable.cowId,
    siteLat: faultsTable.siteLat,
    siteLng: faultsTable.siteLng,
    dispatchStatus: faultsTable.dispatchStatus,
    assignedTechId: faultsTable.assignedTechId
  }).from(faultsTable).where(eq3(faultsTable.id, id));
  if (!fault || !fault.assignedTechId) {
    res.status(404).json({ error: "Fault not found or no tech assigned" });
    return;
  }
  const [loc] = await db.select({ lat: techLocationsTable.lat, lng: techLocationsTable.lng, updatedAt: techLocationsTable.updatedAt }).from(techLocationsTable).where(eq3(techLocationsTable.userId, fault.assignedTechId));
  if (!loc) {
    res.json({ fault, techLocation: null, distanceKm: null, etaMinutes: null });
    return;
  }
  const distKm = haversineKm(loc.lat, loc.lng, fault.siteLat, fault.siteLng);
  const eta = etaMinutes(distKm);
  await db.update(faultsTable).set({ eta }).where(eq3(faultsTable.id, id));
  res.json({
    fault,
    techLocation: { lat: loc.lat, lng: loc.lng, updatedAt: loc.updatedAt },
    distanceKm: Math.round(distKm * 10) / 10,
    etaMinutes: eta
  });
});
async function dispatchNearest(faultId, siteLat, siteLng, alarmName, cowId, backupTime) {
  const locs = await db.select({
    userId: techLocationsTable.userId,
    lat: techLocationsTable.lat,
    lng: techLocationsTable.lng,
    pushToken: teamUsersTable.pushToken,
    name: teamUsersTable.name
  }).from(techLocationsTable).innerJoin(teamUsersTable, eq3(techLocationsTable.userId, teamUsersTable.id)).where(
    and(
      eq3(techLocationsTable.isOnDuty, true),
      eq3(teamUsersTable.role, "technician")
    )
  );
  if (locs.length === 0) return;
  const sorted = locs.map((l) => ({ ...l, dist: haversineKm(l.lat, l.lng, siteLat, siteLng) })).sort((a, b) => a.dist - b.dist);
  const nearest = sorted[0];
  await assignTech(faultId, nearest.userId, siteLat, siteLng, alarmName, cowId, backupTime);
}
async function assignTech(faultId, techId, siteLat, siteLng, alarmName, cowId, backupTime) {
  const [loc] = await db.select({ lat: techLocationsTable.lat, lng: techLocationsTable.lng }).from(techLocationsTable).where(eq3(techLocationsTable.userId, techId));
  const distKm = loc ? haversineKm(loc.lat, loc.lng, siteLat, siteLng) : null;
  const eta = distKm != null ? etaMinutes(distKm) : null;
  await db.update(faultsTable).set({
    assignedTechId: techId,
    dispatchStatus: "assigned",
    dispatchedAt: /* @__PURE__ */ new Date(),
    eta
  }).where(eq3(faultsTable.id, techId === techId ? faultId : faultId));
  const [tech] = await db.select({ pushToken: teamUsersTable.pushToken, name: teamUsersTable.name }).from(teamUsersTable).where(eq3(teamUsersTable.id, techId));
  const msg = [
    `\u{1F6A8} NEW TT ASSIGNED`,
    `COW: ${cowId}`,
    `Alarm: ${alarmName}`,
    backupTime ? `Backup Time: ${backupTime}` : null,
    eta != null ? `ETA Required: ${eta} min` : null
  ].filter(Boolean).join("\n");
  await sendPush2(tech?.pushToken, "NEW TT ASSIGNED", msg);
  await db.insert(assignmentsTable).values({
    techId,
    managerId: 1,
    message: msg
  }).catch(() => {
  });
}
var faults_default = router3;

// src/routes/index.ts
var router4 = Router4();
router4.use(health_default);
router4.use("/team", team_default);
router4.use("/faults", faults_default);
var routes_default = router4;

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

// src/index.ts
init_logger();

// src/seed.ts
init_src();
init_logger();
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
init_src();
var PORT = Number(process.env.PORT ?? 8080);
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
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS faults_active_ttid_idx
    ON faults(tt_id)
    WHERE resolved_at IS NULL
  `);
  logger.info("Migrations complete");
}
app_default.listen(PORT, "0.0.0.0", async () => {
  logger.info({ port: PORT }, "API server started");
  try {
    await runMigrations();
  } catch (err) {
    logger.error({ err }, "Migration failed \u2014 continuing anyway");
  }
  try {
    await seedTeam();
  } catch (err) {
    logger.error({ err }, "Seed failed \u2014 continuing anyway");
  }
  if (process.env.PBI_TENANT_ID && process.env.PBI_CLIENT_ID && process.env.PBI_DATASET_ID) {
    const { syncPbiToDb: syncPbiToDb2 } = await Promise.resolve().then(() => (init_pbiSync(), pbiSync_exports));
    const runSync = () => syncPbiToDb2().catch((err) => logger.warn({ err }, "PBI sync failed"));
    runSync();
    setInterval(runSync, 6e4);
    logger.info("PBI auto-sync started (60 s interval)");
  } else {
    logger.warn("PBI env vars not set \u2014 auto-sync disabled");
  }
});
