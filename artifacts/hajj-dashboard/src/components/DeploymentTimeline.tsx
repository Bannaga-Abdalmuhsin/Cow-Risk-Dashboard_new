interface Phase {
  day: string;
  date: string;
  zone: string;
  zoneColor: string;
  pilgrims: number;   // % above the spine (Hajj zone)
  haram: number;      // % below spine — Makkah Haram
  entrance: number;   // % below spine — Makkah Entrance
  label: string;
  peak?: boolean;
}

const PHASES: Phase[] = [
  { day: "7",  date: "7 Dhu Alhijah",  zone: "Mina",      zoneColor: "#dc2626", pilgrims: 28,  haram: 65, entrance: 55, label: "Initial Deployment" },
  { day: "8",  date: "8 Dhu Alhijah",  zone: "Mina",      zoneColor: "#dc2626", pilgrims: 62,  haram: 35, entrance: 30, label: "Mina Coverage" },
  { day: "9",  date: "9 Dhu Alhijah",  zone: "Arafat",    zoneColor: "#d97706", pilgrims: 100, haram: 0,  entrance: 0,  label: "Arafat Peak", peak: true },
  { day: "9★", date: "Night of 9",     zone: "Muzdalifa", zoneColor: "#3b82f6", pilgrims: 82,  haram: 0,  entrance: 0,  label: "Muzdalifa Night" },
  { day: "10", date: "10 Dhu Alhijah", zone: "Mina",      zoneColor: "#dc2626", pilgrims: 88,  haram: 45, entrance: 38, label: "Return Surge" },
  { day: "11", date: "11 Dhu Alhijah", zone: "Mina",      zoneColor: "#dc2626", pilgrims: 71,  haram: 30, entrance: 25, label: "Sustained Ops" },
  { day: "12", date: "12 Dhu Alhijah", zone: "Mina",      zoneColor: "#6b7280", pilgrims: 44,  haram: 52, entrance: 44, label: "Reduced Load" },
  { day: "13", date: "13 Dhu Alhijah", zone: "Wrap-Up",   zoneColor: "#4b5563", pilgrims: 18,  haram: 72, entrance: 65, label: "Final Phase" },
];

// How many vh the full 100% bar occupies in each zone
const TOP_VH  = 24; // Hajj zone bars grow upward   (max 24vh for 100%)
const HARAM_VH    = 11; // Makkah Haram bars grow downward
const ENTRANCE_VH = 11; // Makkah Entrance bars grow downward

export function DeploymentTimeline() {
  return (
    <div
      style={{
        height: "calc(100vh - 148px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "0 12px",
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px 6px", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
            Hajj 1447 — Team Deployment Timeline
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>
            Pilgrim zone availability % by day &middot; 7 – 13 Dhu Alhijah
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: "11px", color: "var(--muted-foreground)", alignItems: "center" }}>
          <LegendDot color="#dc2626" label="Mina" />
          <LegendDot color="#d97706" label="Arafat" />
          <LegendDot color="#3b82f6" label="Muzdalifa" />
          <LegendDot color="#a855f7" label="Makkah Haram" />
          <LegendDot color="#06b6d4" label="Makkah Entrance" />
        </div>
      </div>

      {/* ── Chart ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", gap: 0, minHeight: 0 }}>
        {PHASES.map((phase) => (
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

            {/* ── TOP SECTION: Hajj zone bar ── */}
            <div
              style={{
                flex: `0 0 ${TOP_VH}vh`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",  // bar grows from bottom (spine) upward
                alignItems: "center",
                width: "100%",
                paddingBottom: 0,
              }}
            >
              {/* % label */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: phase.zoneColor,
                  marginBottom: 3,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {phase.pilgrims}%
              </div>
              {/* Bar */}
              <div
                style={{
                  width: "56%",
                  maxWidth: 48,
                  height: `${(phase.pilgrims / 100) * TOP_VH}vh`,
                  minHeight: 4,
                  background: `linear-gradient(180deg, ${phase.zoneColor}cc 0%, ${phase.zoneColor}33 100%)`,
                  borderRadius: "4px 4px 0 0",
                  border: phase.peak ? `1px solid ${phase.zoneColor}` : `1px solid ${phase.zoneColor}44`,
                  boxShadow: phase.peak ? `0 0 14px ${phase.zoneColor}55` : undefined,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {phase.peak && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
                )}
              </div>
            </div>

            {/* ── SPINE ── */}
            <div
              style={{
                flexShrink: 0,
                height: "3vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Horizontal line across full width */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 1,
                  background: "rgba(255,255,255,0.15)",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Node dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: `2px solid ${phase.zoneColor}`,
                  background: phase.peak ? phase.zoneColor : "var(--background, #0a0414)",
                  boxShadow: phase.peak ? `0 0 8px ${phase.zoneColor}` : undefined,
                  position: "relative",
                  zIndex: 3,
                }}
              />
            </div>

            {/* ── BOTTOM SECTION: Makkah Haram + Entrance bars ── */}
            <div
              style={{
                flex: `0 0 ${HARAM_VH + ENTRANCE_VH + 3}vh`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                paddingTop: 0,
              }}
            >
              {/* Two side-by-side bars */}
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-start",
                  width: "72%",
                  maxWidth: 64,
                  marginBottom: 4,
                }}
              >
                {/* Makkah Haram bar */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${(phase.haram / 100) * HARAM_VH}vh`,
                      minHeight: 2,
                      background: "linear-gradient(180deg, #a855f7aa 0%, #a855f733 100%)",
                      borderRadius: "0 0 3px 3px",
                      border: "1px solid #a855f733",
                    }}
                  />
                  <span style={{ fontSize: "9px", color: "#a855f7", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {phase.haram}%
                  </span>
                </div>
                {/* Makkah Entrance bar */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${(phase.entrance / 100) * ENTRANCE_VH}vh`,
                      minHeight: 2,
                      background: "linear-gradient(180deg, #06b6d4aa 0%, #06b6d433 100%)",
                      borderRadius: "0 0 3px 3px",
                      border: "1px solid #06b6d433",
                    }}
                  />
                  <span style={{ fontSize: "9px", color: "#06b6d4", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {phase.entrance}%
                  </span>
                </div>
              </div>
            </div>

            {/* ── FOOTER: day labels ── */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                paddingBottom: 8,
                borderRight: "1px solid rgba(255,255,255,0.04)",
                width: "100%",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 900, color: phase.zoneColor, lineHeight: 1 }}>
                {phase.day}
              </span>
              <span style={{ fontSize: "9px", color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.3 }}>
                {phase.date}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: phase.zoneColor,
                  background: `${phase.zoneColor}18`,
                  border: `1px solid ${phase.zoneColor}30`,
                  borderRadius: 4,
                  padding: "1px 6px",
                  marginTop: 1,
                }}
              >
                {phase.zone}
              </span>
              <span style={{ fontSize: "9px", color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.2 }}>
                {phase.label}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* ── Bottom zone labels ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          paddingBottom: 6,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 5,
          fontSize: "10px",
          color: "var(--muted-foreground)",
        }}
      >
        <span style={{ color: "#a855f7" }}>▲ Makkah Haram density (left bar)</span>
        <span style={{ color: "#06b6d4" }}>▲ Makkah Entrance density (right bar)</span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 9, height: 9, borderRadius: 2, background: color, display: "inline-block", flexShrink: 0 }} />
      {label}
    </span>
  );
}
