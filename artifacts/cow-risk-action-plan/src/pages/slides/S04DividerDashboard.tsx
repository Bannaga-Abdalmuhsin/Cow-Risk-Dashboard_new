const V = "Verdana, sans-serif";
export default function S04DividerDashboard() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg,#1a0a2e 0%,#2d1464 50%,#4c1d95 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[1vw] h-full" style={{ background: "#facc15" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1vh]" style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#facc15)" }} />
      <div className="absolute top-[4vh] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>stc · ACES MSD</div>
      </div>
      <div className="absolute top-[50%] left-[5vw]" style={{ transform: "translateY(-50%)" }}>
        <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "2vh" }}>
          Application 01 of 03
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1, marginBottom: "2vh" }}>
          COW Risk
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#a78bfa", lineHeight: 1, marginBottom: "4vh" }}>
          Dashboard
        </div>
        <div style={{ fontSize: "1.8vw", color: "rgba(255,255,255,0.6)", maxWidth: "55vw" }}>
          Real-time risk intelligence across all 79 Nokia COW sites under extreme Hajj operating conditions.
        </div>
      </div>
    </div>
  );
}
