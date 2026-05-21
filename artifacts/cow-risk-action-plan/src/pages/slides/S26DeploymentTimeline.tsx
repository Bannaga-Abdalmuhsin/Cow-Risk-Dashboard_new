const V = "Verdana, sans-serif";

const DAYS = [
  {
    num: "7",
    label: "7 Dhu Alhijah",
    sub: "Initial Deployment",
    zone: "Mina · MC Clusters",
    zoneColor: "#dc2626",
    focus: ["MC preparation & staging", "COW readiness verification", "GPS sync testing"],
    sites: [],
    note: "Reserve: Minhaj · Tasleem · Umair",
  },
  {
    num: "8",
    label: "8 Dhu Alhijah",
    sub: "Mina Coverage",
    zone: "Mina Priority",
    zoneColor: "#dc2626",
    focus: ["Crowd build-up & Jamarat prep", "Auto-assign majority to Mina COWs", "GPS tracking every 15 s"],
    sites: ["CWN026", "CWN053", "CWN008", "CWN021"],
    note: "",
  },
  {
    num: "9",
    label: "9 Dhu Alhijah",
    sub: "Arafat Peak",
    zone: "⚡ ARAFAT — PEAK",
    zoneColor: "#d97706",
    focus: ["Highest operational load", "Peak pilgrim density", "Priority dispatch: fault count × distance"],
    sites: ["CWN961", "CWN992", "CWN906", "CWN777"],
    note: "Reserve held in strategic standby",
  },
  {
    num: "9★",
    label: "Night of 9",
    sub: "Muzdalifa Migration",
    zone: "Muzdalifa — Night",
    zoneColor: "#3b82f6",
    focus: ["Pilgrim migration monitoring", "Overnight emergency readiness", "Auto reassign: Arafat → Muzdalifa"],
    sites: ["CWN213", "CWN996", "CWN953", "CWN074"],
    note: "Night dispatch mode · Battery alerts",
  },
  {
    num: "10",
    label: "10 Dhu Alhijah",
    sub: "Mina Return",
    zone: "Mina — Return Surge",
    zoneColor: "#dc2626",
    focus: ["Return crowd surge", "Jamarat heavy load", "Nearest available team first"],
    sites: ["CWN068", "CWN203", "CWN978", "CWN300"],
    note: "Fatigue balancing enabled",
  },
  {
    num: "11",
    label: "11 Dhu Alhijah",
    sub: "Sustained Mina",
    zone: "Mina — Sustained",
    zoneColor: "#dc2626",
    focus: ["Long-duration standby", "Dynamic fault response", "Smart team rotation"],
    sites: ["CWN959", "CWN214", "CWN984", "CWN066"],
    note: "Auto load redistribution",
  },
  {
    num: "12",
    label: "12 Dhu Alhijah",
    sub: "Reduced Load",
    zone: "Mina — Standby",
    zoneColor: "#6b7280",
    focus: ["Moderate pilgrim movement", "Reduced dispatch frequency", "Reserve teams protected"],
    sites: ["CWN020", "CWN004"],
    note: "",
  },
  {
    num: "13",
    label: "13 Dhu Alhijah",
    sub: "Final Phase",
    zone: "Wrap-Up",
    zoneColor: "#374151",
    focus: ["Controlled deactivation", "Archive movement history", "Export deployment analytics"],
    sites: [],
    note: "Close assignments · Generate ops report",
  },
];

