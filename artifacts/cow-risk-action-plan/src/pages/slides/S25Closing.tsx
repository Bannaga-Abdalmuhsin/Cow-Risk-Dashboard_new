const V = "Verdana, sans-serif";
export default function S25Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg,#1a0a2e 0%,#2d1464 45%,#4c1d95 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[1vw] h-full" style={{ background: "linear-gradient(180deg,#facc15,#f59e0b)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1vh]" style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#facc15)" }} />
      <div className="absolute top-0 right-0 w-[40vw] h-full opacity-5"
        style={{ background: "radial-gradient(circle at 80% 40%,#a78bfa,transparent 65%)" }} />
      <div className="absolute top-[4vh] left-[5vw] flex items-center gap-[2vw]">
        <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.3em", textTransform: "uppercase" }}>stc</div>
        <div style={{ width: "1px", height: "2.5vh", background: "rgba(255,255,255,0.3)" }} />
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#c4b5fd" }}>ACES MSD Division</div>
      </div>
      <div className="absolute top-[4vh] right-[5vw]">
        <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.4)", fontWeight: "bold", letterSpacing: "0.1em" }}>
          HAJJ 1447 · EXECUTIVE BRIEFING
        </div>
      </div>
      <div className="absolute top-[50%] left-[5vw] right-[5vw]" style={{ transform: "translateY(-60%)", textAlign: "center" }}>
        <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "3vh" }}>
          Summary
        </div>
        <div style={{ fontSize: "5vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1.1, marginBottom: "2vh" }}>
          3 Apps. 79 Sites.
        </div>
        <div style={{ fontSize: "5vw", fontWeight: "bold", color: "#a78bfa", lineHeight: 1.1, marginBottom: "5vh" }}>
          One Operational Picture.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "4vw", marginBottom: "6vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#c4b5fd" }}>Risk Dashboard</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.5)" }}>Real-time site intelligence</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "2vw" }}>|</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#99f6e4" }}>Team Tracker</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.5)" }}>Field operations visibility</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "2vw" }}>|</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#fca5a5" }}>Fault Management</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.5)" }}>End-to-end fault resolution</div>
          </div>
        </div>
        <div style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.1em" }}>
          Questions Welcome
        </div>
      </div>
      <div className="absolute bottom-[5vh] left-[5vw] right-[5vw] flex items-end justify-between">
        <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>Designed &amp; Implemented by ACES MSD · stc Saudi Telecom Company</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.2vw", color: "#facc15", fontWeight: "bold" }}>acesmsd.live</div>
        </div>
      </div>
    </div>
  );
}
