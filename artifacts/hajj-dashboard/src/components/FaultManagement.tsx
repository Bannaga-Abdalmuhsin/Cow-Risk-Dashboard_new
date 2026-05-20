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
  receivedAt: string;
  dispatchedAt: string | null;
  assignedTechId: number | null;
  assignedTech: string | null;
  techLat: number | null;
  techLng: number | null;
  techArea: string | null;
}

/* ─── helpers ──────────────────────────────────────────────────────────────── */

const MAKKAH = { lat: 21.38, lng: 39.93 };

const STATUS_LABELS: Record<string, string> = {
  new:      "New Fault",
  assigned: "Team Assigned",
  en_route: "En Route",
  on_site:  "On Site",
  resolved: "Resolved",
  closed:   "Closed",
};

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

function minutesAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function severityColor(s: string) {
  return SEVERITY_COLORS[s.toLowerCase()] ?? "#a3a3a3";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── map sub-component ────────────────────────────────────────────────────── */

function FaultMap({
  faults,
  selected,
  onSelect,
}: {
  faults: ActiveFault[];
  selected: ActiveFault | null;
  onSelect: (f: ActiveFault) => void;
}) {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((m: google.maps.Map) => { mapRef.current = m; }, []);
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
      {faults.map(f => {
        const isSelected = selected?.id === f.id;
        const sColor = severityColor(f.severity);
        const isCritical = f.severity.toLowerCase() === "critical";

        return (
          <OverlayView
            key={f.id}
            position={{ lat: f.siteLat, lng: f.siteLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              onClick={() => onSelect(f)}
              style={{ transform: "translate(-50%,-100%)", cursor: "pointer" }}
            >
              <div style={{
                background: isSelected ? "#fff" : sColor,
                color: isSelected ? sColor : "#fff",
                border: `2px solid ${sColor}`,
                borderRadius: 8,
                padding: "3px 7px",
                fontSize: 10,
                fontWeight: 800,
                whiteSpace: "nowrap",
                boxShadow: isCritical ? `0 0 12px ${sColor}` : `0 2px 8px rgba(0,0,0,0.5)`,
                animation: isCritical && !isSelected ? "pulse 1.5s infinite" : "none",
                position: "relative",
                minWidth: 56,
                textAlign: "center",
              }}>
                <div>{f.cowId}</div>
                <div style={{ fontSize: 8.5, opacity: 0.9 }}>{f.alarmName.slice(0, 18)}</div>
                <div style={{
                  position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `6px solid ${isSelected ? "#fff" : sColor}`,
                }} />
              </div>
            </div>
          </OverlayView>
        );
      })}

      {faults.map(f => {
        if (!f.techLat || !f.techLng) return null;
        const isSelected = selected?.id === f.id;
        const distKm = haversineKm(f.techLat, f.techLng, f.siteLat, f.siteLng);
        const etaMins = f.eta ?? Math.round((distKm / 40) * 60);
        return (
          <OverlayView
            key={`tech-${f.id}`}
            position={{ lat: f.techLat, lng: f.techLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{ transform: "translate(-50%,-100%)", cursor: "pointer" }}
              onClick={() => onSelect(f)}
            >
              <div style={{
                background: "#1e3a8a",
                color: "#fff",
                border: "2px solid #60a5fa",
                borderRadius: 8,
                padding: "3px 7px",
                fontSize: 9.5,
                fontWeight: 800,
                whiteSpace: "nowrap",
                boxShadow: isSelected ? "0 0 14px #3b82f6" : "0 2px 8px rgba(0,0,0,0.5)",
                position: "relative",
                textAlign: "center",
              }}>
                <div>👷 {f.assignedTech ?? "Tech"}</div>
                <div style={{ fontSize: 8.5, opacity: 0.85 }}>ETA {etaMins}min · {distKm.toFixed(1)}km</div>
                <div style={{
                  position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "6px solid #1e3a8a",
                }} />
              </div>
            </div>
          </OverlayView>
        );
      })}

      {faults.filter(f => f.techLat && f.techLng).map(f => (
        <Polyline
          key={`route-${f.id}`}
          path={[
            { lat: f.techLat!, lng: f.techLng! },
            { lat: f.siteLat,  lng: f.siteLng },
          ]}
          options={{
            strokeColor:   selected?.id === f.id ? "#60a5fa" : "#3b82f6",
            strokeOpacity: selected?.id === f.id ? 1 : 0.55,
            strokeWeight:  selected?.id === f.id ? 4 : 2,
            geodesic: true,
          }}
        />
      ))}
    </GoogleMap>
  );
}

/* ─── main component ───────────────────────────────────────────────────────── */

export function FaultManagement() {
  const [faults, setFaults]       = useState<ActiveFault[]>([]);
  const [selected, setSelected]   = useState<ActiveFault | null>(null);
  const [loading, setLoading]     = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const filtered = faults.filter(f => {
    if (statusFilter === "active") return !["resolved","closed"].includes(f.dispatchStatus);
    if (statusFilter === "all") return true;
    return f.dispatchStatus === statusFilter;
  });

  async function handleDispatch(faultId: number) {
    await fetch(`/api/faults/${faultId}/dispatch`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    fetchFaults();
  }

  async function handleStatusChange(faultId: number, status: string) {
    await fetch(`/api/faults/${faultId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchFaults();
  }

  const criticalCount  = faults.filter(f => f.severity.toLowerCase() === "critical" && !["resolved","closed"].includes(f.dispatchStatus)).length;
  const activeCount    = faults.filter(f => !["resolved","closed"].includes(f.dispatchStatus)).length;
  const enRouteCount   = faults.filter(f => f.dispatchStatus === "en_route").length;
  const resolvedCount  = faults.filter(f => f.dispatchStatus === "resolved").length;

  return (
    <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 148px)" }}>

      {/* ── top status bar ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="flex gap-2">
          {[
            { label: "Active",   value: activeCount,   color: "#f59e0b" },
            { label: "Critical", value: criticalCount, color: "#dc2626" },
            { label: "En Route", value: enRouteCount,  color: "#3b82f6" },
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

      {/* ── main content: map left + fault list right ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">

        {/* LEFT: map */}
        <div className="lg:col-span-2 min-h-0 flex flex-col" style={{ minHeight: 380 }}>
          <FaultMap faults={filtered} selected={selected} onSelect={setSelected} />
        </div>

        {/* RIGHT: fault list */}
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
              <p className="text-xs">Post a ticket to <code className="bg-muted px-1 rounded">POST /api/faults</code></p>
              <div className="mt-2 text-left w-full bg-muted/40 rounded-lg p-3 text-[10px] font-mono text-muted-foreground leading-relaxed border border-border">
                <div className="text-purple-400 mb-1 font-bold text-[9px]">CONNECT YOUR HAJJ MONITOR →</div>
                POST https://acesmsd.live/api/faults<br/>
                x-api-key: {"<"}FAULT_API_KEY{">"}<br/>
                {`{`}<br/>
                &nbsp;&nbsp;"ttId": "TT-001",<br/>
                &nbsp;&nbsp;"cowId": "CWN960",<br/>
                &nbsp;&nbsp;"alarmName": "Generator Failure",<br/>
                &nbsp;&nbsp;"severity": "critical",<br/>
                &nbsp;&nbsp;"siteLat": 21.347135,<br/>
                &nbsp;&nbsp;"siteLng": 39.992573,<br/>
                &nbsp;&nbsp;"powerSource": "Battery",<br/>
                &nbsp;&nbsp;"backupTime": "02:15",<br/>
                &nbsp;&nbsp;"autoDispatch": true<br/>
                {`}`}
              </div>
            </div>
          )}

          {filtered.map(f => {
            const isSelected = selected?.id === f.id;
            const sc = severityColor(f.severity);
            const statusColor = STATUS_COLORS[f.dispatchStatus] ?? "#9ca3af";
            const isCritical  = f.severity.toLowerCase() === "critical";
            const age = minutesAgo(f.receivedAt);
            const distKm = f.techLat && f.techLng
              ? haversineKm(f.techLat, f.techLng, f.siteLat, f.siteLng).toFixed(1)
              : null;

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
                {/* row 1: cow id + severity badge + age */}
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

                {/* row 2: alarm name */}
                <div className="text-xs font-semibold text-white/90 mb-1 truncate">{f.alarmName}</div>

                {/* row 3: power + backup */}
                <div className="flex gap-3 text-[10px] text-muted-foreground mb-1.5">
                  {f.powerSource && <span>⚡ {f.powerSource}</span>}
                  {f.backupTime  && (
                    <span className={isCritical ? "text-red-400 font-bold" : ""}>
                      🔋 {f.backupTime} remaining
                    </span>
                  )}
                  {f.location && <span>📍 {f.location}</span>}
                </div>

                {/* row 4: status + tech + eta */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
                    {STATUS_LABELS[f.dispatchStatus] ?? f.dispatchStatus}
                  </span>
                  {f.assignedTech && (
                    <span className="text-[10px] text-blue-400">
                      👷 {f.assignedTech}
                      {distKm && <span className="text-muted-foreground"> · {distKm}km</span>}
                      {f.eta  && <span className="text-amber-400 font-semibold"> · {f.eta}min ETA</span>}
                    </span>
                  )}
                </div>

                {/* actions (shown when selected) */}
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
      `}</style>
    </div>
  );
}
