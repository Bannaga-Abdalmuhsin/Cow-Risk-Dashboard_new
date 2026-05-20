const V = "Verdana, sans-serif";
export default function S10DividerTeamTracker() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg,#0c3b3a 0%,#0d6e6e 50%,#0d9488 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[1vw] h-full" style={{ background: "#facc15" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1vh]" style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#facc15)" }} />
      <div className="absolute top-[4vh] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>stc · ACES MSD</div>
      </div>
      <div className="absolute top-[50%] left-[5vw]" style={{ transform: "translateY(-50%)" }}>
        <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#facc15", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "2vh" }}>
          Application 02 of 03
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#ffffff", lineHeight: 1, marginBottom: "2vh" }}>
          ACES Field
        </div>
        <div style={{ fontSize: "7vw", fontWeight: "bold", color: "#99f6e4", lineHeight: 1, marginBottom: "4vh" }}>
          Team Tracker
        </div>
        <div style={{ fontSize: "1.8vw", color: "rgba(255,255,255,0.6)", maxWidth: "55vw" }}>
          Native mobile application tracking every technician from MC dispatch to on-site arrival — live GPS, zone coverage, push alerts.
        </div>
      </div>
    </div>
  );
}
