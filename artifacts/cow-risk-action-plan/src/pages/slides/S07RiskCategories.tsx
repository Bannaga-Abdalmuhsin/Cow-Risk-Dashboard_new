const V = "Verdana, sans-serif";
export default function S07RiskCategories() {
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
          Risk Dashboard · Risk Categories
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          4 Independent Risk Dimensions
        </div>
        <div style={{ fontSize: "1.5vw", color: "#4b5563", marginBottom: "4vh" }}>
          Each classified Safe or Risk per scenario — any single failure can cascade across the entire site.
        </div>
      </div>
      <div className="absolute top-[40vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#4c1d95,#6b21c8)", boxShadow: "0 8px 24px rgba(107,33,200,0.3)" }}>
          <div style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#facc15", marginBottom: "1vh" }}>Power</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            SEC grid vs generator capacity at full traffic load with 46°C derating factor applied
          </div>
        </div>
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#9a1212,#dc2626)", boxShadow: "0 8px 24px rgba(220,38,38,0.3)" }}>
          <div style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#facc15", marginBottom: "1vh" }}>Cooling</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            AC system capacity vs shelter heat load — COP 3.5, T3 derating 0.833 at extreme temperature
          </div>
        </div>
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#92400e,#d97706)", boxShadow: "0 8px 24px rgba(217,119,6,0.3)" }}>
          <div style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#facc15", marginBottom: "1vh" }}>Battery</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            Lead-acid DoD 50% / Lithium DoD 85% — endurance vs site load in full outage scenario S9
          </div>
        </div>
        <div className="flex-1 rounded-2xl p-[2vw]" style={{ background: "linear-gradient(145deg,#0d6e6e,#0d9488)", boxShadow: "0 8px 24px rgba(13,148,136,0.3)" }}>
          <div style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#facc15", marginBottom: "1vh" }}>Rectifier</div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            Net rectifier capacity vs telecom load — 50V DC system, derating applied per operating condition
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
