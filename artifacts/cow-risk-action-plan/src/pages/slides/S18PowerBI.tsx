const V = "Verdana, sans-serif";
export default function S18PowerBI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#fff5f5 0%,#fee2e2 55%,#fecdd320 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#dc2626" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#dc2626,#ef4444,#dc2626)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#dc2626", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#dc2626" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw]" style={{ right: "50vw" }}>
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Fault Management · Integration
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#3b0000", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Power BI
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#dc2626", lineHeight: 1.1, marginBottom: "3vh" }}>
          Auto-Sync
        </div>
        <div style={{ fontSize: "1.4vw", color: "#374151", lineHeight: 1.7 }}>
          The system polls the stc Power BI workspace every 30 seconds — power faults and telecom SIR alarms are matched to COW sites and auto-created as fault cards. No manual entry required.
        </div>
      </div>
      <div className="absolute top-[8vh] right-[3vw]" style={{ left: "52vw", bottom: "8vh" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#3b0000,#7f1d1d)", borderRadius: "1.5vw", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3vw", gap: "3vh" }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1vh" }}>Sync Details</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2vh" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.75)" }}>Poll Interval</div>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#fca5a5" }}>30 sec</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2vh" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.75)" }}>Fault Sources</div>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#fca5a5" }}>Power + SIR</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2vh" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.75)" }}>Auto-Close</div>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#fca5a5" }}>On clear</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.75)" }}>Manual Sync</div>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#fca5a5" }}>One click</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · Fault Management · Hajj 1447</div>
      </div>
    </div>
  );
}