export default function S26DeploymentTimeline() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0a0a14 0%,#0f1428 50%,#0a0a14 100%)", fontFamily: V }}
    >
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#dc2626" }} />
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[0.6vh]" style={{ background: "linear-gradient(90deg,#dc2626,#ef4444,#dc2626)" }} />

      {/* Header */}
      <div className="absolute top-[2.5vh] left-[3.5vw] right-[3.5vw] flex items-center justify-between">
        <div>
          <div style={{ fontSize: "0.95vw", fontWeight: "bold", color: "#dc2626", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4vh" }}>
            Operations · Hajj 1447
          </div>
          <div style={{ fontSize: "2.6vw", fontWeight: "bold", color: "#fff", lineHeight: 1.1 }}>
            Team Deployment{" "}
            <span style={{ color: "#dc2626" }}>Timeline</span>
          </div>
          <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.5)", marginTop: "0.4vh" }}>
            7 – 13 Dhu Alhijah · 7 Operational Phases · Auto-Dispatch Active
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#dc2626", letterSpacing: "0.15em" }}>stc</div>
          <div style={{ fontSize: "1.0vw", fontWeight: "bold", color: "rgba(255,255,255,0.7)" }}>ACES MSD</div>
        </div>
      </div>

      {/* Day cards grid — 4 × 2 */}
      <div
        className="absolute"
        style={{
          top: "16vh", left: "2.2vw", right: "2.2vw", bottom: "10vh",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "1.1vw",
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d.num}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderTop: `3px solid ${d.zoneColor}`,
              borderRadius: "0.8vw",
              padding: "1.2vw",
              display: "flex",
              flexDirection: "column",
              gap: "0.6vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Day number + zone badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "2.2vw", fontWeight: "900", color: d.zoneColor, lineHeight: 1 }}>{d.num}</div>
                <div style={{ fontSize: "0.75vw", color: "rgba(255,255,255,0.85)", fontWeight: "bold", marginTop: "0.2vh" }}>{d.label}</div>
                <div style={{ fontSize: "0.65vw", color: "rgba(255,255,255,0.45)", marginTop: "0.1vh" }}>{d.sub}</div>
              </div>
              <div
                style={{
                  background: d.zoneColor + "22",
                  border: `1px solid ${d.zoneColor}55`,
                  borderRadius: "0.4vw",
                  padding: "0.3vh 0.5vw",
                  fontSize: "0.6vw",
                  fontWeight: "bold",
                  color: d.zoneColor,
                  textAlign: "center",
                  maxWidth: "9vw",
                  lineHeight: 1.3,
                }}
              >
                {d.zone}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Focus bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35vh", flex: 1 }}>
              {d.focus.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4vw" }}>
                  <div style={{ width: "0.35vw", height: "0.35vw", borderRadius: "50%", background: d.zoneColor, marginTop: "0.5vh", flexShrink: 0 }} />
                  <div style={{ fontSize: "0.68vw", color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>{f}</div>
                </div>
              ))}
            </div>

            {/* COW site tags */}
            {d.sites.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3vw", marginTop: "0.4vh" }}>
                {d.sites.map((s) => (
                  <div
                    key={s}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.3vw",
                      padding: "0.15vh 0.4vw",
                      fontSize: "0.55vw",
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: "bold",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* Note */}
            {d.note && (
              <div style={{ fontSize: "0.6vw", color: d.zoneColor, fontStyle: "italic", marginTop: "0.2vh", opacity: 0.85 }}>
                {d.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom bar: Strategic Reserve + Dispatch formula */}
      <div
        className="absolute bottom-[1.8vh] left-[2.2vw] right-[2.2vw]"
        style={{ display: "flex", alignItems: "center", gap: "2vw" }}
      >
        {/* Strategic Reserve */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "1vw",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: "0.6vw",
            padding: "0.6vh 1.2vw",
            boxShadow: "0 0 12px rgba(59,130,246,0.15)",
          }}
        >
          <div style={{ fontSize: "0.7vw", fontWeight: "bold", color: "#93c5fd", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            🔵 Strategic Reserve — Never Auto-Dispatched
          </div>
          {["Minhaj", "Tasleem", "Umair"].map((name) => (
            <div
              key={name}
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.35)",
                borderRadius: "0.4vw",
                padding: "0.25vh 0.7vw",
                fontSize: "0.65vw",
                fontWeight: "bold",
                color: "#bfdbfe",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Dispatch formula */}
        <div
          style={{
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: "0.6vw",
            padding: "0.6vh 1.2vw",
            fontSize: "0.65vw",
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#fca5a5", fontWeight: "bold" }}>Priority Score = </span>
          <span>pilgrimDensity × 0.4 + activeFaults × 0.3 + siteCriticality × 0.2 + distanceFactor × 0.1</span>
        </div>

        {/* Footer label */}
        <div style={{ fontSize: "0.8vw", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
          stc · ACES MSD · Hajj 1447
        </div>
      </div>
    </div>
  );
}
