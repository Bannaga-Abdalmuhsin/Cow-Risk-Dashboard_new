const V = "Verdana, sans-serif";
export default function S13LiveGPS() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#f0fdf9 0%,#ccfbf1 55%,#99f6e420 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#0d9488" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#0d9488,#14b8a6,#0d9488)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#0d9488", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#0d9488" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw]" style={{ right: "50vw" }}>
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Team Tracker · Live Map
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#0c3b3a", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Helmet Icons.
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#0d9488", lineHeight: 1.1, marginBottom: "3vh" }}>
          Live on Satellite.
        </div>
        <div style={{ fontSize: "1.4vw", color: "#374151", lineHeight: 1.7, marginBottom: "4vh" }}>
          Every field technician appears as a helmet marker on an ESRI satellite map — color reflects their freshness of location update.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", background: "white", borderRadius: "1vw", padding: "1.4vw", border: "2px solid #16a34a", boxShadow: "0 2px 12px rgba(22,163,74,0.15)" }}>
            <div style={{ width: "1.8vw", height: "1.8vw", borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#16a34a" }}>Green Helmet</div>
              <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Location updated within the last 15 minutes — technician is active and visible</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", background: "white", borderRadius: "1vw", padding: "1.4vw", border: "2px solid #dc2626", boxShadow: "0 2px 12px rgba(220,38,38,0.15)" }}>
            <div style={{ width: "1.8vw", height: "1.8vw", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#dc2626" }}>Red Helmet</div>
              <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Last update more than 15 minutes ago — technician may be offline or in a coverage gap</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", background: "#f9fafb", borderRadius: "1vw", padding: "1.4vw", border: "2px solid #d1d5db" }}>
            <div style={{ width: "1.8vw", height: "1.8vw", borderRadius: "50%", background: "#9ca3af", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#6b7280" }}>Removed from Map</div>
              <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>After 60 minutes without update — marker auto-cleared to prevent stale data</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[8vh] right-[3vw]" style={{ left: "52vw", bottom: "8vh" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#0c3b3a,#0d6e6e)", borderRadius: "1.5vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3vw" }}>
          <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#facc15", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "3vh" }}>Tracking Rules</div>
          <div style={{ display: "flex", gap: "3vw", marginBottom: "3vh" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#34d399" }}>15</div>
              <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.7)" }}>min = Online</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#f87171" }}>60</div>
              <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.7)" }}>min = Remove</div>
            </div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "3vh" }} />
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.7 }}>
            Map auto-refreshes every 30 seconds — no manual reload required. Stale markers turn red automatically.
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · ACES Field Team Tracker · Hajj 1447</div>
      </div>
    </div>
  );
}
