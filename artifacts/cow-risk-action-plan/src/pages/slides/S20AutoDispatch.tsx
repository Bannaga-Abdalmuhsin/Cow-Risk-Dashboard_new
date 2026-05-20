const V = "Verdana, sans-serif";
export default function S20AutoDispatch() {
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
          Fault Management · Dispatch
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#3b0000", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Nearest Tech.
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#dc2626", lineHeight: 1.1, marginBottom: "3vh" }}>
          Fastest Route.
        </div>
        <div style={{ fontSize: "1.4vw", color: "#374151", lineHeight: 1.7, marginBottom: "3vh" }}>
          Auto-Dispatch selects the closest available technician using live GPS positions. The road ETA is calculated via the Directions API — not a straight-line estimate.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "center", background: "white", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid #fecdd3" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Technician GPS coordinates polled from live location API</div>
          </div>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "center", background: "white", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid #fecdd3" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Nearest available technician auto-selected and notified</div>
          </div>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "center", background: "white", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid #fecdd3" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Real road route drawn on satellite map with dashed polyline</div>
          </div>
          <div style={{ display: "flex", gap: "1.2vw", alignItems: "center", background: "white", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid #fecdd3" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>ETA in minutes and distance in km displayed on the fault card</div>
          </div>
        </div>
      </div>
      <div className="absolute top-[8vh] right-[3vw]" style={{ left: "52vw", bottom: "8vh" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#3b0000,#7f1d1d)", borderRadius: "1.5vw", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3vw", gap: "3.5vh" }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em" }}>Dispatch Indicators</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "5vw", fontWeight: "bold", color: "#fca5a5" }}>8 sec</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.65)" }}>Fault list auto-refresh</div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "5vw", fontWeight: "bold", color: "#fca5a5" }}>Road</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.65)" }}>ETA via Directions API — not straight-line</div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "5vw", fontWeight: "bold", color: "#fca5a5" }}>Live</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.65)" }}>Route redraws as technician moves toward the site</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · Fault Management · Hajj 1447</div>
      </div>
    </div>
  );
}
