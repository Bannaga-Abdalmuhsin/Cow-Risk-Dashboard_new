import { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  OverlayView,
  Polyline,
} from "@react-google-maps/api";
import { useGoogleMaps } from "../lib/GoogleMapsProvider";

/* ─── types ────────────────────────────────────────────────────────────────── */

export interface ActiveFault {
  id: number;
  ttId: string;
  cowId: string;
  alarmName: string;
  severity: string;
  powerSource: string | null;
  backupTime: string | null;
  siteLat: number;
  siteLng: number;
  location: string | null;
  dispatchStatus: string;
  eta: number | null;
  roadEta: number | null;
  distanceKm: number | null;
  routePolyline: { lat: number; lng: number }[] | null;
  receivedAt: string;
  dispatchedAt: string | null;
  movementTriggeredAt: string | null;
  arrivedAt: string | null;
  startLat: number | null;
  startLng: number | null;
  assignedTechId: number | null;
  assignedTech: string | null;
  techLat: number | null;
  techLng: number | null;
  techArea: string | null;
  techUpdatedAt: string | null;
  techSpeed: number | null;
  techHeading: number | null;
}

type MovementState = "moving" | "stopped" | "offline" | "arrived";

interface TrailPoint {
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
  ts: string;
}

interface PbiStatus {
  ok: boolean;
  syncedAt: string | null;
  pbiCount: number;
  powerCount: number;
  sirCount: number;
  upserted: number;
  closed: number;
  errors: string[];
}

/* ─── constants ─────────────────────────────────────────────────────────────── */

const MAKKAH = { lat: 21.38, lng: 39.93 };

const STATUS_LABELS: Record<string, string> = {
  new:      "New Fault",
  assigned: "Team Assigned",
  en_route: "En Route",
  on_site:  "✅ Reached",
  resolved: "Resolved",
  closed:   "Closed",
};

const SLA_MS = 15 * 60 * 1000; // 15-minute SLA

const STATUS_COLORS: Record<string, string> = {
  new:      "#dc2626",
  assigned: "#f59e0b",
  en_route: "#3b82f6",
  on_site:  "#8b5cf6",
  resolved: "#16a34a",
  closed:   "#6b7280",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  major:    "#f59e0b",
  minor:    "#3b82f6",
  warning:  "#a3a3a3",
};

const MOVE_BG: Record<MovementState, string> = {
  moving:  "#1e3a8a",
  stopped: "#78350f",
  offline: "#7f1d1d",
  arrived: "#14532d",
};

const MOVE_BORDER: Record<MovementState, string> = {
  moving:  "#60a5fa",
  stopped: "#fbbf24",
  offline: "#ef4444",
  arrived: "#4ade80",
};

const MOVE_LABEL: Record<MovementState, string> = {
  moving:  "🔵 Moving",
  stopped: "🟡 Stopped",
  offline: "🔴 Offline",
  arrived: "✅ On Site",
};

/* ─── helpers ──────────────────────────────────────────────────────────────── */

function minutesAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function severityColor(s: string) {
  return SEVERITY_COLORS[s.toLowerCase()] ?? "#a3a3a3";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getMovementState(f: ActiveFault, nowMs: number): MovementState {
  if (["on_site", "resolved", "closed"].includes(f.dispatchStatus)) return "arrived";
  if (!f.techUpdatedAt || !f.techLat) return "offline";
  const secsAgo = (nowMs - new Date(f.techUpdatedAt).getTime()) / 1000;
  if (secsAgo > 120) return "offline";
  if (secsAgo > 45)  return "stopped";
  if (f.techSpeed != null && f.techSpeed < 0.5) return "stopped";
  return "moving";
}

function isDeviating(trail: TrailPoint[], siteLat: number, siteLng: number): boolean {
  if (trail.length < 8) return false;
  const last  = trail[trail.length - 1];
  const older = trail[trail.length - 8];
  const dNow = haversineKm(last.lat, last.lng, siteLat, siteLng);
  const dOld = haversineKm(older.lat, older.lng, siteLat, siteLng);
  return dNow > dOld + 0.2;
}

/* ─── FaultMap ─────────────────────────────────────────────────────────────── */

function FaultMap({
  faults,
  selected,
  onSelect,
  trail,
  movementStates,
}: {
  faults: ActiveFault[];
  selected: ActiveFault | null;
  onSelect: (f: ActiveFault) => void;
  trail: TrailPoint[];
  movementStates: Record<number, MovementState>;
}) {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef    = useRef<google.maps.Map | null>(null);
  const onLoad    = useCallback((m: google.maps.Map) => { mapRef.current = m; }, []);
  const onUnmount = useCallback(() => { mapRef.current = null; }, []);

  if (loadError) return (
    <div className="flex-1 flex items-center justify-center text-red-400 text-sm">
      Google Maps failed to load
    </div>
  );
  if (!isLoaded) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: 12 }}
      center={MAKKAH}
      zoom={11}
      options={{
        mapTypeId: "satellite",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        tilt: 0,
        styles: [
          { featureType: "all", elementType: "labels.text.fill",   stylers: [{ color: "#ffffff" }] },
          { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#000000" }, { weight: 2 }] },
        ],
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* ── Live breadcrumb trail for selected fault ── */}
      {selected && trail.length > 1 && (
        <Polyline
          path={trail.map(p => ({ lat: p.lat, lng: p.lng }))}
          options={{
            strokeColor:   "#38bdf8",
            strokeWeight:  3,
            strokeOpacity: 0.9,
            geodesic:      true,
            icons: [{
              icon: {
                path:          google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor:   "#7dd3fc",
                strokeOpacity: 1,
                scale:         2.5,
                fillColor:     "#38bdf8",
                fillOpacity:   0.9,
              },
              repeat: "40px",
            }],
          }}
        />
      )}

      {/* ── Planned route lines (tech → site) with direction arrows ── */}
      {faults.filter(f => f.techLat && f.techLng).map(f => {
        const isSelected   = selected?.id === f.id;
        const path = f.routePolyline && f.routePolyline.length > 1
          ? f.routePolyline
          : [{ lat: f.techLat!, lng: f.techLng! }, { lat: f.siteLat, lng: f.siteLng }];
        const hasRealRoute = !!(f.routePolyline && f.routePolyline.length > 1);

        return (
          <Polyline
            key={`route-${f.id}`}
            path={path}
            options={{
              strokeColor:   isSelected ? "#a78bfa" : "#6366f1",
              strokeOpacity: isSelected ? 0.7 : 0.35,
              strokeWeight:  isSelected ? 3 : 2,
              geodesic:      !hasRealRoute,
              icons: [{
                icon: {
                  path:          google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeOpacity: 1,
                  scale:         2,
                  strokeColor:   "#a78bfa",
                },
                offset: "50%",
                repeat: "60px",
              }],
            }}
          />
        );
      })}

      {/* ── COW site markers ── */}
      {faults.map(f => {
        const isSelected = selected?.id === f.id;
        const sColor     = severityColor(f.severity);
        const isCritical = f.severity.toLowerCase() === "critical";

        return (
          <OverlayView
            key={f.id}
            position={{ lat: f.siteLat, lng: f.siteLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div onClick={() => onSelect(f)} style={{ transform: "translate(-50%,-100%)", cursor: "pointer" }}>
              <div style={{
                background:   isSelected ? "#fff" : sColor,
                color:        isSelected ? sColor : "#fff",
                border:       `2px solid ${sColor}`,
                borderRadius: 8,
                padding:      "3px 7px",
                fontSize:     10,
                fontWeight:   800,
                whiteSpace:   "nowrap",
                boxShadow:    isCritical ? `0 0 12px ${sColor}` : `0 2px 8px rgba(0,0,0,0.5)`,
                animation:    isCritical && !isSelected ? "pulse 1.5s infinite" : "none",
                position:     "relative",
                minWidth:     56,
                textAlign:    "center",
              }}>
                <div>{f.cowId}</div>
                <div style={{ fontSize: 8.5, opacity: 0.9 }}>{f.alarmName.slice(0, 18)}</div>
                <div style={{
                  position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                  borderTop: `6px solid ${isSelected ? "#fff" : sColor}`,
                }} />
              </div>
            </div>
          </OverlayView>
        );
      })}

      {/* ── Technician markers — movement-state aware ── */}
      {faults.map(f => {
        if (!f.techLat || !f.techLng) return null;
        const isSelected = selected?.id === f.id;
        const etaMins    = f.roadEta ?? f.eta ?? null;
        const dist       = f.distanceKm ?? null;
        const state      = movementStates[f.id] ?? "offline";
        const bg         = MOVE_BG[state];
        const border     = MOVE_BORDER[state];

        return (
          <OverlayView
            key={`tech-${f.id}`}
            position={{ lat: f.techLat, lng: f.techLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{ transform: "translate(-50%,-100%)", cursor: "pointer", position: "relative" }}
              onClick={() => onSelect(f)}
            >
              {state === "moving" && (
                <div style={{
                  position:      "absolute",
                  inset:         -5,
                  borderRadius:  12,
                  border:        `2px solid ${border}`,
                  animation:     "outerPulse 1.5s ease-out infinite",
                  pointerEvents: "none",
                }} />
              )}
              <div style={{
                background:   bg,
                color:        "#fff",
                border:       `2px solid ${border}`,
                borderRadius: 8,
                padding:      "3px 7px",
                fontSize:     9.5,
                fontWeight:   800,
                whiteSpace:   "nowrap",
                boxShadow:    isSelected ? `0 0 16px ${border}` : `0 2px 8px rgba(0,0,0,0.5)`,
                position:     "relative",
                textAlign:    "center",
              }}>
                <div>👷 {f.assignedTech ?? "Tech"}</div>
                <div style={{ fontSize: 8.5, opacity: 0.85 }}>
                  {etaMins != null ? `ETA ${etaMins}m` : "—"}
                  {dist != null ? ` · ${dist}km` : ""}
                </div>
                <div style={{ fontSize: 7.5, color: border, fontWeight: 900, letterSpacing: 0.5 }}>
                  {state === "moving"  ? "▶ MOVING"
                  : state === "stopped" ? "■ STOPPED"
                  : state === "offline" ? "✕ OFFLINE"
                  : "✓ ON SITE"}
                </div>
                <div style={{
                  position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                  borderTop: `6px solid ${bg}`,
                }} />
              </div>
            </div>
          </OverlayView>
        );
      })}
    </GoogleMap>
  );
}

/* ─── FaultManagement ──────────────────────────────────────────────────────── */

export function FaultManagement() {
  const [faults, setFaults]             = useState<ActiveFault[]>([]);
  const [selected, setSelected]         = useState<ActiveFault | null>(null);
  const [loading, setLoading]           = useState(true);
  const [lastRefresh, setLastRefresh]   = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [pbiStatus, setPbiStatus]   = useState<PbiStatus | null>(null);
  const [pbiSyncing, setPbiSyncing] = useState(false);

  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [tickMs, setTickMs] = useState(Date.now());

  // ── 1-second tick — drives live countdown & heartbeat age ─────────────────
  useEffect(() => {
    const t = setInterval(() => setTickMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Trail polling for selected fault ──────────────────────────────────────
  useEffect(() => {
    if (!selected) { setTrail([]); return; }
    const fetchTrail = async () => {
      try {
        const r = await fetch(`/api/faults/${selected.id}/trail`);
        if (r.ok) setTrail(await r.json() as TrailPoint[]);
      } catch {}
    };
    fetchTrail();
    const t = setInterval(fetchTrail, 3000);
    return () => { clearInterval(t); setTrail([]); };
  }, [selected?.id]);

  // ── Faults polling ─────────────────────────────────────────────────────────
  const fetchFaults = useCallback(async () => {
    try {
      const r = await fetch("/api/faults/active");
      if (!r.ok) return;
      const data: ActiveFault[] = await r.json();
      setFaults(data);
      setLastRefresh(new Date());
      if (selected) {
        const fresh = data.find(f => f.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchFaults();
    pollRef.current = setInterval(fetchFaults, 8000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchFaults]);

  // ── PBI status polling (30 s) ──────────────────────────────────────────────
  const fetchPbiStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/faults/pbi-status");
      if (!r.ok) return;
      setPbiStatus(await r.json() as PbiStatus);
    } catch {}
  }, []);

  useEffect(() => {
    fetchPbiStatus();
    const t = setInterval(fetchPbiStatus, 30_000);
    return () => clearInterval(t);
  }, [fetchPbiStatus]);

  const handlePbiSync = async () => {
    setPbiSyncing(true);
    try {
      const r = await fetch("/api/faults/pbi-sync", { method: "POST" });
      setPbiStatus(await r.json() as PbiStatus);
      await fetchFaults();
    } catch {
    } finally {
      setPbiSyncing(false);
    }
  };

  async function handleDispatch(faultId: number) {
    await fetch(`/api/faults/${faultId}/dispatch`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
    });
    fetchFaults();
  }

  async function handleStatusChange(faultId: number, status: string) {
    await fetch(`/api/faults/${faultId}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    fetchFaults();
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = faults.filter(f => {
    if (statusFilter === "active") return !["resolved","closed"].includes(f.dispatchStatus);
    if (statusFilter === "all") return true;
    return f.dispatchStatus === statusFilter;
  });

  const movementStates: Record<number, MovementState> = {};
  for (const f of faults) movementStates[f.id] = getMovementState(f, tickMs);

  const criticalCount = faults.filter(f => f.severity.toLowerCase() === "critical" && !["resolved","closed"].includes(f.dispatchStatus)).length;
  const activeCount   = faults.filter(f => !["resolved","closed"].includes(f.dispatchStatus)).length;
  const enRouteCount  = faults.filter(f => f.dispatchStatus === "en_route").length;
  const movingCount   = faults.filter(f => movementStates[f.id] === "moving").length;
  const resolvedCount = faults.filter(f => f.dispatchStatus === "resolved").length;

  return (
    <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 148px)" }}>

      {/* ── PBI sync status bar ──────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 flex-wrap rounded-lg px-3 py-1.5 shrink-0"
        style={{
          background: pbiStatus?.ok === false ? "rgba(220,38,38,0.08)" : "rgba(30,58,138,0.12)",
          border:     `1px solid ${pbiStatus?.ok === false ? "#dc262644" : "#1e3a8a55"}`,
          fontSize:   11,
        }}
      >
        {pbiStatus ? (
          <>
            <span
              className={pbiStatus.ok ? "animate-pulse" : ""}
              style={{ width: 7, height: 7, borderRadius: "50%", display: "inline-block",
                background: pbiStatus.ok ? "#22c55e" : "#f59e0b" }}
            />
            <span style={{ color: pbiStatus.ok ? "#86efac" : "#fcd34d", fontWeight: 600 }}>
              {pbiStatus.ok ? "Synced" : "Sync error"}
            </span>
            {(pbiStatus.powerCount > 0 || pbiStatus.sirCount > 0) && (
              <span style={{ color: "#60a5fa" }}>
                ⚡ {pbiStatus.powerCount ?? 0} power · 📡 {pbiStatus.sirCount ?? 0} telecom
              </span>
            )}
            {pbiStatus.pbiCount > 0 && (
              <span style={{ color: "#a78bfa" }}>({pbiStatus.pbiCount} matched sites)</span>
            )}
            {pbiStatus.upserted > 0 && <span style={{ color: "#34d399" }}>+{pbiStatus.upserted} inserted</span>}
            {pbiStatus.closed   > 0 && <span style={{ color: "#f87171" }}>{pbiStatus.closed} auto-closed</span>}
            {pbiStatus.syncedAt && (
              <span style={{ color: "#64748b" }}>· {new Date(pbiStatus.syncedAt).toLocaleTimeString()}</span>
            )}
            {pbiStatus.errors.length > 0 && (
              <span style={{ color: "#fca5a5", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={pbiStatus.errors.join(" | ")}>
                ⚠ {pbiStatus.errors[0]}
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "#64748b" }}>Waiting for first sync…</span>
        )}

        <button
          onClick={handlePbiSync}
          disabled={pbiSyncing}
          className="ml-auto"
          style={{
            background:    pbiSyncing ? "rgba(30,58,138,0.3)" : "rgba(30,58,138,0.5)",
            color:         "#93c5fd",
            border:        "1px solid #1e3a8a99",
            borderRadius:  6,
            padding:       "2px 9px",
            fontSize:      10,
            fontWeight:    700,
            cursor:        pbiSyncing ? "not-allowed" : "pointer",
            letterSpacing: 0.5,
            opacity:       pbiSyncing ? 0.7 : 1,
          }}
        >
          {pbiSyncing ? "Syncing…" : "Sync Now"}
        </button>
      </div>

      {/* ── Status counters + filters ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="flex gap-2">
          {[
            { label: "Active",   value: activeCount,   color: "#f59e0b" },
            { label: "Critical", value: criticalCount, color: "#dc2626" },
            { label: "En Route", value: enRouteCount,  color: "#3b82f6" },
            { label: "Moving",   value: movingCount,   color: "#38bdf8" },
            { label: "Resolved", value: resolvedCount, color: "#16a34a" },
          ].map(s => (
            <div key={s.label}
              className="rounded-lg px-3 py-1.5 text-center border"
              style={{ background: `${s.color}22`, borderColor: `${s.color}55` }}
            >
              <div className="text-base font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] uppercase tracking-wide" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span>Auto-refresh 8s · Last: {lastRefresh.toLocaleTimeString()}</span>
        </div>

        <div className="flex gap-1">
          {["active","all","new","assigned","en_route","on_site"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
              style={statusFilter === s
                ? { background: "#7c3aed", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {STATUS_LABELS[s] ?? s.replace("_"," ")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main: map (left) + fault list (right) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">

        {/* Map */}
        <div className="lg:col-span-2 min-h-0 flex flex-col" style={{ minHeight: 380 }}>
          <FaultMap
            faults={filtered}
            selected={selected}
            onSelect={setSelected}
            trail={trail}
            movementStates={movementStates}
          />
        </div>

        {/* Fault list */}
        <div className="lg:col-span-1 flex flex-col gap-2 min-h-0 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center flex-1 text-muted-foreground text-sm">
              Loading faults…
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-muted-foreground gap-3">
              <div className="text-4xl opacity-30">✅</div>
              <p className="text-sm">No active faults</p>
            </div>
          )}

          {filtered.map(f => {
            const isSelected   = selected?.id === f.id;
            const sc           = severityColor(f.severity);
            const statusColor  = STATUS_COLORS[f.dispatchStatus] ?? "#9ca3af";
            const isCritical   = f.severity.toLowerCase() === "critical";
            const age          = minutesAgo(f.receivedAt);
            const etaMins      = f.roadEta ?? f.eta;
            const dist         = f.distanceKm;
            const hasRealRoute = !!(f.routePolyline && f.routePolyline.length > 1);
            const state        = movementStates[f.id] ?? "offline";
            const stateBorder  = MOVE_BORDER[state];

            // 15-min SLA countdown from the moment team left MC (movementTriggeredAt)
            const slaRemainingMs = f.movementTriggeredAt
              ? Math.max(0, SLA_MS - (tickMs - new Date(f.movementTriggeredAt).getTime()))
              : null;
            const slaMinsLive  = slaRemainingMs != null ? Math.floor(slaRemainingMs / 60000) : null;
            const slaSecsLive  = slaRemainingMs != null ? Math.floor((slaRemainingMs % 60000) / 1000) : null;
            const slaBreached  = slaRemainingMs === 0;
            const slaUrgent    = slaRemainingMs != null && slaRemainingMs > 0 && slaRemainingMs < 300_000;

            // Heartbeat age (live, updated each tick)
            const heartbeatSecs = f.techUpdatedAt
              ? Math.round((tickMs - new Date(f.techUpdatedAt).getTime()) / 1000)
              : null;

            // Route deviation — checked against live trail for selected fault
            const deviated = isSelected
              && f.dispatchStatus === "en_route"
              && isDeviating(trail, f.siteLat, f.siteLng);

            return (
              <div
                key={f.id}
                onClick={() => setSelected(isSelected ? null : f)}
                className="rounded-xl border cursor-pointer transition-all"
                style={{
                  background:  isSelected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: isSelected ? "#7c3aed" : isCritical ? `${sc}66` : "rgba(255,255,255,0.08)",
                  boxShadow:   isCritical ? `0 0 8px ${sc}44` : undefined,
                  padding:     "10px 12px",
                }}
              >
                {/* Row 1: cow ID + severity + age */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm" style={{ color: sc }}>
                      {isCritical && "🚨 "}{f.cowId}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{ background: `${sc}33`, color: sc }}>
                      {f.severity}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{age}m ago</span>
                </div>

                {/* Row 2: alarm name */}
                <div className="text-xs font-semibold text-white/90 mb-1 truncate">{f.alarmName}</div>

                {/* Row 3: power + backup + location */}
                <div className="flex gap-3 text-[10px] text-muted-foreground mb-1.5">
                  {f.powerSource && <span>⚡ {f.powerSource}</span>}
                  {f.backupTime  && (
                    <span className={isCritical ? "text-red-400 font-bold" : ""}>
                      🔋 {f.backupTime} remaining
                    </span>
                  )}
                  {f.location && <span>📍 {f.location}</span>}
                </div>

                {/* Row 4: dispatch status + tech + server ETA */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
                    {STATUS_LABELS[f.dispatchStatus] ?? f.dispatchStatus}
                  </span>
                  {f.assignedTech && (
                    <span className="text-[10px] text-blue-400">
                      👷 {f.assignedTech}
                      {dist != null && <span className="text-muted-foreground"> · {dist}km</span>}
                      {etaMins != null && (
                        <span className="text-amber-400 font-semibold">
                          {" "}· {etaMins}min
                          {hasRealRoute && <span className="text-sky-400 ml-0.5">🛣️</span>}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Row 5: movement state + heartbeat + speed (when tech assigned) */}
                {f.assignedTech && (
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: `${stateBorder}18`,
                        color:      stateBorder,
                        border:     `1px solid ${stateBorder}44`,
                      }}
                    >
                      {MOVE_LABEL[state]}
                    </span>
                    {heartbeatSecs != null && (
                      <span className="text-[9px]" style={{
                        color: heartbeatSecs < 45 ? "#86efac"
                          : heartbeatSecs < 120 ? "#fcd34d"
                          : "#f87171",
                      }}>
                        ♥ {heartbeatSecs}s
                      </span>
                    )}
                    {f.techSpeed != null && f.techSpeed > 0 && (
                      <span className="text-[9px] text-sky-400">
                        {Math.round(f.techSpeed)} km/h
                      </span>
                    )}
                    {isSelected && trail.length > 0 && (
                      <span className="text-[9px] text-sky-300/60">
                        🗺 {trail.length} pts
                      </span>
                    )}
                  </div>
                )}

                {/* Row 6: 15-min SLA countdown (en_route, triggered from MC departure) */}
                {f.dispatchStatus === "en_route" && slaRemainingMs != null && (
                  <div
                    className="flex items-center gap-1.5 mt-1.5 rounded-lg px-2 py-1"
                    style={{
                      background: slaBreached ? "rgba(220,38,38,0.15)" : slaUrgent ? "rgba(245,158,11,0.12)" : "rgba(30,58,138,0.15)",
                      border: `1px solid ${slaBreached ? "#dc262666" : slaUrgent ? "#f59e0b66" : "#3b82f633"}`,
                    }}
                  >
                    <span className="text-[9px]" style={{ color: slaBreached ? "#f87171" : "#facc15" }}>
                      {slaBreached ? "⛔" : "⏱"} 15-MIN SLA
                    </span>
                    {slaBreached ? (
                      <span className="text-sm font-black text-red-400 animate-pulse">BREACHED</span>
                    ) : (
                      <span
                        className="text-sm font-black tabular-nums"
                        style={{ color: slaUrgent ? "#ef4444" : "#f59e0b" }}
                      >
                        {slaMinsLive}m {String(slaSecsLive).padStart(2, "0")}s
                      </span>
                    )}
                    <span className="text-[9px] text-muted-foreground ml-auto">
                      {slaBreached ? "" : "remaining"}
                    </span>
                    {slaUrgent && !slaBreached && (
                      <span className="text-[9px] text-red-400 font-bold animate-pulse">⚠ URGENT</span>
                    )}
                  </div>
                )}

                {/* Row 7: arrival timestamp (on_site / Reached) */}
                {f.dispatchStatus === "on_site" && f.arrivedAt && (
                  <div className="flex items-center gap-1.5 mt-1.5 rounded-lg px-2 py-1"
                    style={{ background: "rgba(20,83,45,0.2)", border: "1px solid #16a34a44" }}>
                    <span className="text-[9px] text-emerald-400 font-bold">✅ REACHED</span>
                    <span className="text-[9px] text-emerald-300/80 ml-auto">
                      {new Date(f.arrivedAt).toLocaleTimeString()}
                    </span>
                    {f.movementTriggeredAt && (
                      <span className="text-[9px] text-muted-foreground">
                        · {Math.round((new Date(f.arrivedAt).getTime() - new Date(f.movementTriggeredAt).getTime()) / 60000)}m travel
                      </span>
                    )}
                  </div>
                )}

                {/* Route deviation warning */}
                {deviated && (
                  <div className="mt-1.5 text-[10px] font-bold text-amber-400 animate-pulse">
                    ⚠ ROUTE DEVIATION DETECTED
                  </div>
                )}

                {/* Actions (expanded when selected) */}
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex gap-1.5 flex-wrap">
                    {f.dispatchStatus === "new" && (
                      <button onClick={e => { e.stopPropagation(); handleDispatch(f.id); }}
                        className="px-2.5 py-1 rounded text-[10px] font-bold"
                        style={{ background: "#dc262622", color: "#dc2626", border: "1px solid #dc262666" }}>
                        Auto Dispatch
                      </button>
                    )}
                    {["new","assigned"].includes(f.dispatchStatus) && (
                      <button onClick={e => { e.stopPropagation(); handleStatusChange(f.id, "en_route"); }}
                        className="px-2.5 py-1 rounded text-[10px] font-bold"
                        style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f666" }}>
                        Mark En Route
                      </button>
                    )}
                    {f.dispatchStatus === "en_route" && (
                      <button onClick={e => { e.stopPropagation(); handleStatusChange(f.id, "on_site"); }}
                        className="px-2.5 py-1 rounded text-[10px] font-bold"
                        style={{ background: "#8b5cf622", color: "#8b5cf6", border: "1px solid #8b5cf666" }}>
                        Mark On Site
                      </button>
                    )}
                    {!["resolved","closed"].includes(f.dispatchStatus) && (
                      <button onClick={e => { e.stopPropagation(); handleStatusChange(f.id, "resolved"); }}
                        className="px-2.5 py-1 rounded text-[10px] font-bold"
                        style={{ background: "#16a34a22", color: "#16a34a", border: "1px solid #16a34a66" }}>
                        Resolve
                      </button>
                    )}
                    {hasRealRoute && (
                      <span className="text-[9px] text-sky-400 px-1.5 py-0.5 rounded border border-sky-400/30 bg-sky-400/10">
                        🛣️ Road route active
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 6px #dc2626; }
          50%       { box-shadow: 0 0 18px #dc2626, 0 0 32px #dc262688; }
        }
        @keyframes outerPulse {
          0%   { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.7); }
        }
      `}</style>
    </div>
  );
}
