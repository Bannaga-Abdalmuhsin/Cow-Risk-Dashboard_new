import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import type { SiteAnalysis } from "../lib/calculations";
import { ESCALATION_TEAMS, TRANSPORT_ICON } from "../lib/escalationTeams";

// Fix default leaflet icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RISK_COLORS = {
  safe: "#00BFB3",
  risk: "#E8175D",
};

const RISK_FILL_OPACITY = {
  safe: 0.75,
  risk: 0.9,
};

interface HeatmapLayerProps {
  analyses: SiteAnalysis[];
}

function HeatmapLayer({ analyses }: HeatmapLayerProps) {
  const map = useMap();
  const safeRef = useRef<L.Layer | null>(null);
  const riskRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (safeRef.current) { map.removeLayer(safeRef.current); safeRef.current = null; }
    if (riskRef.current) { map.removeLayer(riskRef.current); riskRef.current = null; }

    const safePoints = analyses
      .filter(a => a.overallRisk === "safe")
      .map(a => [a.site.lat, a.site.lng, 1.0]) as [number, number, number][];

    const riskPoints = analyses
      .filter(a => a.overallRisk === "risk")
      .map(a => [a.site.lat, a.site.lng, 1.0]) as [number, number, number][];

    // Large radius → safe sites merge into a wide vivid green cloud
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heatSafe = (L as any).heatLayer(safePoints, {
      radius: 95, blur: 65, maxZoom: 17, minOpacity: 0.42, max: 1.0,
      gradient: {
        0.0: "rgba(0,180,130,0)",
        0.15: "#00D4C4",
        0.5:  "#00BFB3",
        0.8:  "#00966E",
        1.0:  "#00704A",
      },
    });

    // Smaller opacity → risk sites visible but less intense/aggressive
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heatRisk = (L as any).heatLayer(riskPoints, {
      radius: 36, blur: 30, maxZoom: 17, minOpacity: 0.25, max: 1.0,
      gradient: {
        0.0:  "rgba(232,23,93,0)",
        0.30: "rgba(255,160,180,0.55)",
        0.65: "rgba(220,40,90,0.75)",
        1.0:  "rgba(160,0,50,0.85)",
      },
    });

    heatSafe.addTo(map);
    heatRisk.addTo(map);
    safeRef.current = heatSafe;
    riskRef.current = heatRisk;

    return () => {
      if (safeRef.current) { map.removeLayer(safeRef.current); safeRef.current = null; }
      if (riskRef.current) { map.removeLayer(riskRef.current); riskRef.current = null; }
    };
  }, [map, analyses]);

  return null;
}

interface LeafletMapProps {
  analyses: SiteAnalysis[];
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
  showTeamMarkers?: boolean;
}

type TileMode = "street" | "satellite" | "terrain" | "dark";

const TILE_LAYERS: Record<TileMode, { url: string; attribution: string; label: string; icon: string }> = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    label: "Street",
    icon: "🗺️",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    label: "Satellite",
    icon: "🛰️",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    label: "Terrain",
    icon: "🏔️",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    label: "Dark",
    icon: "🌑",
  },
};

