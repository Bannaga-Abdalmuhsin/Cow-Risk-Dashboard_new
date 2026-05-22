/**
 * Automatic geofence checks on every GPS ping.
 *
 * Rule 1 — MC Departure (50 m): "assigned" → "en_route" + lock SLA timer
 * Rule 2 — Site Arrival (100 m): "en_route" → "on_site" + log arrivedAt
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

export async function runGeofenceChecks(
  userId:  number,
  lat:     number,
  lng:     number,
  speed:   number | null,
  heading: number | null,
  accuracy: number | null,
  mcLat:   number | null | undefined,
  mcLng:   number | null | undefined,
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

  /* ── Store breadcrumb for every ping while fault is active ─────────────── */
  await db.insert(faultTrackingPointsTable).values({
    faultId:  fault.id,
    techId:   userId,
    lat, lng,
    speed:    speed    ?? null,
    heading:  heading  ?? null,
    accuracy: accuracy ?? null,
  });

  /* ── Rule 1: MC departure → auto-trigger en_route ─────────────────────── */
  if (fault.dispatchStatus === "assigned" && mcLat != null && mcLng != null) {
    const distFromMcKm = haversineKm(lat, lng, mcLat, mcLng);
    if (distFromMcKm > 0.05) {
      await db
        .update(faultsTable)
        .set({ dispatchStatus: "en_route", movementTriggeredAt: new Date() })
        .where(eq(faultsTable.id, fault.id));
      logger.info({ userId, faultId: fault.id, distFromMcKm }, "Auto en_route: team departed MC");
    }
    return;
  }

  /* ── Rule 2: Site arrival → auto-trigger on_site ──────────────────────── */
  if (fault.dispatchStatus === "en_route") {
    const distFromSiteKm = haversineKm(lat, lng, fault.siteLat, fault.siteLng);
    if (distFromSiteKm < 0.1) {
      await db
        .update(faultsTable)
        .set({ dispatchStatus: "on_site", arrivedAt: new Date() })
        .where(eq(faultsTable.id, fault.id));
      logger.info({ userId, faultId: fault.id, distFromSiteKm }, "Auto on_site: team arrived at site");
    }
  }
}
