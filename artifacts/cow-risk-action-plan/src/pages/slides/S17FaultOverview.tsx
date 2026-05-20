const V = "Verdana, sans-serif";
export default function S17FaultOverview() {
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
          Fault Management · Overview
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#3b0000", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Every Fault. One Card.
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#dc2626", lineHeight: 1.1, marginBottom: "3.5vh" }}>
          Nothing Falls Through.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3", boxShadow: "0 4px 16px rgba(220,38,38,0.1)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "1vh" }}>Live Fault Cards</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Each active alarm becomes a card — COW ID, severity, alarm name, power source, backup time remaining, and current status</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3", boxShadow: "0 4px 16px rgba(220,38,38,0.1)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "1vh" }}>Satellite Map View</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>COW site markers colour-coded by severity — technician positions shown with road route polyline drawn in real time</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #fecdd3", boxShadow: "0 4px 16px rgba(220,38,38,0.1)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "1vh" }}>Status Counter Bar</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Active · Critical · En Route · Resolved counts update every 8 seconds — filter by status with one click</div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · Fault Management · Hajj 1447</div>
      </div>
    </div>
  );
}
