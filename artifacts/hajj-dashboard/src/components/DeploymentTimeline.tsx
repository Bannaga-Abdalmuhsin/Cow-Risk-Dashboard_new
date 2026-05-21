interface Phase {
  day: string;
  date: string;
  zone: string;
  zoneColor: string;
  pilgrims: number;
  teams: number;
  label: string;
  peak?: boolean;
}

const PHASES: Phase[] = [
  { day: "7",   date: "7 Dhu Alhijah",  zone: "Mina",      zoneColor: "#dc2626", pilgrims: 28,  teams: 4,  label: "Initial Deployment" },
  { day: "8",   date: "8 Dhu Alhijah",  zone: "Mina",      zoneColor: "#dc2626", pilgrims: 62,  teams: 7,  label: "Mina Coverage" },
  { day: "9",   date: "9 Dhu Alhijah",  zone: "Arafat",    zoneColor: "#d97706", pilgrims: 100, teams: 10, label: "Arafat Peak", peak: true },
  { day: "9★",  date: "Night of 9",     zone: "Muzdalifa", zoneColor: "#3b82f6", pilgrims: 82,  teams: 8,  label: "Muzdalifa Night" },
  { day: "10",  date: "10 Dhu Alhijah", zone: "Mina",      zoneColor: "#dc2626", pilgrims: 88,  teams: 9,  label: "Return Surge" },
  { day: "11",  date: "11 Dhu Alhijah", zone: "Mina",      zoneColor: "#dc2626", pilgrims: 71,  teams: 7,  label: "Sustained Ops" },
  { day: "12",  date: "12 Dhu Alhijah", zone: "Mina",      zoneColor: "#6b7280", pilgrims: 44,  teams: 5,  label: "Reduced Load" },
  { day: "13",  date: "13 Dhu Alhijah", zone: "Wrap-Up",   zoneColor: "#4b5563", pilgrims: 18,  teams: 3,  label: "Final Phase" },
];

const MAX_BAR = 54; // vh units for the tallest bar (100%)

export function DeploymentTimeline() {
  const barHeight = (pct: number) => `${(pct / 100) * MAX_BAR}vh`;

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 148px)", overflow: "hidden", userSelect: "none" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            Hajj 1447 — Team Deployment Timeline
          </h2>
          <p className="text-[11px] text-muted-foreground">
            7 – 13 Dhu Alhijah · Pilgrim availability % drives team dispatch
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#dc2626" }} />
            Mina
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#d97706" }} />
            Arafat
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#3b82f6" }} />
            Muzdalifa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#4b5563" }} />
            Wind-down
          </span>
        </div>
      </div>

      {/* ── Chart area ── */}
      <div className="flex-1 flex items-end px-4 pb-0 gap-0 min-h-0">
        {PHASES.map((phase, i) => (
          <div
            key={phase.day}
            className="flex-1 flex flex-col items-center justify-end"
            style={{ position: "relative" }}
          >
            {/* Connecting line between nodes (not after last) */}
            {i < PHASES.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(1.1rem + 1px)",
                  left: "50%",
                  width: "100%",
                  height: "2px",
                  background: "rgba(255,255,255,0.07)",
                  zIndex: 0,
                }}
              />
            )}

            {/* Pilgrim % label above bar */}
            <div
              className="text-xs font-black mb-1 tabular-nums"
              style={{ color: phase.zoneColor, opacity: phase.pilgrims > 0 ? 1 : 0.3 }}
            >
              {phase.pilgrims}%
            </div>

            {/* Bar */}
            <div
              className="w-full max-w-[52px] rounded-t-md relative overflow-hidden transition-all"
              style={{
                height: barHeight(phase.pilgrims),
                background: `linear-gradient(180deg, ${phase.zoneColor}cc 0%, ${phase.zoneColor}44 100%)`,
                border: phase.peak
                  ? `1px solid ${phase.zoneColor}`
                  : `1px solid ${phase.zoneColor}55`,
                boxShadow: phase.peak
                  ? `0 0 18px ${phase.zoneColor}55, 0 0 6px ${phase.zoneColor}33`
                  : undefined,
                minHeight: "4px",
              }}
            >
              {/* Subtle shimmer for peak */}
              {phase.peak && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 60%)",
                  }}
                />
              )}
            </div>

            {/* Timeline node + spine */}
            <div
              className="w-full relative flex items-center justify-center"
              style={{ height: "1.1rem", zIndex: 1 }}
            >
              {/* Horizontal spine */}
              <div
                className="absolute inset-y-1/2 left-0 right-0 h-px"
                style={{ background: "rgba(255,255,255,0.12)", transform: "translateY(-50%)" }}
              />
              {/* Node dot */}
              <div
                className="relative w-3 h-3 rounded-full border-2 z-10"
                style={{
                  borderColor: phase.zoneColor,
                  background: phase.peak ? phase.zoneColor : "var(--background, #0a0414)",
                  boxShadow: phase.peak ? `0 0 8px ${phase.zoneColor}` : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom labels ── */}
      <div
        className="flex items-stretch px-4 shrink-0"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {PHASES.map((phase) => (
          <div
            key={phase.day}
            className="flex-1 flex flex-col items-center justify-start gap-0.5 py-2.5 px-1"
            style={{
              borderRight: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Day number */}
            <span
              className="font-black text-base leading-none tabular-nums"
              style={{ color: phase.zoneColor }}
            >
              {phase.day}
            </span>
            {/* Date */}
            <span className="text-[9px] text-muted-foreground text-center leading-tight">
              {phase.date}
            </span>
            {/* Zone badge */}
            <span
              className="text-[9px] font-bold rounded px-1.5 py-0.5 mt-0.5 text-center"
              style={{
                color: phase.zoneColor,
                background: `${phase.zoneColor}18`,
                border: `1px solid ${phase.zoneColor}30`,
              }}
            >
              {phase.zone}
            </span>
            {/* Phase label */}
            <span className="text-[9px] text-muted-foreground text-center leading-tight mt-0.5">
              {phase.label}
            </span>
            {/* Teams deployed */}
            <span className="text-[9px] font-semibold text-center mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {phase.teams} teams
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
