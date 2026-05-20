const V = "Verdana, sans-serif";
export default function S19FaultLifecycle() {
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
          Fault Management · Lifecycle
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#3b0000", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Full Audit Trail.
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#dc2626", lineHeight: 1.1, marginBottom: "4vh" }}>
          Six Status Stages.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", alignItems: "stretch", gap: "0.5vw" }}>
          <div style={{ flex: 1, background: "#fee2e2", border: "2px solid #fca5a5", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.8vh" }}>New Fault</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>Alarm received from Power BI or manual entry — timestamped and queued</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.8vw", color: "#dc2626", fontWeight: "bold", padding: "0 0.3vw" }}>→</div>
          <div style={{ flex: 1, background: "#fef3c7", border: "2px solid #fde68a", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#d97706", marginBottom: "0.8vh" }}>Assigned</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>Technician auto-dispatched — name and position recorded</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.8vw", color: "#dc2626", fontWeight: "bold", padding: "0 0.3vw" }}>→</div>
          <div style={{ flex: 1, background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#2563eb", marginBottom: "0.8vh" }}>En Route</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>GPS tracking active — road ETA and distance updated live</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.8vw", color: "#dc2626", fontWeight: "bold", padding: "0 0.3vw" }}>→</div>
          <div style={{ flex: 1, background: "#fdf4ff", border: "2px solid #e9d5ff", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#9333ea", marginBottom: "0.8vh" }}>On Site</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>Arrival confirmed — work in progress, site status monitored</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.8vw", color: "#dc2626", fontWeight: "bold", padding: "0 0.3vw" }}>→</div>
          <div style={{ flex: 1, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#16a34a", marginBottom: "0.8vh" }}>Resolved</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>Fault cleared — resolution timestamp saved for reporting</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.8vw", color: "#dc2626", fontWeight: "bold", padding: "0 0.3vw" }}>→</div>
          <div style={{ flex: 1, background: "#f9fafb", border: "2px solid #e5e7eb", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#6b7280", marginBottom: "0.8vh" }}>Closed</div>
            <div style={{ fontSize: "1.1vw", color: "#374151" }}>Full record archived — all events, timestamps, and route data preserved</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · Fault Management · Hajj 1447</div>
      </div>
    </div>
  );
}
