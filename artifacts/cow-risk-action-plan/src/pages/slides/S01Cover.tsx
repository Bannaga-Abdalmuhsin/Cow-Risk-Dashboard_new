const V = "Verdana, sans-serif";
export default function S01Cover() {
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
          CONFIDENTIAL · C-LEVEL EXECUTIVE BRIEFING
        </div>
      </div>
      <div className="absolute top-[18vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2vh" }}>
          Hajj 1447 · Nokia COW Infrastructure
        </div>
        <div style={{ fontSize: "5.5vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1.05, marginBottom: "1.5vh" }}>
          Operations Intelligence
        </div>
        <div style={{ fontSize: "5.5vw", fontWeight: "bold", lineHeight: 1.05, marginBottom: "4vh" }}>
          <span style={{ color: "#facc15" }}>Digital Framework</span>
        </div>
        <div style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "60vw" }}>
          Risk Monitoring · Field Team Tracking · Fault Resolution
        </div>
        <div style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "60vw" }}>
          Three integrated applications delivering real-time situational awareness
        </div>
        <div style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "60vw" }}>
          across 79 Nokia COW sites during Hajj peak operations.
        </div>
      </div>
      <div className="absolute bottom-[6vh] left-[5vw] right-[5vw] flex items-end justify-between">
        <div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.45)" }}>Designed &amp; Implemented by ACES MSD · stc Saudi Telecom Company</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.2vw", color: "#facc15", fontWeight: "bold" }}>Hajj 1447</div>
          <div style={{ fontSize: "1.0vw", color: "rgba(255,255,255,0.4)" }}>Makkah · Mina · Muzdalifa · Arafat</div>
        </div>
      </div>
    </div>
  );
}
