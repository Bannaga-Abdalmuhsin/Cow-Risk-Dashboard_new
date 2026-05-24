/**
 * Dynamic movement-trigger geofence.
 *
 * Rule 1 — Movement Detection (replaces MC departure):
 *   When status is "assigned", detect physical movement by comparing the
 *   current ping to the previous stored position (delta > 10 m) OR a device
 *   speed reading > 1 m/s.  The exact moment movement is confirmed:
 *     • dispatchStatus  → "en_route"
 *     • movementTriggeredAt set  (SLA timer starts here)
 *     • startLat / startLng captured  (official route origin)
 *     • First breadcrumb appended at the movement point
 *
 * Rule 2 — Site Arrival (100 m radius, unchanged):
 *   When status is "en_route" and tech is within 100 m of the site coords:
 *     • dispatchStatus  → "on_site"
 *     • arrivedAt set
 *
 * Breadcrumb policy:
 *   Points are only appended AFTER movement has been triggered (en_route /
 *   on_site).  Pre-movement pings are discarded so the trail starts exactly
 *   at the road origin.
 */

import { db, faultsTable, faultTrackingPointsTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { logger } from "./logger.js";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOVEMENT_THRESHOLD_KM = 0.010; // 10 metres
const SPEED_THRESHOLD_MS    = 1.0;   // 1 m/s ≈ 3.6 km/h (walking pace)
const ARRIVAL_THRESHOLD_KM  = 0.100; // 100 metres

export async function runGeofenceChecks(
  userId:   number,
  lat:      number,
  lng:      number,
  prevLat:  number | null,
  prevLng:  number | null,
  speed:    number | null,
  heading:  number | null,
  accuracy: number | null,
): Promise<void> {
  const [fault] = await db
    .select({
      id:                  faultsTable.id,
      siteLat:             faultsTable.siteLat,
      siteLng:             faultsTable.siteLng,
      dispatchStatus:      faultsTable.dispatchStatus,
      movementTriggeredAt: faultsTable.movementTriggeredAt,
    })
    .from(faultsTable)
    .where(and(
      eq(faultsTable.assignedTechId, userId),
      isNull(faultsTable.resolvedAt),
    ))
    .limit(1);

  if (!fault) return;

  /* ── Rule 1: Movement trigger (replaces MC departure) ─────────────────── */
  if (fault.dispatchStatus === "assigned") {
    const deltaKm = prevLat != null && prevLng != null
      ? haversineKm(prevLat, prevLng, lat, lng)
      : null;

    const isMoving =
      (deltaKm != null && deltaKm > MOVEMENT_THRESHOLD_KM) ||
      (speed    != null && speed   > SPEED_THRESHOLD_MS);

    if (isMoving) {
      const now = new Date();
      await db
        .update(faultsTable)
        .set({
          dispatchStatus:      "en_route",
          movementTriggeredAt: now,
          startLat:            lat,
          startLng:            lng,
        })
        .where(eq(faultsTable.id, fault.id));

      /* First breadcrumb — the exact movement origin */
      await db.insert(faultTrackingPointsTable).values({
        faultId:  fault.id,
        techId:   userId,
        lat, lng,
        speed:    speed    ?? null,
        heading:  heading  ?? null,
        accuracy: accuracy ?? null,
      });

      logger.info(
        { userId, faultId: fault.id, deltaKm, speed },
        "Auto en_route: movement detected — SLA timer started",
      );
    }
    return;
  }

  /* ── Append breadcrumb only while actively en route / on site ─────────── */
  if (fault.dispatchStatus === "en_route" || fault.dispatchStatus === "on_site") {
    await db.insert(faultTrackingPointsTable).values({
      faultId:  fault.id,
      techId:   userId,
      lat, lng,
      speed:    speed    ?? null,
      heading:  heading  ?? null,
      accuracy: accuracy ?? null,
    });
  }

  /* ── Rule 2: Site arrival (100 m) ─────────────────────────────────────── */
  if (fault.dispatchStatus === "en_route") {
    const distFromSiteKm = haversineKm(lat, lng, fault.siteLat, fault.siteLng);
    if (distFromSiteKm < ARRIVAL_THRESHOLD_KM) {
      await db
        .update(faultsTable)
        .set({ dispatchStatus: "on_site", arrivedAt: new Date() })
        .where(eq(faultsTable.id, fault.id));
      logger.info(
        { userId, faultId: fault.id, distFromSiteKm },
        "Auto on_site: team arrived within 100 m of site",
      );
    }
  }
}
