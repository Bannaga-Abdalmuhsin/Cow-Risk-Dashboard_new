const V = "Verdana, sans-serif";

export default function Slide03ScenarioS9() {
  const actions = [
    {
      num: "01",
      priority: "CRITICAL",
      title: "Upgrade Backup Generator Capacity — 3 SB Sites",
      detail: "CWN901 (Arafat) · CWN021 (Muzdalifah) · CWN089 (Muzdalifah) currently insufficient to cover S8 worst-case load. Capacity upgrade or load-shedding plan required before Hajj peak.",
      owner: "Network Engineering",
      color: "#dc2626", bg: "#fff1f2", border: "#fecdd3",
    },
    {
      num: "02",
      priority: "CRITICAL",
      title: "Add Redundancy for 24 Single-Generator Sites",
      detail: "All 24 SG/DG sites have no backup power source. A generator failure = immediate site blackout. Deploy mobile generators or UPS bridging at all SG/DG locations ahead of peak days.",
      owner: "Operations & Field Teams",
      color: "#dc2626", bg: "#fff1f2", border: "#fecdd3",
    },
    {
      num: "03",
      priority: "HIGH",
      title: "Pre-Position 16 Technicians Across 4 Zones",
      detail: "Assign field engineers to Arafat, Mina, Muzdalifah and Makkah zones. Target ≤15 min ETA to any at-risk site. Confirm transport and contact protocols before pilgrim arrival.",
      owner: "Field Operations Manager",
      color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    },
    {
      num: "04",
      priority: "HIGH",
      title: "Activate Real-Time Dashboard Monitoring — Hajj 1447",
      detail: "Enable continuous scenario tracking from Day 1 through Day 13. Set automated alerts for any site crossing from SAFE to AT RISK. Escalation chain to be confirmed with NOC and management.",
      owner: "NOC / ACES MSD",
      color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    },
  ];

  const priColor = (p: string) => p === "CRITICAL"
    ? { bg: "#dc2626", color: "white" }
    : { bg: "#d97706", color: "white" };

  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>

      <div className="absolute top-0 left-0 w-[0.7vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />

      <div className="absolute top-[2.5vh] right-[3vw] flex items-center gap-[1.5vw]">
        <div style={{ fontFamily: V, fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em", textTransform: "uppercase" }}>stc</div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[2.5vh] left-[4vw]">
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9333ea" }}>
          Hajj 1447 · Management Action Plan
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5vh" }}>
          Recommendations
        </div>
        <div style={{ fontFamily: V, fontSize: "2.6vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.3vh" }}>
          4 Actions Required Before Hajj Peak
        </div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#6b21c8" }}>
          Priority actions identified from the 9-scenario risk assessment · Immediate decisions required from management
        </div>
      </div>

      <div className="absolute top-[21vh] left-[4vw] right-[3vw] flex flex-col gap-[1.2vh]">
        {actions.map(({ num, priority, title, detail, owner, color, bg, border }) => {
          const pc = priColor(priority);
          return (
            <div key={num} className="rounded-xl overflow-hidden flex"
              style={{ background: "white", border: `1.5px solid ${border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-center"
                style={{ width: "4.5vw", background: bg, flexShrink: 0 }}>
                <div style={{ fontFamily: V, fontSize: "1.8vw", fontWeight: "bold", color, opacity: 0.6 }}>{num}</div>
              </div>
              <div className="flex-1 px-[1.4vw] py-[0.9vh]">
                <div className="flex items-center gap-[1vw] mb-[0.3vh]">
                  <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#1a0a2e" }}>{title}</div>
                  <span className="rounded px-[0.6vw] py-[0.1vh]" style={{ fontFamily: V, fontSize: "0.95vw", fontWeight: "bold", background: pc.bg, color: pc.color, flexShrink: 0 }}>
                    {priority}
                  </span>
                </div>
                <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#4b5563", lineHeight: 1.5 }}>{detail}</div>
              </div>
              <div className="flex items-center px-[1.2vw]" style={{ flexShrink: 0, borderLeft: `1px solid ${border}` }}>
                <div className="text-center">
                  <div style={{ fontFamily: V, fontSize: "0.9vw", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Owner</div>
                  <div style={{ fontFamily: V, fontSize: "1.0vw", fontWeight: "bold", color, maxWidth: "10vw", textAlign: "center" }}>{owner}</div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="rounded-xl px-[1.5vw] py-[1vh] flex items-center gap-[1.5vw] mt-[0.5vh]"
          style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
          <div style={{ fontSize: "1.4vw", flexShrink: 0 }}>✅</div>
          <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#e9d5ff" }}>
            <strong style={{ color: "white" }}>Overall Status:</strong> Dashboard is live and monitoring all 79 sites.
            With the above actions completed, full fleet risk can be reduced from 27 at-risk sites to zero before Hajj 1447 peak.
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
      </div>
    </div>
  );
}
