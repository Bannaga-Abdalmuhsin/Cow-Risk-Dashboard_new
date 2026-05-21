import { CalendarDays, MapPin, Users, Zap, Shield, Navigation } from "lucide-react";

interface Phase {
  num: string;
  date: string;
  sub: string;
  zone: string;
  zoneColor: string;
  zoneBg: string;
  focus: string[];
  sites: string[];
  note?: string;
  teams?: string[];
  highlight?: boolean;
}

const PHASES: Phase[] = [
  {
    num: "7",
    date: "7 Dhu Alhijah",
    sub: "Initial Deployment",
    zone: "Mina · MC Clusters",
    zoneColor: "#dc2626",
    zoneBg: "rgba(220,38,38,0.10)",
    focus: [
      "MC preparation & initial staging",
      "COW readiness verification",
      "GPS sync testing",
      "Route planning activation",
    ],
    sites: [],
    teams: ["Younis", "Arif", "Mohammed Emad", "Faroq", "Akhttar", "Abid", "Nasser"],
    note: "Strategic Reserve on standby: Minhaj · Tasleem · Umair",
  },
  {
    num: "8",
    date: "8 Dhu Alhijah",
    sub: "Mina Coverage",
    zone: "Mina Priority",
    zoneColor: "#dc2626",
    zoneBg: "rgba(220,38,38,0.10)",
    focus: [
      "Crowd build-up & Jamarat preparation",
      "Auto-assign majority to Mina COWs",
      "GPS tracking every 15 seconds",
      "Push MC assignment to mobile app",
    ],
    sites: ["CWN026", "CWN053", "CWN008", "CWN021", "CWN212", "CWN201"],
    note: "Closest team handles fault · Minimum reserve maintained",
  },
  {
    num: "9",
    date: "9 Dhu Alhijah",
    sub: "Arafat Peak Operations",
    zone: "⚡ ARAFAT — PEAK LOAD",
    zoneColor: "#d97706",
    zoneBg: "rgba(217,119,6,0.10)",
    focus: [
      "Highest operational load of entire Hajj",
      "Peak pilgrim density — maximum fault readiness",
      "Priority dispatch: fault count × distance × criticality",
      "Reserve held in strategic standby mode",
    ],
    sites: ["CWN961", "CWN992", "CWN906", "CWN777", "CWN997", "CWN073", "CWN994"],
    note: "Reserve teams Minhaj · Tasleem · Umair held in standby",
    highlight: true,
  },
  {
    num: "9★",
    date: "Night of 9",
    sub: "Muzdalifa Migration",
    zone: "Muzdalifa — Night",
    zoneColor: "#3b82f6",
    zoneBg: "rgba(59,130,246,0.10)",
    focus: [
      "Pilgrim migration monitoring",
      "Overnight emergency readiness",
      "Auto-reassign: Arafat → Muzdalifa",
      "Battery monitoring alerts active",
    ],
    sites: ["CWN213", "CWN996", "CWN953", "CWN074", "CWN923", "CWN976"],
    note: "Night dispatch mode · Auto route generation",
  },
  {
    num: "10",
    date: "10 Dhu Alhijah",
    sub: "Mina Return",
    zone: "Mina — Return Surge",
    zoneColor: "#dc2626",
    zoneBg: "rgba(220,38,38,0.10)",
    focus: [
      "Return crowd surge — Jamarat heavy load",
      "Nearest available team dispatched first",
      "Minimum Mina coverage maintained",
      "Fatigue balancing enabled",
    ],
    sites: ["CWN068", "CWN203", "CWN978", "CWN300", "CWN105"],
  },
  {
    num: "11",
    date: "11 Dhu Alhijah",
    sub: "Sustained Mina",
    zone: "Mina — Sustained Ops",
    zoneColor: "#dc2626",
    zoneBg: "rgba(220,38,38,0.10)",
    focus: [
      "Long-duration standby operations",
      "Dynamic fault response",
      "Smart team rotation — reduce fatigue",
      "Auto load redistribution",
    ],
    sites: ["CWN959", "CWN214", "CWN984", "CWN066"],
  },
  {
    num: "12",
    date: "12 Dhu Alhijah",
    sub: "Reduced Load",
    zone: "Mina — Standby",
    zoneColor: "#6b7280",
    zoneBg: "rgba(107,114,128,0.08)",
    focus: [
      "Moderate pilgrim movement",
      "Reduced dispatch frequency",
      "Reserve teams protected from deployment",
    ],
    sites: ["CWN020", "CWN004"],
    note: "Maintain rapid response capability",
  },
  {
    num: "13",
    date: "13 Dhu Alhijah",
    sub: "Final Phase",
    zone: "Wrap-Up",
    zoneColor: "#4b5563",
    zoneBg: "rgba(75,85,99,0.08)",
    focus: [
      "Controlled deactivation sequence",
      "Archive movement history",
      "Generate operational analytics",
      "Export deployment logs",
    ],
    sites: [],
    note: "Close completed assignments · Final ops report",
  },
];

