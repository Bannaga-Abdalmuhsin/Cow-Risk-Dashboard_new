import { Tent, Mountain, Moon, Building2, DoorOpen } from "lucide-react";
import type { ComponentType } from "react";

interface Zone {
  key: string;
  label: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const ZONES: Zone[] = [
  { key: "mina",      label: "Mina",           Icon: Tent,      color: "#ef4444" },
  { key: "arafat",    label: "Arafat",          Icon: Mountain,  color: "#f59e0b" },
  { key: "muzdalifa", label: "Muzdalifa",        Icon: Moon,      color: "#60a5fa" },
  { key: "haram",     label: "Makkah Haram",     Icon: Building2, color: "#a78bfa" },
  { key: "entrance",  label: "Makkah Entrance",  Icon: DoorOpen,  color: "#34d399" },
];

interface Phase {
  day: string;
  date: string;
  label: string;
  pinColor: string;
  above: boolean; // true = card above spine, false = card below spine
  zones: Record<string, number>;
  peak?: boolean;
}

const PHASES: Phase[] = [
  { day: "7",  date: "7 Dhu Alhijah",  label: "Initial Deployment", pinColor: "#ef4444", above: false,
    zones: { mina: 28, arafat: 0, muzdalifa: 0, haram: 65, entrance: 55 } },
  { day: "8",  date: "8 Dhu Alhijah",  label: "Mina Coverage",      pinColor: "#ef4444", above: true,
    zones: { mina: 62, arafat: 0, muzdalifa: 0, haram: 35, entrance: 30 } },
  { day: "9",  date: "9 Dhu Alhijah",  label: "Arafat Peak",        pinColor: "#f59e0b", above: false, peak: true,
    zones: { mina: 0, arafat: 100, muzdalifa: 0, haram: 0, entrance: 0 } },
  { day: "9★", date: "Night of 9",     label: "Muzdalifa Night",    pinColor: "#60a5fa", above: true,
    zones: { mina: 0, arafat: 0, muzdalifa: 82, haram: 0, entrance: 0 } },
  { day: "10", date: "10 Dhu Alhijah", label: "Return Surge",       pinColor: "#ef4444", above: false,
    zones: { mina: 88, arafat: 0, muzdalifa: 0, haram: 30, entrance: 0 } },
  { day: "11", date: "11 Dhu Alhijah", label: "Sustained Ops",      pinColor: "#ef4444", above: true,
    zones: { mina: 71, arafat: 0, muzdalifa: 0, haram: 0, entrance: 0 } },
  { day: "12", date: "12 Dhu Alhijah", label: "Reduced Load",       pinColor: "#9ca3af", above: false,
    zones: { mina: 44, arafat: 0, muzdalifa: 0, haram: 52, entrance: 44 } },
  { day: "13", date: "13 Dhu Alhijah", label: "Final Phase",        pinColor: "#6b7280", above: true,
    zones: { mina: 18, arafat: 0, muzdalifa: 0, haram: 72, entrance: 65 } },
];

/* ── Map pin (points down when above spine, flip for below) ── */
function MapPin({ color, day, peak, flip }: { color: string; day: string; peak?: boolean; flip?: boolean }) {
  return (
    <svg
      width="56" height="66"
      viewBox="0 0 52 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: flip ? "scaleY(-1)" : undefined,
        filter: peak ? `drop-shadow(0 0 10px ${color}bb)` : `drop-shadow(0 2px 4px rgba(0,0,0,0.4))`,
        flexShrink: 0,
      }}
    >
      <path d="M26 2C14.954 2 6 10.954 6 22C6 36 26 60 26 60C26 60 46 36 46 22C46 10.954 37.046 2 26 2Z" fill={color} />
      <circle cx="26" cy="22" r="13" fill="white" fillOpacity="0.12" />
      <circle cx="26" cy="22" r="11" fill="white" fillOpacity="0.90" />
      <text
        x="26" y="27"
        textAnchor="middle"
        fontSize={day.length > 2 ? "8" : "13"}
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill={color}
        style={{ transform: flip ? "scaleY(-1) translateY(-44px)" : undefined } as React.CSSProperties}
      >
        {day}
      </text>
    </svg>
  );
}

