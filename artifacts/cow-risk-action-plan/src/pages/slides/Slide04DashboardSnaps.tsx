const V = "Verdana, sans-serif";
const BASE = import.meta.env.BASE_URL;

const metrics = [
  { label: "Total COW Sites",     value: "79",  sub: "Full Hajj 1447 fleet",          icon: "📡", col: "#6b21c8" },
  { label: "Safe Sites",          value: "52",  sub: "Scenario S8 worst-case",         icon: "✅", col: "#059669" },
  { label: "At Risk Sites",       value: "27",  sub: "Require immediate action",       icon: "⚠️", col: "#dc2626" },
  { label: "Field Technicians",   value: "16",  sub: "Pre-positioned · 4 zones",       icon: "👷", col: "#6b21c8" },
  { label: "Operating Temp",      value: "46°C",sub: "Extreme Hajj conditions",        icon: "🌡️", col: "#d97706" },
  { label: "Total Risk Flags",    value: "183", sub: "Across all sites & scenarios",   icon: "🚨", col: "#dc2626" },
];

const tabs = ["Overview", "Scenarios", "Heat Map", "Site List", "Field Ops"];

export default function Slide04DashboardSnaps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>

      <div className="absolute top-0 left-0 w-[0.7vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />

      <div className="absolute top-[2.5vh] right-[3vw] flex items-center gap-[1.5vw]">
        <div style={{ fontFamily: V, fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em", textTransform: "uppercase" }}>stc</div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[2.5vh] left-[4vw]">
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9333ea" }}>
          Hajj 1447 · Dashboard Preview
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4vh" }}>
          Application Screens
        </div>
        <div style={{ fontFamily: V, fontSize: "2.4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1 }}>
          Login &amp; Main Dashboard Overview
        </div>
      </div>

      <div className="absolute top-[18vh] bottom-[5.5vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        {/* ── LOGIN SCREEN ── */}
        <div style={{ width: "42%", display: "flex", flexDirection: "column", gap: "0.7vh" }}>
          <div style={{ fontFamily: V, fontSize: "1.05vw", fontWeight: "bold", color: "#4a0e8f", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🔐 Secure Login
          </div>
          <div className="rounded-xl overflow-hidden flex-1"
            style={{ border: "2px solid #c4b5fd", boxShadow: "0 8px 32px rgba(107,33,200,0.18)" }}>
            {/* browser chrome bar */}
            <div style={{ background: "#1e1b2e", padding: "0.5vh 1vw", display: "flex", alignItems: "center", gap: "0.5vw" }}>
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              <div style={{ flex: 1, background: "#2d2a45", borderRadius: "4px", padding: "0.2vh 0.8vw", marginLeft: "0.5vw" }}>
                <span style={{ fontFamily: V, fontSize: "0.8vw", color: "#9ca3af" }}>https://cowms.stc.com.sa</span>
              </div>
            </div>
            <img
              src={`${BASE}snap-login.jpg`}
              alt="Login screen"
              style={{ width: "100%", height: "calc(100% - 3.2vh)", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          </div>
          <div style={{ fontFamily: V, fontSize: "1.0vw", color: "#6b7280", textAlign: "center" }}>
            Secured with role-based authentication · ACES MSD Division
          </div>
        </div>

        {/* ── DASHBOARD OVERVIEW ── */}
        <div style={{ width: "58%", display: "flex", flexDirection: "column", gap: "0.7vh" }}>
          <div style={{ fontFamily: V, fontSize: "1.05vw", fontWeight: "bold", color: "#4a0e8f", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            📊 Main Dashboard — Overview Tab
          </div>
          <div className="rounded-xl overflow-hidden flex-1"
            style={{ border: "2px solid #c4b5fd", boxShadow: "0 8px 32px rgba(107,33,200,0.18)", display: "flex", flexDirection: "column" }}>

            {/* browser chrome */}
            <div style={{ background: "#1e1b2e", padding: "0.5vh 1vw", display: "flex", alignItems: "center", gap: "0.5vw", flexShrink: 0 }}>
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: "0.7vw", height: "0.7vw", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              <div style={{ flex: 1, background: "#2d2a45", borderRadius: "4px", padding: "0.2vh 0.8vw", marginLeft: "0.5vw" }}>
                <span style={{ fontFamily: V, fontSize: "0.8vw", color: "#9ca3af" }}>https://cowms.stc.com.sa/dashboard</span>
              </div>
            </div>

            {/* app header */}
            <div style={{ background: "linear-gradient(135deg,#0f0520,#1a0a2e)", padding: "0.6vh 1.2vw", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <span style={{ fontFamily: V, fontSize: "1.05vw", fontWeight: "bold", color: "#c4b5fd" }}>📡</span>
                <div>
                  <div style={{ fontFamily: V, fontSize: "0.95vw", fontWeight: "bold", color: "white" }}>COW Risk Dashboard</div>
                  <div style={{ fontFamily: V, fontSize: "0.75vw", color: "#9333ea" }}>Hajj 1447 · Nokia · 46°C</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.6vw", alignItems: "center" }}>
                <span style={{ fontFamily: V, fontSize: "0.75vw", color: "#a78bfa" }}>Scenario: S8</span>
                <span style={{ fontFamily: V, fontSize: "0.75vw", color: "#a78bfa" }}>|</span>
                <span style={{ fontFamily: V, fontSize: "0.8vw", fontWeight: "bold", color: "#c4b5fd", letterSpacing: "0.1em" }}>STC</span>
              </div>
            </div>

            {/* tab bar */}
            <div style={{ background: "#1a0a2e", display: "flex", flexShrink: 0, borderBottom: "1px solid #2d1a4e" }}>
              {tabs.map((t, i) => (
                <div key={t} style={{
                  fontFamily: V, fontSize: "0.8vw", padding: "0.55vh 1vw", cursor: "pointer",
                  color: i === 0 ? "#c4b5fd" : "#6b5a8e",
                  borderBottom: i === 0 ? "2px solid #9333ea" : "2px solid transparent",
                  fontWeight: i === 0 ? "bold" : "normal",
                }}>{t}</div>
              ))}
            </div>

            {/* metric cards */}
            <div style={{ background: "#f9fafb", padding: "0.8vh 0.8vw", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "0.5vw", flexShrink: 0 }}>
              {metrics.map(({ label, value, sub, icon, col }) => (
                <div key={label} style={{ background: "white", borderRadius: "8px", padding: "0.5vh 0.5vw", border: `1px solid ${col}30`, textAlign: "center" }}>
                  <div style={{ fontSize: "1.0vw", marginBottom: "0.1vh" }}>{icon}</div>
                  <div style={{ fontFamily: V, fontSize: "1.0vw", fontWeight: "bold", color: col }}>{value}</div>
                  <div style={{ fontFamily: V, fontSize: "0.65vw", color: "#374151", lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontFamily: V, fontSize: "0.55vw", color: "#9ca3af", marginTop: "0.1vh" }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* scenario selector + site risk summary */}
            <div style={{ background: "#f9fafb", padding: "0 0.8vw 0.5vh", display: "flex", gap: "0.6vw", flexShrink: 0 }}>
              <div style={{ flex: 1, background: "white", borderRadius: "8px", padding: "0.5vh 0.7vw", border: "1px solid #e5e7eb" }}>
                <div style={{ fontFamily: V, fontSize: "0.75vw", fontWeight: "bold", color: "#4a0e8f", marginBottom: "0.3vh" }}>Scenario Selector</div>
                <div style={{ display: "flex", gap: "0.3vw", flexWrap: "wrap" }}>
                  {["S1","S2","S3","S4","S5","S6","S7","S8","S9"].map((s) => (
                    <span key={s} style={{
                      fontFamily: V, fontSize: "0.65vw", padding: "0.1vh 0.35vw", borderRadius: "4px",
                      background: s === "S8" ? "#6b21c8" : "#f5f3ff",
                      color: s === "S8" ? "white" : "#6b21c8",
                      fontWeight: s === "S8" ? "bold" : "normal",
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, background: "white", borderRadius: "8px", padding: "0.5vh 0.7vw", border: "1px solid #e5e7eb" }}>
                <div style={{ fontFamily: V, fontSize: "0.75vw", fontWeight: "bold", color: "#4a0e8f", marginBottom: "0.3vh" }}>Fleet Risk — S8</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4vw" }}>
                  <div style={{ flex: 1, height: "0.8vh", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "66%", height: "100%", background: "linear-gradient(90deg,#059669,#10b981)" }} />
                  </div>
                  <span style={{ fontFamily: V, fontSize: "0.65vw", color: "#374151", whiteSpace: "nowrap" }}>52 safe / 27 risk</span>
                </div>
                <div style={{ display: "flex", gap: "0.5vw", marginTop: "0.3vh" }}>
                  {[["Arafat","37"],["Mina","10"],["Muzdalifah","32"]].map(([loc,n]) => (
                    <span key={loc} style={{ fontFamily: V, fontSize: "0.6vw", color: "#6b7280" }}>{loc}: <strong style={{ color: "#374151" }}>{n}</strong></span>
                  ))}
                </div>
              </div>
            </div>

            {/* site list preview */}
            <div style={{ flex: 1, background: "#f9fafb", padding: "0 0.8vw 0.6vh", overflow: "hidden" }}>
              <div style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", height: "100%" }}>
                <div style={{ background: "#f5f3ff", padding: "0.4vh 0.8vw", display: "flex", gap: "1.5vw" }}>
                  {["Site","Location","Type","Scenario Risk","S8 Margin"].map(h => (
                    <div key={h} style={{ fontFamily: V, fontSize: "0.65vw", fontWeight: "bold", color: "#6b21c8", textTransform: "uppercase", flex: h === "Site" ? "0 0 5vw" : 1 }}>{h}</div>
                  ))}
                </div>
                {[
                  ["CWN901","Arafat","SB","AT RISK","−1.99 kW","#dc2626"],
                  ["CWN021","Muzdalifah","SB","AT RISK","−1.52 kW","#dc2626"],
                  ["CWN996","Arafat","SG","AT RISK","−5.39 kW","#dc2626"],
                  ["CWN093","Arafat","SB","SAFE","+2.34 kW","#059669"],
                  ["CWN038","Arafat","SG","SAFE","+5.80 kW","#059669"],
                ].map(([id, loc, type, risk, margin, col]) => (
                  <div key={id} style={{ display: "flex", gap: "1.5vw", padding: "0.35vh 0.8vw", borderBottom: "1px solid #f3f4f6", alignItems: "center", background: risk === "AT RISK" ? "#fff8f8" : "white" }}>
                    <div style={{ fontFamily: V, fontSize: "0.7vw", fontWeight: "bold", color: "#6b21c8", flex: "0 0 5vw" }}>{id}</div>
                    <div style={{ fontFamily: V, fontSize: "0.7vw", color: "#374151", flex: 1 }}>{loc}</div>
                    <div style={{ fontFamily: V, fontSize: "0.65vw", color: "#6b7280", flex: 1 }}>{type}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: V, fontSize: "0.65vw", fontWeight: "bold", color: col, background: col + "15", borderRadius: "3px", padding: "0.1vh 0.3vw" }}>{risk}</span>
                    </div>
                    <div style={{ fontFamily: V, fontSize: "0.7vw", fontWeight: "bold", color: col, flex: 1 }}>{margin}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: V, fontSize: "1.0vw", color: "#6b7280", textAlign: "center" }}>
            Live data from PostgreSQL · Auto-refreshes per scenario · Scenario S8 shown (worst-case backup)
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
      </div>
    </div>
  );
}
