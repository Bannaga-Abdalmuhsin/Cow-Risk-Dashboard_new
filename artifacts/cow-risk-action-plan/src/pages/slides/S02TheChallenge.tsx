const V = "Verdana, sans-serif";
export default function S02TheChallenge() {
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
          The Challenge
        </div>
        <div style={{ fontSize: "4.2vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.5vh" }}>
          79 Sites. One Mission.
        </div>
        <div style={{ fontSize: "4.2vw", fontWeight: "bold", color: "#6b21c8", lineHeight: 1.1, marginBottom: "3vh" }}>
          Zero Tolerance for Failure.
        </div>
        <div style={{ fontSize: "1.5vw", color: "#374151", lineHeight: 1.7, maxWidth: "58vw", marginBottom: "4vh" }}>
          Nokia COW sites across Makkah zones must maintain uninterrupted coverage
          for millions of pilgrims at 46°C. Before this solution, there was no
          real-time visibility into site risk, team location, or fault status.
        </div>
      </div>
      <div className="absolute top-[56vh] left-[5vw] right-[5vw] flex gap-[2vw]">
        <div className="flex-1 rounded-2xl p-[1.8vw]" style={{ background: "#fff1f2", border: "2px solid #fecdd3" }}>
          <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.5vh" }}>46°C</div>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.5vh" }}>Extreme Heat</div>
          <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Ambient design temperature — pushes all cooling and power systems to their limit</div>
        </div>
        <div className="flex-1 rounded-2xl p-[1.8vw]" style={{ background: "#f5f3ff", border: "2px solid #c4b5fd" }}>
          <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "0.5vh" }}>79</div>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "0.5vh" }}>COW Sites</div>
          <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Nokia Cell on Wheels deployed across 7 Hajj zones — each one critical</div>
        </div>
        <div className="flex-1 rounded-2xl p-[1.8vw]" style={{ background: "#fffbeb", border: "2px solid #fde68a" }}>
          <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#d97706", marginBottom: "0.5vh" }}>9</div>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#d97706", marginBottom: "0.5vh" }}>Risk Scenarios</div>
          <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Per site — covering Prime, Backup Generator, and Battery-only operating modes</div>
        </div>
        <div className="flex-1 rounded-2xl p-[1.8vw]" style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}>
          <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#16a34a", marginBottom: "0.5vh" }}>0</div>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#16a34a", marginBottom: "0.5vh" }}>Prior Visibility</div>
          <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>No unified system for risk intelligence, team tracking, or fault resolution</div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
