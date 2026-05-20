const V = "Verdana, sans-serif";
export default function S15ZoneCoverage() {
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
          Team Tracker · Zone Operations
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0c3b3a", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          5 Zones. 16 Technicians.
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0d9488", lineHeight: 1.1, marginBottom: "3.5vh" }}>
          Full Hajj Coverage.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.6vw", border: "2px solid #f87171", boxShadow: "0 4px 16px rgba(248,113,113,0.12)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.8vh" }}>Arafat</div>
          <div style={{ fontSize: "1.15vw", color: "#374151", lineHeight: 1.6 }}>Highest concentration — peak pilgrimage zone with maximum network demand during Wuquf day</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.6vw", border: "2px solid #fde68a", boxShadow: "0 4px 16px rgba(253,230,138,0.2)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#d97706", marginBottom: "0.8vh" }}>Mina</div>
          <div style={{ fontSize: "1.15vw", color: "#374151", lineHeight: 1.6 }}>Jamarat corridor — extended stays, continuous coverage required across multi-day Hajj operations</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.6vw", border: "2px solid #a78bfa", boxShadow: "0 4px 16px rgba(167,139,250,0.15)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "0.8vh" }}>Muzdalifa</div>
          <div style={{ fontSize: "1.15vw", color: "#374151", lineHeight: 1.6 }}>Night gathering area — entire Hajj population converges here; short window, maximum traffic spike</div>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.6vw", border: "2px solid #6ee7b7", boxShadow: "0 4px 16px rgba(110,231,183,0.15)" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#0d9488", marginBottom: "0.8vh" }}>Makkah</div>
          <div style={{ fontSize: "1.15vw", color: "#374151", lineHeight: 1.6 }}>Central and Remote zones — Haram vicinity plus outer city — permanent high-priority coverage areas</div>
        </div>
      </div>
      <div className="absolute bottom-[5.5vh] left-[5vw] right-[5vw]" style={{ display: "flex", gap: "3vw" }}>
        <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: "0.8vw", padding: "0.8vh 1.5vw", textAlign: "center" }}>
          <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#0d9488" }}>16</div>
          <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>Technicians</div>
        </div>
        <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: "0.8vw", padding: "0.8vh 1.5vw", textAlign: "center" }}>
          <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#0d9488" }}>5</div>
          <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>Zones</div>
        </div>
        <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: "0.8vw", padding: "0.8vh 1.5vw", textAlign: "center" }}>
          <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#0d9488" }}>15 min</div>
          <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>Freshness Threshold</div>
        </div>
        <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: "0.8vw", padding: "0.8vh 1.5vw", textAlign: "center" }}>
          <div style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#0d9488" }}>10 s</div>
          <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>Dashboard Refresh</div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · ACES Field Team Tracker · Hajj 1447</div>
      </div>
    </div>
  );
}
