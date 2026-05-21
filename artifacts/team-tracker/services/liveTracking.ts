/**
 * ACES Live Fault Tracking Service
 * Handles background GPS heartbeats during COW fault response.
 * - Sends every 10s OR 10m of movement (whichever first)
 * - Full speed/heading/accuracy payload stored as breadcrumbs server-side
 * - Offline cache with automatic retry when connection restored
 * - Auto-arrival detection (<50 m from site)
 * - Logs all key events for diagnostics
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TRACKING_TASK = "LOCATION_TRACKING_TASK";

const AUTH_KEY          = "aces_team_auth";
const FAULT_CONTEXT_KEY = "aces_fault_context";
const OFFLINE_CACHE_KEY = "aces_offline_heartbeats";

/* ─── types ──────────────────────────────────────────────────────────────── */

export interface FaultContext {
  faultId: number;
  techId:  number;
  siteLat: number;
  siteLng: number;
}

export type MovementState = "moving" | "stopped" | "offline";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function deg2rad(d: number) { return d * Math.PI / 180; }

export function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R    = 6_371_000;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a    = Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function getApiBase(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  return env ?? "";
}

/* ─── offline cache ───────────────────────────────────────────────────────── */

async function cachePayload(payload: object): Promise<void> {
  try {
    const raw   = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    const cache = raw ? (JSON.parse(raw) as object[]) : [];
    cache.push(payload);
    if (cache.length > 50) cache.splice(0, cache.length - 50);
    await AsyncStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function flushCache(token: string, base: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    if (!raw) return;
    const cache = JSON.parse(raw) as object[];
    if (!cache.length) return;
    for (const item of cache) {
      await fetch(`${base}/api/team/location`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body:    JSON.stringify(item),
      }).catch(() => {});
    }
    await AsyncStorage.removeItem(OFFLINE_CACHE_KEY);
    console.log(`[LiveTracking] Flushed ${cache.length} cached heartbeats`);
  } catch {}
}

/* ─── background task (must be top-level) ────────────────────────────────── */

TaskManager.defineTask(
  LOCATION_TRACKING_TASK,
  async ({
    data,
    error,
  }: TaskManager.TaskManagerTaskBody<{ locations: Location.LocationObject[] }>) => {
    if (error) {
      console.log("[LiveTracking] BG task error:", error.message);
      return;
    }

    const locs = (data as { locations: Location.LocationObject[] })?.locations;
    if (!locs?.length) return;

    const { latitude, longitude, speed, heading, accuracy } = locs[0].coords;
    const speedKmh = speed != null ? Math.round(speed * 3.6 * 10) / 10 : null;

    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const { token } = JSON.parse(raw) as { token?: string };
      if (!token) return;

      const base    = getApiBase();
      const payload = {
        lat:      latitude,
        lng:      longitude,
        speed:    speedKmh,
        heading:  heading ?? null,
        accuracy: accuracy ?? null,
        isOnDuty: true,
      };

      const res = await fetch(`${base}/api/team/location`, {
        method:  "PUT",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await flushCache(token, base);
        console.log(
          `[LiveTracking] BG sent: lat=${latitude.toFixed(5)} lng=${longitude.toFixed(5)}` +
          ` speed=${speedKmh ?? "—"} km/h acc=${accuracy?.toFixed(0) ?? "—"}m`,
        );

        // Auto-arrival: stop tracking when within 50 m of site
        const ctxRaw = await AsyncStorage.getItem(FAULT_CONTEXT_KEY);
        if (ctxRaw) {
          const ctx    = JSON.parse(ctxRaw) as FaultContext;
          const distM  = haversineMeters(latitude, longitude, ctx.siteLat, ctx.siteLng);
          if (distM < 50) {
            console.log("[LiveTracking] Within 50 m of site — auto-stopping tracking");
            await stopFaultTracking();
          }
        }
      } else {
        await cachePayload({ ...payload, timestamp: new Date().toISOString() });
        console.log("[LiveTracking] API returned", res.status, "— heartbeat cached");
      }
    } catch (err) {
      await cachePayload({
        lat: latitude, lng: longitude, isOnDuty: true,
        timestamp: new Date().toISOString(),
      });
      console.log("[LiveTracking] BG fetch failed:", String(err));
    }
  },
);

/* ─── public API ──────────────────────────────────────────────────────────── */

export async function startFaultTracking(ctx: FaultContext): Promise<boolean> {
  try {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") {
      console.log("[LiveTracking] Foreground permission denied");
      return false;
    }
    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") {
      console.log("[LiveTracking] Background permission denied");
      return false;
    }

    await AsyncStorage.setItem(FAULT_CONTEXT_KEY, JSON.stringify(ctx));

    const already = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    if (!already) {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
        accuracy:                  Location.Accuracy.BestForNavigation,
        timeInterval:              10_000,  // 10 seconds
        distanceInterval:          10,      // OR 10 metres
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: "🛡 ACES — COW Fault Active",
          notificationBody:  "Sending live position to dispatch centre",
          notificationColor: "#8B1A1A",
        },
        showsBackgroundLocationIndicator: true,
      });
    }
    console.log("[LiveTracking] Fault tracking STARTED — faultId", ctx.faultId);
    return true;
  } catch (err) {
    console.log("[LiveTracking] startFaultTracking error:", String(err));
    return false;
  }
}

export async function stopFaultTracking(): Promise<void> {
  try {
    const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    if (running) await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    await AsyncStorage.removeItem(FAULT_CONTEXT_KEY);
    console.log("[LiveTracking] Fault tracking STOPPED");
  } catch (err) {
    console.log("[LiveTracking] stopFaultTracking error:", String(err));
  }
}

export async function isFaultTrackingActive(): Promise<boolean> {
  try { return await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK); }
  catch { return false; }
}

/** Send a single heartbeat from the foreground. Returns connection status. */
export async function sendHeartbeatNow(
  token:    string,
  lat:      number,
  lng:      number,
  speed:    number | null,   // m/s from Location
  heading:  number | null,
  accuracy: number | null,
): Promise<"ok" | "cached" | "error"> {
  try {
    const base    = getApiBase();
    const payload = {
      lat,
      lng,
      speed:    speed != null ? Math.round(speed * 3.6 * 10) / 10 : null,
      heading:  heading ?? null,
      accuracy: accuracy ?? null,
      isOnDuty: true,
    };
    const res = await fetch(`${base}/api/team/location`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body:    JSON.stringify(payload),
    });
    if (res.ok) {
      await flushCache(token, base);
      console.log(`[LiveTracking] Foreground heartbeat OK: ${lat.toFixed(5)},${lng.toFixed(5)}`);
      return "ok";
    }
    await cachePayload({ ...payload, timestamp: new Date().toISOString() });
    console.log("[LiveTracking] Foreground heartbeat failed — cached");
    return "cached";
  } catch (err) {
    console.log("[LiveTracking] sendHeartbeatNow error:", String(err));
    return "error";
  }
}

/** Detect movement state from speed (m/s) and last update time. */
export function getMovementState(
  speedMs:    number | null,
  lastUpdate: Date | null,
): MovementState {
  if (!lastUpdate) return "offline";
  const secsAgo = (Date.now() - lastUpdate.getTime()) / 1000;
  if (secsAgo > 45) return "offline";
  if (speedMs != null && speedMs > 0.8) return "moving";  // > ~3 km/h
  return "stopped";
}
