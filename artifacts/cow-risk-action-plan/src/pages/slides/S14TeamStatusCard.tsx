const V = "Verdana, sans-serif";
export default function S14TeamStatusCard() {
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
          Team Tracker · Team Status Card
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0c3b3a", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          At-a-Glance Team Status
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0d9488", lineHeight: 1.1, marginBottom: "3.5vh" }}>
          Every Technician. One View.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw] flex gap-[3vw]">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#0c3b3a", marginBottom: "2vh" }}>
            Dashboard Teams Sidebar
          </div>
          <div style={{ display: "flex", gap: "1.5vw", flexWrap: "wrap" }}>
            <div style={{ width: "7vw", background: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.4)", borderRadius: "1vw", padding: "1vw 0.8vw", textAlign: "center" }}>
              <div style={{ width: "4vw", height: "4vw", background: "rgba(22,163,74,0.15)", border: "2px solid rgba(22,163,74,0.3)", borderRadius: "50%", margin: "0 auto 0.8vh" }} />
              <div style={{ fontSize: "1.0vw", fontWeight: "bold", color: "#e2e8f0" }}>Ahmed</div>
              <div style={{ fontSize: "0.9vw", color: "#16a34a", fontWeight: "bold" }}>3m</div>
              <div style={{ fontSize: "0.8vw", color: "#64748b" }}>Mina</div>
            </div>
            <div style={{ width: "7vw", background: "rgba(220,38,38,0.1)", border: "2px solid rgba(220,38,38,0.4)", borderRadius: "1vw", padding: "1vw 0.8vw", textAlign: "center" }}>
              <div style={{ width: "4vw", height: "4vw", background: "rgba(220,38,38,0.15)", border: "2px solid rgba(220,38,38,0.3)", borderRadius: "50%", margin: "0 auto 0.8vh" }} />
              <div style={{ fontSize: "1.0vw", fontWeight: "bold", color: "#e2e8f0" }}>Khalid</div>
              <div style={{ fontSize: "0.9vw", color: "#dc2626", fontWeight: "bold" }}>22m</div>
              <div style={{ fontSize: "0.8vw", color: "#64748b" }}>Arafat</div>
            </div>
            <div style={{ width: "7vw", background: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.4)", borderRadius: "1vw", padding: "1vw 0.8vw", textAlign: "center" }}>
              <div style={{ width: "4vw", height: "4vw", background: "rgba(22,163,74,0.15)", border: "2px solid rgba(22,163,74,0.3)", borderRadius: "50%", margin: "0 auto 0.8vh" }} />
              <div style={{ fontSize: "1.0vw", fontWeight: "bold", color: "#e2e8f0" }}>Faisal</div>
              <div style={{ fontSize: "0.9vw", color: "#16a34a", fontWeight: "bold" }}>7m</div>
              <div style={{ fontSize: "0.8vw", color: "#64748b" }}>Makkah</div>
            </div>
            <div style={{ width: "7vw", background: "rgba(220,38,38,0.1)", border: "2px solid rgba(220,38,38,0.4)", borderRadius: "1vw", padding: "1vw 0.8vw", textAlign: "center" }}>
              <div style={{ width: "4vw", height: "4vw", background: "rgba(220,38,38,0.15)", border: "2px solid rgba(220,38,38,0.3)", borderRadius: "50%", margin: "0 auto 0.8vh" }} />
              <div style={{ fontSize: "1.0vw", fontWeight: "bold", color: "#e2e8f0" }}>Omar</div>
              <div style={{ fontSize: "0.9vw", color: "#dc2626", fontWeight: "bold" }}>45m</div>
              <div style={{ fontSize: "0.8vw", color: "#64748b" }}>Muz</div>
            </div>
          </div>
          <div style={{ marginTop: "2.5vh", fontSize: "1.1vw", color: "#374151", lineHeight: 1.7 }}>
            Helmet icon grid — each card shows first name, minutes since last GPS update, and assigned zone. Green under 15 min. Red over 15 min.
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5vh" }}>
          <div style={{ background: "white", borderRadius: "1vw", padding: "1.6vw", border: "2px solid #99f6e4", boxShadow: "0 2px 12px rgba(13,148,136,0.1)" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0d9488", marginBottom: "0.8vh" }}>Summary Counts</div>
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Live Online vs Offline counter at the top — refreshes automatically every 30 seconds</div>
          </div>
          <div style={{ background: "white", borderRadius: "1vw", padding: "1.6vw", border: "2px solid #99f6e4", boxShadow: "0 2px 12px rgba(13,148,136,0.1)" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0d9488", marginBottom: "0.8vh" }}>Manager List</div>
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Managers displayed separately above the technician grid — with status indicators and area assignment</div>
          </div>
          <div style={{ background: "white", borderRadius: "1vw", padding: "1.6vw", border: "2px solid #99f6e4", boxShadow: "0 2px 12px rgba(13,148,136,0.1)" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#0d9488", marginBottom: "0.8vh" }}>Auto-Staleness</div>
            <div style={{ fontSize: "1.2vw", color: "#374151" }}>Cards flip red without any interaction — stale technicians identified in real time even when map is not open</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · ACES Field Team Tracker · Hajj 1447</div>
      </div>
    </div>
  );
}
