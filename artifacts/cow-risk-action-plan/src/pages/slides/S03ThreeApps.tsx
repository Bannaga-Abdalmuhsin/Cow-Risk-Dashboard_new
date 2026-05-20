const V = "Verdana, sans-serif";
export default function S03ThreeApps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          The Solution
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "1vh" }}>
          3 Integrated Applications.
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#6b21c8", lineHeight: 1.1, marginBottom: "4vh" }}>
          One Unified Operations Picture.
        </div>
      </div>
      <div className="absolute top-[40vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#4c1d95,#6b21c8)", boxShadow: "0 8px 32px rgba(107,33,200,0.35)" }}>
          <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>01</div>
          <div style={{ fontSize: "2.2vw", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5vh" }}>COW Risk Dashboard</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "2vh" }}>
            Real-time risk intelligence across all 79 Nokia COW sites — 9 scenarios, 4 risk categories, live heat map.
          </div>
          <div style={{ fontSize: "1.1vw", color: "#c4b5fd" }}>Web Application · Any Browser</div>
        </div>
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#0d6e6e,#0d9488)", boxShadow: "0 8px 32px rgba(13,148,136,0.35)" }}>
          <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>02</div>
          <div style={{ fontSize: "2.2vw", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5vh" }}>ACES Field Team Tracker</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "2vh" }}>
            Live GPS tracking of all field technicians from MC dispatch to site arrival — helmet icons, zone coverage, push alerts.
          </div>
          <div style={{ fontSize: "1.1vw", color: "#99f6e4" }}>iOS &amp; Android · React Native</div>
        </div>
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#9a1212,#dc2626)", boxShadow: "0 8px 32px rgba(220,38,38,0.35)" }}>
          <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>03</div>
          <div style={{ fontSize: "2.2vw", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5vh" }}>Fault Management</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "2vh" }}>
            Integrated fault card system with Power BI sync, auto-dispatch, road-route ETA, and full lifecycle tracking.
          </div>
          <div style={{ fontSize: "1.1vw", color: "#fca5a5" }}>Integrated in Dashboard · Power BI</div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
