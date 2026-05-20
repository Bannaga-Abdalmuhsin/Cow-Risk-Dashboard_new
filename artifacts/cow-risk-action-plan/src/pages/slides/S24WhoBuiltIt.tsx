const V = "Verdana, sans-serif";
export default function S24WhoBuiltIt() {
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
          Designed and Implemented By
        </div>
        <div style={{ fontSize: "4.5vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          ACES MSD Division
        </div>
        <div style={{ fontSize: "4.5vw", fontWeight: "bold", color: "#6b21c8", lineHeight: 1.1, marginBottom: "4vh" }}>
          stc Saudi Telecom Company
        </div>
      </div>
      <div className="absolute top-[46vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div style={{ flex: 1, background: "linear-gradient(145deg,#f5f3ff,#ede9fe)", border: "2px solid #c4b5fd", borderRadius: "1.2vw", padding: "2vw" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "2vh" }}>COW Risk Dashboard</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Concept · Engineering model design
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Scenario simulation engine
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            React + Vite frontend
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Express API + PostgreSQL backend
          </div>
        </div>
        <div style={{ flex: 1, background: "linear-gradient(145deg,#f0fdf9,#ccfbf1)", border: "2px solid #99f6e4", borderRadius: "1.2vw", padding: "2vw" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#0d9488", marginBottom: "2vh" }}>ACES Field Team Tracker</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Native mobile app architecture
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            React Native + Expo
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            ESRI satellite map integration
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Firebase FCM push notifications
          </div>
        </div>
        <div style={{ flex: 1, background: "linear-gradient(145deg,#fff5f5,#fee2e2)", border: "2px solid #fecdd3", borderRadius: "1.2vw", padding: "2vw" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "2vh" }}>Fault Management</div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Power BI integration + sync
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Auto-dispatch algorithm
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Google Directions API routing
          </div>
          <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.8 }}>
            Full lifecycle audit trail
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