/* ── Zone card ── */
function ZoneCard({ phase }: { phase: Phase }) {
  const activeZones = ZONES.filter(z => (phase.zones[z.key] ?? 0) > 0);
  const dimZones    = ZONES.filter(z => (phase.zones[z.key] ?? 0) === 0);

  return (
    <div style={{
      background: "var(--card, rgba(255,255,255,0.04))",
      border: `1px solid ${phase.pinColor}35`,
      borderRadius: 12,
      padding: "10px 10px 8px",
      width: "100%",
      boxShadow: phase.peak ? `0 0 18px ${phase.pinColor}33` : "0 2px 8px rgba(0,0,0,0.25)",
    }}>
      {/* Phase label */}
      <div style={{ fontSize: "11px", fontWeight: 800, color: phase.pinColor, marginBottom: 6, letterSpacing: "0.01em" }}>
        {phase.label}
      </div>

      {/* Active zones — large */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {activeZones.map(z => (
          <div key={z.key} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: `${z.color}18`, border: `1px solid ${z.color}40`,
            borderRadius: 7, padding: "5px 8px",
          }}>
            <z.Icon size={13} color={z.color} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: z.color, flex: 1 }}>{z.label}</span>
            <span style={{ fontSize: "14px", fontWeight: 900, color: z.color, fontVariantNumeric: "tabular-nums" }}>
              {phase.zones[z.key]}%
            </span>
          </div>
        ))}
      </div>

      {/* Dim zones — compact row */}
      {dimZones.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: activeZones.length > 0 ? 5 : 0 }}>
          {dimZones.map(z => (
            <div key={z.key} style={{
              display: "flex", alignItems: "center", gap: 3,
              padding: "2px 5px", borderRadius: 5,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              opacity: 0.4,
            }}>
              <z.Icon size={9} color="#6b7280" />
              <span style={{ fontSize: "9px", color: "#6b7280" }}>0%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export function DeploymentTimeline() {
  return (
    <div style={{ height: "calc(100vh - 148px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: "8px 12px 0" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>Hajj 1447 — Team Deployment Timeline</div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>Pilgrim zone availability % · 7–13 Dhu Alhijah · alternating layout</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: "11px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {ZONES.map(z => (
            <span key={z.key} style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted-foreground)" }}>
              <z.Icon size={11} color={z.color} />
              <span style={{ color: z.color, fontWeight: 600 }}>{z.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, display: "flex", gap: 6, minHeight: 0 }}>
        {PHASES.map((phase, i) => (
          <div key={phase.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>

            {/* ── TOP HALF ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", width: "100%", paddingBottom: 0, gap: 4, minHeight: 0, overflow: "hidden" }}>
              {phase.above ? (
                /* Card above — anchored to spine */
                <ZoneCard phase={phase} />
              ) : (
                /* Pin above — pointing down into spine */
                <MapPin color={phase.pinColor} day={phase.day} peak={phase.peak} />
              )}
            </div>

            {/* ── SPINE ── */}
            <div style={{ flexShrink: 0, height: 28, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {/* Spine bar segment */}
              <div style={{
                position: "absolute",
                left: i === 0 ? "50%" : 0,
                right: i === PHASES.length - 1 ? "50%" : 0,
                top: "50%", transform: "translateY(-50%)",
                height: 7,
                borderRadius: i === 0 ? "4px 0 0 4px" : i === PHASES.length - 1 ? "0 4px 4px 0" : 0,
                background: "linear-gradient(90deg, rgba(124,58,237,0.7) 0%, rgba(139,92,246,0.9) 100%)",
              }} />
              {/* Date pill on spine */}
              <span style={{
                position: "relative", zIndex: 2,
                fontSize: "9px", fontWeight: 700, color: "#fff",
                background: "rgba(109,40,217,0.90)",
                border: `1.5px solid ${phase.pinColor}`,
                borderRadius: 10, padding: "1px 6px",
                whiteSpace: "nowrap",
              }}>
                {phase.date}
              </span>
            </div>

            {/* ── BOTTOM HALF ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%", paddingTop: 0, gap: 4, minHeight: 0, overflow: "hidden" }}>
              {!phase.above ? (
                /* Card below — anchored to spine */
                <ZoneCard phase={phase} />
              ) : (
                /* Pin below — pointing up into spine (flipped) */
                <MapPin color={phase.pinColor} day={phase.day} peak={phase.peak} flip />
              )}
            </div>

          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, height: 8 }} />
    </div>
  );
}