export function LeafletMap({ analyses, selectedSiteId, onSelectSite, showTeamMarkers = false }: LeafletMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);
  const [tileMode, setTileMode] = useState<TileMode>("street");

  const teamIcon = (teamName: string) => L.divIcon({
    className: "",
    html: `<div style="background:#4A0E8F;color:white;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.4);white-space:nowrap;">${teamName.replace("Team ", "T")}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const center: [number, number] = [21.38, 39.93];

  return (
    <div className="relative rounded-xl overflow-hidden border border-border" style={{ height: "100%", minHeight: 420 }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          key={tileMode}
          attribution={TILE_LAYERS[tileMode].attribution}
          url={TILE_LAYERS[tileMode].url}
        />

        {showHeatmap && <HeatmapLayer analyses={analyses} />}

        {showTeamMarkers && ESCALATION_TEAMS.map(team => (
          <Marker
            key={team.teamName}
            position={[team.lat, team.lng]}
            icon={teamIcon(team.teamName)}
          >
            <Popup maxWidth={220} minWidth={180}>
              <div className="p-1">
                <div className="font-bold text-sm mb-0.5" style={{ color: "#4A0E8F" }}>{team.teamName}</div>
                <div className="text-xs text-gray-500 mb-1.5">Assigned: <span className="font-semibold text-gray-700">{team.siteId}</span> · {team.location}</div>
                <div className="flex items-center gap-1.5 mb-1 text-xs">
                  <span>{TRANSPORT_ICON[team.transport]}</span>
                  <span className="text-gray-600">{team.transport}</span>
                </div>
                <div className="text-xs font-semibold" style={{ color: team.etaMinutes === 15 ? "#059669" : "#d97706" }}>
                  ⏱ ETA: {team.etaMinutes} min
                </div>
                <button
                  onClick={() => onSelectSite(team.siteId)}
                  className="mt-2 w-full text-[11px] py-1 rounded text-white font-semibold"
                  style={{ background: "#4A0E8F" }}
                >
                  View Site Analysis
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {showMarkers && analyses.map(a => {
          const isSelected = a.site.id === selectedSiteId;
          const color = RISK_COLORS[a.overallRisk];
          return (
            <CircleMarker
              key={a.site.id}
              center={[a.site.lat, a.site.lng]}
              radius={isSelected ? 11 : 7}
              pathOptions={{
                color: isSelected ? "#4A0E8F" : color,
                fillColor: color,
                fillOpacity: RISK_FILL_OPACITY[a.overallRisk],
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelectSite(a.site.id),
              }}
            >
              <Popup maxWidth={260} minWidth={220}>
                <div className="p-1">
                  <div className="font-bold text-sm mb-1">{a.site.id}</div>
                  <div className="text-xs text-gray-500 mb-2">{a.site.location}</div>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                      style={{
                        background: a.overallRisk === "safe" ? "#d0f5f3" : "#fce4ed",
                        color: a.overallRisk === "safe" ? "#00736b" : "#b01040",
                        border: `1px solid ${RISK_COLORS[a.overallRisk]}`,
                      }}
                    >
                      {a.overallRisk}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                      {a.site.siteType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>Power: <span className="font-semibold">
                      {a.site.powerConfig === "commercial_with_backup"
                        ? `SEC ${a.site.secCapacityAmp ?? "—"}A / Gen ${a.site.rawBackupGenKva ?? "—"}kVA`
                        : a.site.primeGenNetPowerKw != null
                          ? `Gen1: ${a.site.rawGenKva ?? "—"}kVA | Gen2: ${a.site.rawBackupGenKva ?? "—"}kVA`
                          : `Single Gen: ${a.site.rawGenKva ?? "—"}kVA`}
                    </span></div>
                    <div>Battery: <span className="font-semibold">{a.site.batteryCapacityAh} Ah {a.site.batteryType.replace("_", "-")}</span></div>
                    <div>AC1: <span className="font-semibold">{(a.site.ac1CapacityBtu / 1000).toFixed(0)}k BTU/h</span></div>
                  </div>
                  <button
                    onClick={() => onSelectSite(a.site.id)}
                    className="mt-2 w-full text-[11px] py-1 rounded text-white font-semibold"
                    style={{ background: "#4A0E8F" }}
                  >
                    View Full Analysis
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map mode switcher — top left */}
      <div className="absolute top-3 left-3 z-[1000] flex gap-1">
        {(Object.keys(TILE_LAYERS) as TileMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setTileMode(mode)}
            title={TILE_LAYERS[mode].label}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg shadow-md border transition-all flex items-center gap-1"
            style={{
              background: tileMode === mode ? "#4A0E8F" : "white",
              color: tileMode === mode ? "white" : "#4A0E8F",
              borderColor: tileMode === mode ? "#4A0E8F" : "#d1d5db",
            }}
          >
            <span>{TILE_LAYERS[mode].icon}</span>
            <span>{TILE_LAYERS[mode].label}</span>
          </button>
        ))}
      </div>

      {/* Map controls overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => setShowHeatmap(h => !h)}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg shadow-md border transition-all"
          style={{
            background: showHeatmap ? "#4A0E8F" : "white",
            color: showHeatmap ? "white" : "#4A0E8F",
            borderColor: "#4A0E8F",
          }}
        >
          {showHeatmap ? "Hide" : "Show"} Heatmap
        </button>
        <button
          onClick={() => setShowMarkers(m => !m)}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg shadow-md border transition-all"
          style={{
            background: showMarkers ? "#4A0E8F" : "white",
            color: showMarkers ? "white" : "#4A0E8F",
            borderColor: "#4A0E8F",
          }}
        >
          {showMarkers ? "Hide" : "Show"} Markers
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-3 z-[1000] bg-white/95 backdrop-blur rounded-xl px-3 py-2.5 text-xs shadow-lg border border-gray-200">
        <div className="font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-[10px]">Risk Level</div>
        {(["safe", "risk"] as const).map(r => (
          <div key={r} className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full inline-block border border-white shadow-sm" style={{ background: RISK_COLORS[r] }} />
            <span className="capitalize text-gray-600 font-medium">{r === "risk" ? "Risk" : "Safe"}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 mt-1.5 pt-1.5 text-[10px] text-gray-400">
          {analyses.length} sites plotted
        </div>
      </div>

      {/* Heatmap gradient legend */}
      {showHeatmap && (
        <div className="absolute bottom-8 left-3 z-[1000] bg-white/95 backdrop-blur rounded-xl px-3 py-2.5 text-xs shadow-lg border border-gray-200">
          <div className="font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-[10px]">Risk Intensity</div>
          <div
            className="w-28 h-2.5 rounded-full mb-1"
            style={{ background: "linear-gradient(to right, #00D4C4, #00BFB3, rgba(220,40,90,0.6), rgba(160,0,50,0.75))" }}
          />
          <div className="flex justify-between text-[9px] text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
}
