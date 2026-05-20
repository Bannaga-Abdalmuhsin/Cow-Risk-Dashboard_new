const V = "Verdana, sans-serif";
export default function S05DashboardOverview() {
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
          Risk Dashboard · Overview
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          What It Monitors
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#6b21c8", lineHeight: 1.1, marginBottom: "3.5vh" }}>
          Every Site. Every Scenario. Live.
        </div>
      </div>
      <div className="absolute top-[42vh] left-[5vw] right-[5vw]">
        <div className="flex gap-[2vw]" style={{ marginBottom: "2.5vh" }}>
          <div className="flex-1 rounded-xl p-[1.6vw]" style={{ background: "#f5f3ff", border: "2px solid #c4b5fd" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "0.8vh" }}>79 Sites Monitored</div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563" }}>Full Nokia COW fleet across all Hajj deployment zones — each site calculated in real time</div>
          </div>
          <div className="flex-1 rounded-xl p-[1.6vw]" style={{ background: "#fff1f2", border: "2px solid #fecdd3" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.8vh" }}>9 Scenarios Per Site</div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563" }}>Prime Power, Backup Generator, Battery-Only modes — all 9 combinations modelled simultaneously</div>
          </div>
        </div>
        <div className="flex gap-[2vw]">
          <div className="flex-1 rounded-xl p-[1.6vw]" style={{ background: "#fffbeb", border: "2px solid #fde68a" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#d97706", marginBottom: "0.8vh" }}>4 Risk Categories</div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563" }}>Power Supply · Cooling System · Battery Backup · Rectifier Capacity — each classified Safe or Risk</div>
          </div>
          <div className="flex-1 rounded-xl p-[1.6vw]" style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#16a34a", marginBottom: "0.8vh" }}>Interactive Heat Map</div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563" }}>ESRI satellite tiles with live risk overlay — drill down from zone to individual site in seconds</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
