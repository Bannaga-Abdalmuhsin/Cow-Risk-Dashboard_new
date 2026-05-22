/**
 * WebSocket hub for real-time location streaming.
 *
 * Protocol (JSON messages):
 *   Client → Server:
 *     { type: "auth",      token: string }           — technician / manager auth
 *     { type: "subscribe" }                           — unauthenticated viewer (dashboard)
 *     { type: "location",  lat, lng, accuracy?, speed?, heading?, area?, isOnDuty? }
 *     { type: "ping" }
 *
 *   Server → Client:
 *     { type: "auth_ok",   role: string }
 *     { type: "auth_error" }
 *     { type: "locations_snapshot", locations: LocationBroadcast[] }
 *     { type: "location",  ...LocationBroadcast }
 *     { type: "ack" }
 *     { type: "pong" }
 */

import { WebSocket, WebSocketServer } from "ws";
import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import { db, teamUsersTable, techLocationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger.js";
import { runGeofenceChecks } from "./geofence.js";

/* ── types ──────────────────────────────────────────────────────────────────── */

export interface LocationBroadcast {
  id:          number;
  userId:      number;
  userName:    string;
  role:        string;
  defaultArea: string | null;
  lat:         number;
  lng:         number;
  accuracy:    number | null;
  speed:       number | null;
  heading:     number | null;
  area:        string | null;
  isOnDuty:    boolean;
  updatedAt:   string;
}

type InMsg =
  | { type: "auth";      token: string }
  | { type: "subscribe" }
  | { type: "location";  lat: number; lng: number; accuracy?: number; speed?: number; heading?: number; area?: string; isOnDuty?: boolean }
  | { type: "ping" };

interface LiveWS extends WebSocket {
  userId?:   number;
  role?:     string;
  userName?: string;
  authed:    boolean;
  alive:     boolean;
}

/* ── singleton hub ───────────────────────────────────────────────────────────── */

const wss = new WebSocketServer({ noServer: true });

/** All clients that should receive location broadcasts (authed + unauthenticated subscribers). */
const subscribers = new Set<LiveWS>();

/* ── public API ──────────────────────────────────────────────────────────────── */

/**
 * Broadcast a location update to every connected subscriber.
 * Called from the PUT /api/team/location HTTP route after each DB upsert.
 */
export function broadcastLocation(payload: LocationBroadcast): void {
  const msg = JSON.stringify({ type: "location", ...payload });
  for (const ws of subscribers) {
    if (ws.readyState === WebSocket.OPEN) {
      try { ws.send(msg); } catch {}
    }
  }
}

/** Hand off an HTTP upgrade request to the WebSocket server. */
export function handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void {
  wss.handleUpgrade(req, socket as never, head, (ws) => {
    wss.emit("connection", ws, req);
  });
}

/* ── connection handler ──────────────────────────────────────────────────────── */

wss.on("connection", (rawWs: WebSocket) => {
  const ws = rawWs as LiveWS;
  ws.authed = false;
  ws.alive  = true;

  ws.on("pong", () => { ws.alive = true; });

  ws.on("message", async (raw) => {
    let msg: InMsg;
    try { msg = JSON.parse(raw.toString()) as InMsg; } catch { return; }

    /* ── AUTH ─────────────────────────────────────────────────────────────── */
    if (msg.type === "auth") {
      try {
        const [user] = await db
          .select({ id: teamUsersTable.id, role: teamUsersTable.role, name: teamUsersTable.name })
          .from(teamUsersTable)
          .where(eq(teamUsersTable.token, msg.token));

        if (!user) {
          ws.send(JSON.stringify({ type: "auth_error" }));
          return;
        }
        ws.userId   = user.id;
        ws.role     = user.role;
        ws.userName = user.name;
        ws.authed   = true;
        ws.send(JSON.stringify({ type: "auth_ok", role: user.role }));
        subscribers.add(ws);
        logger.info({ userId: user.id, role: user.role }, "WS auth ok");
      } catch (err) {
        logger.warn({ err }, "WS auth DB error");
      }
      return;
    }

    /* ── SUBSCRIBE (unauthenticated — dashboard, etc.) ────────────────────── */
    if (msg.type === "subscribe") {
      subscribers.add(ws);
      try {
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

        const snapshot = rows.map(r => ({
          ...r,
          accuracy: null,
          speed:    null,
          heading:  null,
          updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
        }));
        ws.send(JSON.stringify({ type: "locations_snapshot", locations: snapshot }));
      } catch (err) {
        logger.warn({ err }, "WS subscribe snapshot error");
      }
      return;
    }

    /* ── LOCATION from authenticated technician ───────────────────────────── */
    if (msg.type === "location" && ws.authed && ws.role === "technician" && ws.userId) {
      const { lat, lng, accuracy, speed, heading, area, isOnDuty } = msg;
      if (lat == null || lng == null) return;
      if (accuracy != null && accuracy > 25) return;   // 25 m accuracy filter

      const updatedAt = new Date();
      try {
        const [dbUser] = await db
          .select({ mcLat: teamUsersTable.mcLat, mcLng: teamUsersTable.mcLng })
          .from(teamUsersTable)
          .where(eq(teamUsersTable.id, ws.userId));

        await db
          .insert(techLocationsTable)
          .values({
            userId: ws.userId, lat, lng,
            area:     area     ?? null,
            isOnDuty: isOnDuty ?? true,
            updatedAt,
            speed:    speed    ?? null,
            heading:  heading  ?? null,
            accuracy: accuracy ?? null,
          })
          .onConflictDoUpdate({
            target: techLocationsTable.userId,
            set: {
              lat, lng,
              area:     area     ?? null,
              isOnDuty: isOnDuty ?? true,
              updatedAt,
              speed:    speed    ?? null,
              heading:  heading  ?? null,
              accuracy: accuracy ?? null,
            },
          });

        broadcastLocation({
          id:          ws.userId,
          userId:      ws.userId,
          userName:    ws.userName ?? "Technician",
          role:        "technician",
          defaultArea: null,
          lat, lng,
          accuracy: accuracy ?? null,
          speed:    speed    ?? null,
          heading:  heading  ?? null,
          area:     area     ?? null,
          isOnDuty: isOnDuty ?? true,
          updatedAt: updatedAt.toISOString(),
        });

        /* ── Geofence: MC departure (50 m) + site arrival (100 m) ────────── */
        await runGeofenceChecks(
          ws.userId, lat, lng,
          speed ?? null, heading ?? null, accuracy ?? null,
          dbUser?.mcLat ?? null, dbUser?.mcLng ?? null,
        );

        ws.send(JSON.stringify({ type: "ack" }));
      } catch (err) {
        logger.warn({ err }, "WS location DB error");
      }
      return;
    }

    /* ── PING ─────────────────────────────────────────────────────────────── */
    if (msg.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
    }
  });

  ws.on("close", () => { subscribers.delete(ws); });
  ws.on("error", () => { subscribers.delete(ws); });
});

/* ── heartbeat — detect dead connections every 30 s ─────────────────────────── */
setInterval(() => {
  wss.clients.forEach((rawWs) => {
    const ws = rawWs as LiveWS;
    if (!ws.alive) {
      subscribers.delete(ws);
      ws.terminate();
      return;
    }
    ws.alive = false;
    ws.ping();
  });
}, 30_000);

export { wss };
