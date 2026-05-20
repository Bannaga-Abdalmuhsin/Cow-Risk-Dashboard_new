const V = "Verdana, sans-serif";
export default function S09DashboardTabs() {
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
          Risk Dashboard · Navigation
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Six Operational Views
        </div>
        <div style={{ fontSize: "1.5vw", color: "#374151", marginBottom: "3.5vh" }}>
          Each tab serves a distinct role — from C-Level overview to field technician deployment plans.
        </div>
      </div>
      <div className="absolute top-[42vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", gap: "2vw" }}>
          <div style={{ flex: 1, background: "#f5f3ff", border: "2px solid #c4b5fd", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "0.8vh" }}>Overview</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Executive summary — fleet status, risk flags, key metrics at a glance</div>
          </div>
          <div style={{ flex: 1, background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#ea580c", marginBottom: "0.8vh" }}>Heat Map</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Satellite map with live risk overlay — ESRI tiles, click-to-drill per site</div>
          </div>
          <div style={{ flex: 1, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#16a34a", marginBottom: "0.8vh" }}>Site List</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Sortable table of all 79 sites — filter by risk, zone, or scenario outcome</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2vw", marginTop: "2vh" }}>
          <div style={{ flex: 1, background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#2563eb", marginBottom: "0.8vh" }}>Field Ops</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Technician deployment plan — who goes where, escalation priority list</div>
          </div>
          <div style={{ flex: 1, background: "#fdf4ff", border: "2px solid #e9d5ff", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#9333ea", marginBottom: "0.8vh" }}>Teams</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Live team tracker — helmet map, online/offline status, zone assignment</div>
          </div>
          <div style={{ flex: 1, background: "#fff1f2", border: "2px solid #fecdd3", borderRadius: "1vw", padding: "1.6vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#dc2626", marginBottom: "0.8vh" }}>Fault Mgmt</div>
            <div style={{ fontSize: "1.15vw", color: "#4b5563" }}>Live fault cards — Power BI sync, dispatch, ETA tracking, resolution flow</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
