const V = "Verdana, sans-serif";
export default function S16DividerFaultMgmt() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg,#3b0000 0%,#7f1d1d 50%,#dc2626 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[1vw] h-full" style={{ background: "#facc15" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1vh]" style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#facc15)" }} />
      <div className="absolute top-[4vh] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>stc · ACES MSD</div>
      </div>
      <div className="absolute top-[50%] left-[5vw]" style={{ transform: "translateY(-50%)" }}>
        <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "2vh" }}>
          Application 03 of 03
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1, marginBottom: "2vh" }}>
          Fault
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#fca5a5", lineHeight: 1, marginBottom: "4vh" }}>
          Management
        </div>
        <div style={{ fontSize: "1.8vw", color: "rgba(255,255,255,0.6)", maxWidth: "55vw" }}>
          Card-based fault tracking with Power BI auto-sync, nearest-technician dispatch, road-route ETA, and full lifecycle audit trail.
        </div>
      </div>
    </div>
  );
}
