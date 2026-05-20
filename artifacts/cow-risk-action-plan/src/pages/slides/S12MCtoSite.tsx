const V = "Verdana, sans-serif";
export default function S12MCtoSite() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#f0fdf9 0%,#ccfbf1 55%,#99f6e420 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#0d9488" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#0d9488,#14b8a6,#0d9488)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#0d9488", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#0d9488" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Team Tracker · Operations Flow
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0c3b3a", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          From MC Dispatch to On-Site —
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0d9488", lineHeight: 1.1, marginBottom: "4vh" }}>
          Tracked Every Step.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #0d9488", textAlign: "center", boxShadow: "0 4px 16px rgba(13,148,136,0.15)" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>01</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "0.8vh" }}>Fault Alert</div>
            <div style={{ fontSize: "1.1vw", color: "#6b7280" }}>Alarm received from Power BI or direct entry — fault card created automatically</div>
          </div>
          <div style={{ fontSize: "2vw", color: "#0d9488", fontWeight: "bold" }}>→</div>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #0d9488", textAlign: "center", boxShadow: "0 4px 16px rgba(13,148,136,0.15)" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>02</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "0.8vh" }}>MC Dispatch</div>
            <div style={{ fontSize: "1.1vw", color: "#6b7280" }}>Operations center assigns nearest available technician — app push notification sent instantly</div>
          </div>
          <div style={{ fontSize: "2vw", color: "#0d9488", fontWeight: "bold" }}>→</div>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #0d9488", textAlign: "center", boxShadow: "0 4px 16px rgba(13,148,136,0.15)" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>03</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "0.8vh" }}>En Route</div>
            <div style={{ fontSize: "1.1vw", color: "#6b7280" }}>GPS location streams live to dashboard — road ETA calculated via Directions API</div>
          </div>
          <div style={{ fontSize: "2vw", color: "#0d9488", fontWeight: "bold" }}>→</div>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #0d9488", textAlign: "center", boxShadow: "0 4px 16px rgba(13,148,136,0.15)" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>04</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "0.8vh" }}>On Site</div>
            <div style={{ fontSize: "1.1vw", color: "#6b7280" }}>Technician confirms arrival — fault status updated, dashboard reflects new state in seconds</div>
          </div>
          <div style={{ fontSize: "2vw", color: "#0d9488", fontWeight: "bold" }}>→</div>
          <div style={{ flex: 1, background: "#f0fdf9", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #0d9488", textAlign: "center", boxShadow: "0 4px 16px rgba(13,148,136,0.15)" }}>
            <div style={{ fontSize: "1.6vw", fontWeight: "bold", color: "#16a34a", marginBottom: "1vh" }}>05</div>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "0.8vh" }}>Resolved</div>
            <div style={{ fontSize: "1.1vw", color: "#6b7280" }}>Fault closed, team released — all timestamps and route data preserved for audit</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · ACES Field Team Tracker · Hajj 1447</div>
      </div>
    </div>
  );
}
