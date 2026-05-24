import { useState } from "react";
import type { SiteAnalysis } from "../lib/calculations";

interface SiteMapProps {
  analyses: SiteAnalysis[];
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
}

const LOCATIONS = [
  { key: "Masjid al-Haram", label: "Masjid al-Haram", x: 38, y: 30 },
  { key: "Makkah", label: "Makkah", x: 45, y: 40 },
  { key: "Mina", label: "Mina", x: 57, y: 38 },
  { key: "Muzdalifah", label: "Muzdalifah", x: 63, y: 50 },
  { key: "Arafat", label: "Arafat", x: 68, y: 62 },
  { key: "Jeddah Islamic Port", label: "Jeddah Port", x: 12, y: 28 },
  { key: "Jeddah-Makkah Highway", label: "Highway", x: 26, y: 35 },
];

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const minLat = 21.33, maxLat = 21.56;
  const minLng = 39.10, maxLng = 40.02;
  const x = ((lng - minLng) / (maxLng - minLng)) * 86 + 7;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 76 + 10;
  return { x, y };
}

export function SiteMap({ analyses, selectedSiteId, onSelectSite }: SiteMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const riskColor = (tier: "safe" | "backup" | "outage") =>
    tier === "safe" ? "#00BFB3" : tier === "backup" ? "#f97316" : "#E8175D";
  const riskStroke = (tier: "safe" | "backup" | "outage") =>
    tier === "safe" ? "#00968c" : tier === "backup" ? "#c2440e" : "#b01040";

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-stone-100 to-amber-50 rounded-xl overflow-hidden border border-border" style={{ height: 420 }}>
      <svg viewBox="0 0 100 90" className="w-full h-full">
        <defs>
          <radialGradient id="desertGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect width="100" height="90" fill="url(#desertGrad)" />

        <path d="M 20 45 Q 35 40 45 42 Q 55 44 62 42 Q 70 40 80 55" stroke="#d97706" strokeWidth="0.8" fill="none" strokeDasharray="2,1" opacity="0.6" />
        <text x="35" y="48" fontSize="1.8" fill="#92400e" opacity="0.6" textAnchor="middle">Jeddah - Makkah Highway</text>

        <ellipse cx="12" cy="25" rx="8" ry="5" fill="#93c5fd" opacity="0.3" stroke="#3b82f6" strokeWidth="0.3" />
        <text x="12" y="27" fontSize="1.5" fill="#1d4ed8" textAnchor="middle" opacity="0.8">Port</text>

        {LOCATIONS.map(loc => (
          <g key={loc.key}>
            <circle cx={loc.x} cy={loc.y} r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(120,80,20,0.3)" strokeWidth="0.3" />
            <text x={loc.x} y={loc.y + 6} fontSize="1.6" fill="#78350f" textAnchor="middle" fontWeight="600" opacity="0.7">
              {loc.label}
            </text>
          </g>
        ))}

        {analyses.map(a => {
          const { x, y } = latLngToXY(a.site.lat, a.site.lng);
          const color = riskColor(a.riskTier);
          const stroke = riskStroke(a.riskTier);
          const isSelected = a.site.id === selectedSiteId;
          const isHovered = a.site.id === hoveredId;
          const r = isSelected ? 2.2 : isHovered ? 2 : 1.5;

          return (
            <g key={a.site.id}>
              {a.riskTier === "outage" && (
                <circle cx={x} cy={y} r={r * 2} fill={color} opacity="0.2">
                  <animate attributeName="r" values={`${r * 1.5};${r * 3}`} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={x} cy={y}
                r={r}
                fill={color}
                stroke={isSelected ? "#fff" : stroke}
                strokeWidth={isSelected ? 0.8 : 0.4}
                filter={isSelected || isHovered ? "url(#glow)" : undefined}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectSite(a.site.id)}
                onMouseEnter={() => setHoveredId(a.site.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
              {(isSelected || isHovered) && (
                <rect
                  x={x + 2} y={y - 3}
                  width={18} height={5}
                  rx="0.8"
                  fill="rgba(10,10,10,0.85)"
                />
              )}
              {(isSelected || isHovered) && (
                <text x={x + 11} y={y + 0.5} fontSize="1.5" fill="white" textAnchor="middle" pointerEvents="none">
                  {a.site.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs space-y-1 border border-border shadow">
        <div className="font-semibold text-foreground mb-1 text-[11px] uppercase tracking-wide">Risk Legend</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:"#00BFB3"}}/><span>Safe</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:"#FF9AAD"}}/><span>Warning</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:"#E8175D"}}/><span>Critical</span></div>
      </div>
    </div>
  );
}
