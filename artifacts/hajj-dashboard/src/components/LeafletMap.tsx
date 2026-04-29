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

    // Large radius → 31 safe sites merge into a wide green cloud when zoomed out
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heatSafe = (L as any).heatLayer(safePoints, {
      radius: 90, blur: 70, maxZoom: 17, minOpacity: 0.20, max: 1.0,
      gradient: {
        0.0: "rgba(0,150,110,0)",
        0.2: "#00BFB3",
        0.6: "#00966E",
        1.0: "#006644",
      },
    });

    // Small radius → 6 risk sites stay as tight red spots, clearly visible on top
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heatRisk = (L as any).heatLayer(riskPoints, {
      radius: 38, blur: 28, maxZoom: 17, minOpacity: 0.50, max: 1.0,
      gradient: {
        0.0: "rgba(232,23,93,0)",
        0.25: "#FF9AAD",
        0.65: "#E8175D",
        1.0:  "#9B0033",
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

export function LeafletMap({ analyses, selectedSiteId, onSelectSite, showTeamMarkers = false }: LeafletMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);

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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                        ? `SEC ${a.site.secCapacityAmp ?? "—"}A / Gen ${a.site.backupGeneratorKva?.toFixed(1) ?? "—"}kVA`
                        : `${a.site.generatorKva.toFixed(1)} kVA`}
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
            style={{ background: "linear-gradient(to right, #00BFB3, #FF9AAD, #E8175D, #4A0E8F)" }}
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
