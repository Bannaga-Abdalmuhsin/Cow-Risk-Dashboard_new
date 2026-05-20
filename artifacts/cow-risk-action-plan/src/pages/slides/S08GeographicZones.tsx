const V = "Verdana, sans-serif";
export default function S08GeographicZones() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw]" style={{ right: "52vw" }}>
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Risk Dashboard · Coverage
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          7 Deployment Zones
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#6b21c8", lineHeight: 1.1, marginBottom: "3vh" }}>
          79 Sites
        </div>
        <div style={{ fontSize: "1.4vw", color: "#374151", lineHeight: 1.7, marginBottom: "4vh" }}>
          Full geographic coverage across all Hajj operational zones — each site individually risk-assessed and mapped.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
            <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#1a0a2e" }}>Arafat</div>
            <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Peak pilgrimage zone</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
            <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#d97706", flexShrink: 0 }} />
            <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#1a0a2e" }}>Mina</div>
            <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Jamarat corridor</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
            <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#6b21c8", flexShrink: 0 }} />
            <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#1a0a2e" }}>Muzdalifa</div>
            <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Night gathering area</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
            <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
            <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#1a0a2e" }}>Makkah Central</div>
            <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Haram vicinity</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
            <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
            <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#1a0a2e" }}>Makkah Remote</div>
            <div style={{ fontSize: "1.15vw", color: "#6b7280" }}>Outer city coverage</div>
          </div>
        </div>
      </div>
      <div className="absolute top-[8vh] right-[3vw]" style={{ left: "50vw", bottom: "8vh" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "1.5vw", background: "linear-gradient(145deg,#1a0a2e,#2d1464)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3vw" }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "4vh" }}>Site Distribution</div>
          <div style={{ display: "flex", gap: "3vw", marginBottom: "3vh" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#a78bfa" }}>60</div>
              <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.7)" }}>Safe Sites</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#f87171" }}>19</div>
              <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.7)" }}>At Risk</div>
            </div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "3vh" }} />
          <div style={{ display: "flex", gap: "3vw" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#facc15" }}>79</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)" }}>Total Sites</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#facc15" }}>7</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)" }}>Zones</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3vw", fontWeight: "bold", color: "#facc15" }}>711</div>
              <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.6)" }}>Calculations</div>
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
