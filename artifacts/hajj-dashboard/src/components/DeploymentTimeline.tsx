import { Tent, Mountain, Moon, Building2, DoorOpen } from "lucide-react";
import type { ComponentType } from "react";

interface Zone {
  key: string;
  label: string;
  shortLabel: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const ZONES: Zone[] = [
  { key: "mina",     label: "Mina",             shortLabel: "Mina",     Icon: Tent,      color: "#ef4444" },
  { key: "arafat",   label: "Arafat",            shortLabel: "Arafat",   Icon: Mountain,  color: "#f59e0b" },
  { key: "muzdalifa",label: "Muzdalifa",          shortLabel: "Muzdalif", Icon: Moon,      color: "#60a5fa" },
  { key: "haram",    label: "Makkah Haram",       shortLabel: "Haram",    Icon: Building2, color: "#a78bfa" },
  { key: "entrance", label: "Makkah Entrance",    shortLabel: "Entrance", Icon: DoorOpen,  color: "#34d399" },
];

interface Phase {
  day: string;
  date: string;
  label: string;
  pinColor: string;
  zones: Record<string, number>;
  peak?: boolean;
}

const PHASES: Phase[] = [
  { day: "7",  date: "7 Dhu Alhijah",  label: "Initial Deployment", pinColor: "#ef4444",
    zones: { mina: 28, arafat: 0, muzdalifa: 0, haram: 65, entrance: 55 } },
  { day: "8",  date: "8 Dhu Alhijah",  label: "Mina Coverage",      pinColor: "#ef4444",
    zones: { mina: 62, arafat: 0, muzdalifa: 0, haram: 35, entrance: 30 } },
  { day: "9",  date: "9 Dhu Alhijah",  label: "Arafat Peak",        pinColor: "#f59e0b", peak: true,
    zones: { mina: 0, arafat: 100, muzdalifa: 0, haram: 0, entrance: 0 } },
  { day: "9★", date: "Night of 9",     label: "Muzdalifa Night",    pinColor: "#60a5fa",
    zones: { mina: 0, arafat: 0, muzdalifa: 82, haram: 0, entrance: 0 } },
  { day: "10", date: "10 Dhu Alhijah", label: "Return Surge",       pinColor: "#ef4444",
    zones: { mina: 88, arafat: 0, muzdalifa: 0, haram: 30, entrance: 0 } },
  { day: "11", date: "11 Dhu Alhijah", label: "Sustained Ops",      pinColor: "#ef4444",
    zones: { mina: 71, arafat: 0, muzdalifa: 0, haram: 0, entrance: 0 } },
  { day: "12", date: "12 Dhu Alhijah", label: "Reduced Load",       pinColor: "#9ca3af",
    zones: { mina: 44, arafat: 0, muzdalifa: 0, haram: 52, entrance: 44 } },
  { day: "13", date: "13 Dhu Alhijah", label: "Final Phase",        pinColor: "#6b7280",
    zones: { mina: 18, arafat: 0, muzdalifa: 0, haram: 72, entrance: 65 } },
];

/* ── Map-pin SVG ─────────────────────────────────────────────────── */
function MapPin({ color, day, peak }: { color: string; day: string; peak?: boolean }) {
  return (
    <svg width="52" height="62" viewBox="0 0 52 62" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: peak ? `drop-shadow(0 0 8px ${color}99)` : undefined }}>
      {/* Pin body */}
      <path
        d="M26 2C14.954 2 6 10.954 6 22C6 36 26 60 26 60C26 60 46 36 46 22C46 10.954 37.046 2 26 2Z"
        fill={color}
      />
      {/* Inner white circle */}
      <circle cx="26" cy="22" r="13" fill="white" fillOpacity="0.15" />
      <circle cx="26" cy="22" r="11" fill="white" fillOpacity="0.92" />
      {/* Day number */}
      <text
        x="26" y="27"
        textAnchor="middle"
        fontSize={day.length > 2 ? "9" : "13"}
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        fill={color}
      >
        {day}
      </text>
    </svg>
  );
}

/* ── Zone icon row ───────────────────────────────────────────────── */
function ZoneRow({ zones }: { zones: Record<string, number> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", alignItems: "center", padding: "6px 2px 0" }}>
      {ZONES.map(({ key, shortLabel, Icon, color }) => {
        const pct = zones[key] ?? 0;
        const active = pct > 0;
        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: "90%",
              padding: "3px 6px",
              borderRadius: 6,
              background: active ? `${color}18` : "transparent",
              border: active ? `1px solid ${color}35` : "1px solid transparent",
              opacity: active ? 1 : 0.28,
              transition: "opacity 0.2s",
            }}
          >
            <Icon size={11} color={active ? color : "#6b7280"} />
            <span style={{ fontSize: "9px", color: active ? color : "#6b7280", fontWeight: 700, flex: 1, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {shortLabel}
            </span>
            <span style={{ fontSize: "10px", fontWeight: 800, color: active ? color : "#4b5563", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.3px" }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function DeploymentTimeline() {
  return (
    <div style={{ height: "calc(100vh - 148px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: "8px 8px 0" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
            Hajj 1447 — Team Deployment Timeline
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>
            Pilgrim zone availability % · 7 – 13 Dhu Alhijah
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: "11px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {ZONES.map(z => (
            <span key={z.key} style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted-foreground)" }}>
              <z.Icon size={11} color={z.color} />
              <span style={{ color: z.color, fontWeight: 600 }}>{z.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Timeline body */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", minHeight: 0, position: "relative" }}>
        {PHASES.map((phase, i) => (
          <div
            key={phase.day}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* ── Pin area (above spine) ── */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
              <MapPin color={phase.pinColor} day={phase.day} peak={phase.peak} />
            </div>

            {/* ── Spine row ── */}
            <div style={{ flexShrink: 0, width: "100%", position: "relative", height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Full-width spine segment */}
              <div style={{
                position: "absolute", left: i === 0 ? "50%" : 0, right: i === PHASES.length - 1 ? "50%" : 0,
                top: "50%", transform: "translateY(-50%)",
                height: 6, borderRadius: i === 0 ? "3px 0 0 3px" : i === PHASES.length - 1 ? "0 3px 3px 0" : 0,
                background: "linear-gradient(90deg, rgba(147,51,234,0.6) 0%, rgba(147,51,234,0.85) 100%)",
              }} />
              {/* Date label on spine */}
              <span style={{
                position: "relative", zIndex: 2,
                fontSize: "9px", fontWeight: 700, color: "#fff",
                background: "rgba(147,51,234,0.85)",
                border: `1px solid ${phase.pinColor}`,
                borderRadius: 10, padding: "1px 7px",
                whiteSpace: "nowrap",
              }}>
                {phase.date}
              </span>
            </div>

            {/* ── Zone icons + % (below spine) ── */}
            <div style={{ flex: 1, width: "100%", minHeight: 0, overflow: "hidden" }}>
              <ZoneRow zones={phase.zones} />
              {/* Phase label */}
              <div style={{ textAlign: "center", marginTop: 4, fontSize: "9px", fontWeight: 700, color: "var(--muted-foreground)", padding: "0 4px", lineHeight: 1.2 }}>
                {phase.label}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
