import { useCallback, useMemo, useRef } from "react";
import {
  GoogleMap,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
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

interface Props {
  analyses: SiteAnalysis[];
  techLocations: LiveTechLocation[];
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
}

export function TeamGoogleMap({ analyses, techLocations, selectedSiteId, onSelectSite }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "team-google-map",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);
  const onUnmount = useCallback(() => { mapRef.current = null; }, []);

  const riskSites   = useMemo(() => analyses.filter(a => a.overallRisk === "risk"), [analyses]);
  const safeSites   = useMemo(() => analyses.filter(a => a.overallRisk === "safe"), [analyses]);
  const onDutyTechs = useMemo(() => techLocations.filter(t => t.isOnDuty),          [techLocations]);

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
      {/* COW site markers — risk (red) */}
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

      {/* COW site markers — safe (teal) */}
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

      {/* Live technician markers — on duty */}
      {onDutyTechs.map(t => {
        const mins = minutesAgo(t.updatedAt);
        return (
          <OverlayView
            key={`tech-on-${t.userId}`}
            position={{ lat: t.lat, lng: t.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              title={`${t.userName} — ${t.area ?? "unknown"} (${mins}m ago)`}
              style={{
                transform: "translate(-50%,-100%)",
                pointerEvents: "auto",
                cursor: "default",
              }}
            >
              <div style={{
                background: "#16a34a",
                color: "#fff",
                borderRadius: 8,
                border: "2px solid #fff",
                padding: "3px 7px",
                fontSize: 10,
                fontWeight: 800,
                lineHeight: 1.3,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                position: "relative",
                whiteSpace: "nowrap",
                minWidth: 52,
              }}>
                <div>{t.userName}</div>
                <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.9 }}>{t.area ?? "—"}</div>
                {/* triangle pointer */}
                <div style={{
                  position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "6px solid #16a34a",
                }} />
              </div>
            </div>
          </OverlayView>
        );
      })}

    </GoogleMap>
  );
}
