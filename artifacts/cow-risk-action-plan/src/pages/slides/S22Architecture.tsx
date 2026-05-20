const V = "Verdana, sans-serif";
export default function S22Architecture() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          System · Architecture
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          How the 3 Apps Connect
        </div>
        <div style={{ fontSize: "1.5vw", color: "#374151", marginBottom: "3vh" }}>
          Shared backend API and PostgreSQL database — each app reads and writes through the same data layer.
        </div>
      </div>
      <div className="absolute top-[40vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", gap: "2vw", alignItems: "stretch" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5vh" }}>
            <div style={{ background: "linear-gradient(145deg,#4c1d95,#6b21c8)", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15" }}>Risk Dashboard</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.8)" }}>React + Vite · Web</div>
            </div>
            <div style={{ background: "linear-gradient(145deg,#0d6e6e,#0d9488)", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15" }}>Team Tracker</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.8)" }}>React Native · iOS + Android</div>
            </div>
            <div style={{ background: "linear-gradient(145deg,#9a1212,#dc2626)", borderRadius: "1vw", padding: "1.6vw", textAlign: "center" }}>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15" }}>Fault Management</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.8)" }}>Integrated in Dashboard</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5vh", padding: "0 1vw" }}>
            <div style={{ fontSize: "2.5vw", color: "#6b21c8", fontWeight: "bold", textAlign: "center" }}>↔</div>
            <div style={{ fontSize: "2.5vw", color: "#0d9488", fontWeight: "bold", textAlign: "center" }}>↔</div>
            <div style={{ fontSize: "2.5vw", color: "#dc2626", fontWeight: "bold", textAlign: "center" }}>↔</div>
          </div>
          <div style={{ flex: 2, background: "linear-gradient(145deg,#1a0a2e,#2d1464)", borderRadius: "1.2vw", padding: "2vw", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vh" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em" }}>Shared Backend</div>
            <div style={{ display: "flex", gap: "1.5vw" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#a78bfa", marginBottom: "0.5vh" }}>Express API</div>
                <div style={{ fontSize: "1.0vw", color: "rgba(255,255,255,0.6)" }}>REST endpoints for team, faults, locations, users</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#a78bfa", marginBottom: "0.5vh" }}>PostgreSQL</div>
                <div style={{ fontSize: "1.0vw", color: "rgba(255,255,255,0.6)" }}>Drizzle ORM — shared schema for all three apps</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5vw" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#a78bfa", marginBottom: "0.5vh" }}>Firebase FCM</div>
                <div style={{ fontSize: "1.0vw", color: "rgba(255,255,255,0.6)" }}>Push notifications to mobile app</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "0.8vw", padding: "1.2vw", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#a78bfa", marginBottom: "0.5vh" }}>Power BI</div>
                <div style={{ fontSize: "1.0vw", color: "rgba(255,255,255,0.6)" }}>stc workspace sync every 30 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
