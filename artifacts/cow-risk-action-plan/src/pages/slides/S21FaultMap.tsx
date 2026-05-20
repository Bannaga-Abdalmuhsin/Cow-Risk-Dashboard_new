const V = "Verdana, sans-serif";
export default function S21FaultMap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#fff5f5 0%,#fee2e2 55%,#fecdd320 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#dc2626" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#dc2626,#ef4444,#dc2626)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#dc2626", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#dc2626" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Fault Management · Map View
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#3b0000", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Fault + Team. One Satellite View.
        </div>
        <div style={{ fontSize: "1.5vw", color: "#4b5563", marginBottom: "3.5vh" }}>
          Google Satellite map centered on Makkah — every active fault and dispatched technician visible simultaneously.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "1vh" }}>
            <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "4px", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#dc2626" }}>COW Site Markers</div>
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Colour-coded by severity — Critical glows red, Major amber, Minor blue. Pulsing animation on critical sites. Click to select and see full fault details.</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "1vh" }}>
            <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#1e3a8a", border: "2px solid #60a5fa", flexShrink: 0 }} />
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#1e3a8a" }}>Technician Markers</div>
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Dispatched technician shown at their current GPS position — name, ETA, and distance displayed. Marker updates as they move toward the fault site.</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "1vh" }}>
            <div style={{ width: "1.5vw", height: "0.4vw", background: "#38bdf8", borderRadius: "2px", flexShrink: 0 }} />
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0284c7" }}>Road Route Polyline</div>
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Actual road route drawn from technician to fault site — dashed blue line when real Directions API route is available, solid line as fallback.</div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · Fault Management · Hajj 1447</div>
      </div>
    </div>
  );
}
