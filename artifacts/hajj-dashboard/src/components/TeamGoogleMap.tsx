import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  OverlayView,
} from "@react-google-maps/api";
import { useGoogleMaps } from "../lib/GoogleMapsProvider";
import type { SiteAnalysis } from "../lib/calculations";
import type { LiveTechLocation } from "./LeafletMap";

const MAKKAH_CENTER = { lat: 21.38, lng: 39.93 };

const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeId: "satellite",
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  rotateControl: false,
  tilt: 0,
  styles: [
    { featureType: "all", elementType: "labels.text.fill",   stylers: [{ color: "#ffffff" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#000000" }, { weight: 2 }] },
  ],
};

function minutesAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

/* ── Helmet SVG marker ─────────────────────────────────────────────────────── */
function HelmetMarker({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6))` }}>
      <path d="M5 20 C5 9 10 5 15 5 C20 5 25 9 25 20 Z" fill={color} />
      <rect x="2" y="19" width="26" height="5" rx="2.5" fill={color} />
      <rect x="5" y="19.5" width="20" height="1.5" rx="0.75" fill="rgba(0,0,0,0.2)" />
      <path d="M9 13 Q11 7 15 7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" />
      {pulse && (
        <circle cx="15" cy="14" r="13" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
          <animate attributeName="r" from="12" to="16" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

interface Props {
  analyses:       SiteAnalysis[];
  techLocations:  LiveTechLocation[];
  selectedSiteId: string | null;
  onSelectSite:   (id: string) => void;
}

/** ease-in-out quadratic */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function TeamGoogleMap({ analyses, techLocations, selectedSiteId, onSelectSite }: Props) {
  const { isLoaded, loadError } = useGoogleMaps();

  /* Re-evaluate freshness every 30 s so stale markers turn red */
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const mapRef    = useRef<google.maps.Map | null>(null);
  const onLoad    = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);
  const onUnmount = useCallback(() => { mapRef.current = null; }, []);

  const riskSites = useMemo(() => analyses.filter(a => a.overallRisk === "risk"), [analyses]);
  const safeSites = useMemo(() => analyses.filter(a => a.overallRisk === "safe"), [analyses]);

  const visibleTechs = useMemo(
    () => techLocations.filter(t => minutesAgo(t.updatedAt) < 60),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techLocations],
  );

  /* ── smooth marker interpolation ────────────────────────────────────────── */
  const animPositionsRef = useRef(new Map<number, { lat: number; lng: number }>());
  const animFramesRef    = useRef(new Map<number, number>());
  const [displayPositions, setDisplayPositions] = useState(
    new Map<number, { lat: number; lng: number }>(),
  );

  useEffect(() => {
    techLocations.forEach(tech => {
      const target  = { lat: tech.lat, lng: tech.lng };
      const current = animPositionsRef.current.get(tech.userId);

      if (!current) {
        /* first appearance — snap into place, no animation */
        animPositionsRef.current.set(tech.userId, target);
        setDisplayPositions(new Map(animPositionsRef.current));
        return;
      }

      const dLat = Math.abs(current.lat - target.lat);
      const dLng = Math.abs(current.lng - target.lng);
      if (dLat < 1e-7 && dLng < 1e-7) return;

      const startLat = current.lat, startLng = current.lng;
      const t0 = performance.now(), DURATION = 1000;
      const userId = tech.userId;

      const existing = animFramesRef.current.get(userId);
      if (existing) cancelAnimationFrame(existing);

      const step = (now: number) => {
        const t   = Math.min((now - t0) / DURATION, 1);
        const pos = {
          lat: startLat + (target.lat - startLat) * easeInOut(t),
          lng: startLng + (target.lng - startLng) * easeInOut(t),
        };
        animPositionsRef.current.set(userId, pos);
        setDisplayPositions(new Map(animPositionsRef.current));
        if (t < 1) {
          animFramesRef.current.set(userId, requestAnimationFrame(step));
        } else {
          animFramesRef.current.delete(userId);
        }
      };
      animFramesRef.current.set(userId, requestAnimationFrame(step));
    });

    /* cleanup removed techs */
    const techIds = new Set(techLocations.map(t => t.userId));
    for (const userId of animPositionsRef.current.keys()) {
      if (!techIds.has(userId)) {
        animPositionsRef.current.delete(userId);
        const frame = animFramesRef.current.get(userId);
        if (frame) cancelAnimationFrame(frame);
        animFramesRef.current.delete(userId);
      }
    }
  }, [techLocations]);

  /* cleanup rAF on unmount */
  useEffect(() => () => {
    for (const frame of animFramesRef.current.values()) cancelAnimationFrame(frame);
  }, []);

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-xl border border-card-border text-red-400 text-sm p-6 text-center">
        <div>
          <div className="text-2xl mb-2">⚠️</div>
          <p className="font-semibold">Google Maps failed to load</p>
          <p className="text-xs text-muted-foreground mt-1">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-xl border border-card-border">
        <div className="text-center gap-3 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading Google Maps…</span>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "12px" }}
      center={MAKKAH_CENTER}
      zoom={11}
      options={MAP_OPTIONS}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* ── COW site markers — risk (red) ─────────────────────────────── */}
      {riskSites.map(a => (
        <OverlayView
          key={a.site.id}
          position={{ lat: a.site.lat, lng: a.site.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => onSelectSite(a.site.id)}
            title={`${a.site.id} — ${a.site.name} (RISK)`}
            style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#E8175D",
              border: `2px solid ${selectedSiteId === a.site.id ? "#fff" : "rgba(232,23,93,0.5)"}`,
              boxShadow: "0 0 6px rgba(232,23,93,0.7)",
              cursor: "pointer",
              transform: "translate(-50%,-50%)",
            }}
          />
        </OverlayView>
      ))}

      {/* ── COW site markers — safe (teal) ────────────────────────────── */}
      {safeSites.map(a => (
        <OverlayView
          key={a.site.id}
          position={{ lat: a.site.lat, lng: a.site.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => onSelectSite(a.site.id)}
            title={`${a.site.id} — ${a.site.name} (SAFE)`}
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#00BFB3",
              border: `2px solid ${selectedSiteId === a.site.id ? "#fff" : "rgba(0,191,179,0.4)"}`,
              boxShadow: "0 0 4px rgba(0,191,179,0.5)",
              cursor: "pointer",
              transform: "translate(-50%,-50%)",
            }}
          />
        </OverlayView>
      ))}

      {/* ── Technician helmet markers — smoothly interpolated ─────────── */}
      {visibleTechs.map(t => {
        const mins   = minutesAgo(t.updatedAt);
        const online = mins < 15;
        const color  = online ? "#16a34a" : "#dc2626";
        const label  = t.userName.split(" ")[0];
        /* use animated position if available, else raw */
        const pos    = displayPositions.get(t.userId) ?? { lat: t.lat, lng: t.lng };

        return (
          <OverlayView
            key={`tech-${t.userId}`}
            position={pos}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              title={`${t.userName} · ${t.area ?? "—"} · ${mins}m ago`}
              style={{
                transform: "translate(-50%, -100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "default",
                pointerEvents: "auto",
                gap: 1,
              }}
            >
              <HelmetMarker color={color} pulse={online} />
              <div style={{
                background:   online ? "rgba(22,163,74,0.85)" : "rgba(220,38,38,0.85)",
                color:        "#fff",
                borderRadius: 5,
                padding:      "1px 5px",
                fontSize:     9.5,
                fontWeight:   800,
                whiteSpace:   "nowrap",
                lineHeight:   1.4,
                textAlign:    "center",
                border:       `1px solid ${online ? "rgba(22,163,74,0.6)" : "rgba(220,38,38,0.6)"}`,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.5)",
              }}>
                {label}
                <span style={{ opacity: 0.8, marginLeft: 3, fontSize: 8.5 }}>
                  {mins}m
                </span>
              </div>
              <div style={{
                width: 0, height: 0,
                borderLeft:  "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop:   `5px solid ${online ? "rgba(22,163,74,0.85)" : "rgba(220,38,38,0.85)"}`,
                marginTop:   -1,
              }} />
            </div>
          </OverlayView>
        );
      })}

    </GoogleMap>
  );
}
