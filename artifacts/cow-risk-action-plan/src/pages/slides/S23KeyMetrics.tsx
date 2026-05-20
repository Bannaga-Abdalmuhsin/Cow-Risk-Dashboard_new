const V = "Verdana, sans-serif";
export default function S23KeyMetrics() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg,#1a0a2e 0%,#2d1464 50%,#4c1d95 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#facc15" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#facc15)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#c4b5fd" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Key Metrics
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          What the Numbers Say
        </div>
      </div>
      <div className="absolute top-[36vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", gap: "2vw", marginBottom: "2.5vh" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "1.2vw", padding: "2vw", border: "1px solid rgba(250,204,21,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#facc15", lineHeight: 1 }}>79</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "rgba(255,255,255,0.85)", marginTop: "1vh" }}>Nokia COW Sites</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.5)", marginTop: "0.5vh" }}>Fully monitored in real time</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "1.2vw", padding: "2vw", border: "1px solid rgba(250,204,21,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#facc15", lineHeight: 1 }}>711</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "rgba(255,255,255,0.85)", marginTop: "1vh" }}>Risk Calculations</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.5)", marginTop: "0.5vh" }}>79 sites × 9 scenarios each</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "1.2vw", padding: "2vw", border: "1px solid rgba(250,204,21,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#facc15", lineHeight: 1 }}>16</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "rgba(255,255,255,0.85)", marginTop: "1vh" }}>Field Technicians</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.5)", marginTop: "0.5vh" }}>GPS-tracked across 5 zones</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "1.2vw", padding: "2vw", border: "1px solid rgba(250,204,21,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#facc15", lineHeight: 1 }}>3</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "rgba(255,255,255,0.85)", marginTop: "1vh" }}>Integrated Apps</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.5)", marginTop: "0.5vh" }}>Built and deployed by ACES MSD</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2vw" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "1vw", padding: "1.5vw", border: "1px solid rgba(167,139,250,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5vw", fontWeight: "bold", color: "#a78bfa" }}>8 sec</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)", marginTop: "0.5vh" }}>Fault refresh interval</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "1vw", padding: "1.5vw", border: "1px solid rgba(167,139,250,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5vw", fontWeight: "bold", color: "#a78bfa" }}>10 sec</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)", marginTop: "0.5vh" }}>Team location refresh</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "1vw", padding: "1.5vw", border: "1px solid rgba(167,139,250,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5vw", fontWeight: "bold", color: "#a78bfa" }}>30 sec</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)", marginTop: "0.5vh" }}>Power BI sync interval</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "1vw", padding: "1.5vw", border: "1px solid rgba(167,139,250,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5vw", fontWeight: "bold", color: "#a78bfa" }}>46°C</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)", marginTop: "0.5vh" }}>Extreme design temperature</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.3)" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