const RESERVE_TEAMS = ["Minhaj", "Tasleem", "Umair"];

export function DeploymentTimeline() {
  return (
    <div className="space-y-4">

      {/* Header card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)" }}>
              <CalendarDays size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Hajj Team Deployment Timeline</h2>
              <p className="text-xs text-muted-foreground">7 – 13 Dhu Alhijah · 8 Operational Phases · Auto-Dispatch Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171" }}>
              <MapPin size={11} /> Mina
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(217,119,6,0.10)", border: "1px solid rgba(217,119,6,0.25)", color: "#fbbf24" }}>
              <Zap size={11} /> Arafat
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}>
              <Navigation size={11} /> Muzdalifa
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Reserve banner */}
      <div className="rounded-xl p-4 flex items-center gap-4 flex-wrap" style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.30)", boxShadow: "0 0 16px rgba(59,130,246,0.08)" }}>
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Strategic Reserve — Never Auto-Dispatched</span>
        </div>
        <div className="flex items-center gap-2">
          {RESERVE_TEAMS.map(name => (
            <span key={name} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)", color: "#93c5fd" }}>
              {name}
            </span>
          ))}
        </div>
        <div className="ml-auto text-xs text-blue-400/70 hidden md:block">
          Manual dispatch only · Override required
        </div>
      </div>

      {/* Phase grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {PHASES.map(phase => (
          <div
            key={phase.num}
            className="bg-card rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
            style={{
              border: phase.highlight
                ? `1px solid ${phase.zoneColor}55`
                : "1px solid var(--card-border, rgba(255,255,255,0.08))",
              borderTop: `3px solid ${phase.zoneColor}`,
              boxShadow: phase.highlight ? `0 0 20px ${phase.zoneColor}18` : undefined,
            }}
          >
            {/* Day number + zone */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-black leading-none mb-0.5" style={{ fontSize: "2rem", color: phase.zoneColor }}>
                  {phase.num}
                </div>
                <div className="text-xs font-bold text-foreground">{phase.date}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{phase.sub}</div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold leading-tight text-center" style={{ background: phase.zoneBg, border: `1px solid ${phase.zoneColor}44`, color: phase.zoneColor, maxWidth: "9rem" }}>
                  {phase.zone}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Focus bullets */}
            <ul className="space-y-1.5 flex-1">
              {phase.focus.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-snug">
                  <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: phase.zoneColor }} />
                  {f}
                </li>
              ))}
            </ul>

            {/* COW site tags */}
            {phase.sites.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {phase.sites.map(s => (
                  <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "var(--muted-foreground)" }}>
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Team list (day 7 only) */}
            {phase.teams && phase.teams.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Users size={10} className="text-muted-foreground shrink-0" />
                {phase.teams.map(t => (
                  <span key={t} className="text-[10px] text-muted-foreground">{t}</span>
                ))}
              </div>
            )}

            {/* Note */}
            {phase.note && (
              <div className="text-[10px] leading-snug italic" style={{ color: phase.zoneColor, opacity: 0.85 }}>
                {phase.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auto-dispatch formula card */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-red-500" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Auto-Dispatch Priority Engine</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2">Priority Score Formula</div>
            <div className="rounded-lg p-3 font-mono text-xs" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)" }}>
              <span className="text-red-400 font-bold">priorityScore</span>
              <span className="text-muted-foreground"> = (</span>
              <br />
              <span className="text-muted-foreground ml-4">pilgrimDensity</span>
              <span className="text-foreground"> × </span>
              <span className="text-amber-400">0.4</span>
              <span className="text-muted-foreground"> +</span>
              <br />
              <span className="text-muted-foreground ml-4">activeFaults</span>
              <span className="text-foreground"> × </span>
              <span className="text-amber-400">0.3</span>
              <span className="text-muted-foreground"> +</span>
              <br />
              <span className="text-muted-foreground ml-4">siteCriticality</span>
              <span className="text-foreground"> × </span>
              <span className="text-amber-400">0.2</span>
              <span className="text-muted-foreground"> +</span>
              <br />
              <span className="text-muted-foreground ml-4">distanceFactor</span>
              <span className="text-foreground"> × </span>
              <span className="text-amber-400">0.1</span>
              <br />
              <span className="text-muted-foreground">)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground mb-2">Mobile App Automation Flow</div>
            {[
              { step: "1", label: "Assignment triggered", detail: "Push notification sent to technician" },
              { step: "2", label: "MC auto-assigned", detail: "Route generated via Directions API" },
              { step: "3", label: "Status → MOVING", detail: "Live GPS tracking activated" },
              { step: "4", label: "Arrival detected", detail: "Auto check-in · Status → ON SITE" },
            ].map(row => (
              <div key={row.step} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white" style={{ background: "#dc2626" }}>
                  {row.step}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-foreground">{row.label}</span>
                  <span className="text-[11px] text-muted-foreground"> — {row.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
