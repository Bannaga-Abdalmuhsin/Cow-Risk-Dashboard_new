const V = "Verdana, sans-serif";

export default function Slide00DashboardIdea() {
  const pillars = [
    {
      icon: "⚡",
      title: "Power Supply",
      desc: "Monitors prime SEC and backup generator capacity against full telecom + AC + battery load at 46°C",
      color: "#6b21c8",
      bg: "#f5f3ff",
      border: "#c4b5fd",
    },
    {
      icon: "🔋",
      title: "Battery Backup",
      desc: "Tracks battery strings endurance time under full load — critical when all power sources are offline",
      color: "#0d9488",
      bg: "#f0fdfa",
      border: "#99f6e4",
    },
    {
      icon: "❄️",
      title: "Rectifier",
      desc: "Validates rectifier net capacity covers telecom load with margin, accounting for derating at high temperature",
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      icon: "🌡️",
      title: "Thermal Risk",
      desc: "Correlates AC system capacity with shelter heat load to flag sites at thermal overload risk",
      color: "#dc2626",
      bg: "#fff1f2",
      border: "#fecdd3",
    },
  ];

  const scenarios = [
    { id: "S1", label: "1 AC · No Charging",     src: "Prime",  detail: "Single AC unit active" },
    { id: "S2", label: "2 AC · No Charging",     src: "Prime",  detail: "Both AC units active" },
    { id: "S3", label: "1 AC · With Charging",   src: "Prime",  detail: "Battery charging included" },
    { id: "S4", label: "2 AC · With Charging",   src: "Prime",  detail: "Max prime load" },
    { id: "S5", label: "1 AC · No Charging",     src: "Backup", detail: "Generator switch test" },
    { id: "S6", label: "2 AC · No Charging",     src: "Backup", detail: "Full AC on backup" },
    { id: "S7", label: "1 AC · With Charging",   src: "Backup", detail: "Backup + charging" },
    { id: "S8", label: "2 AC · With Charging",   src: "Backup", detail: "Max backup load" },
    { id: "S9", label: "Power Outage",            src: "Battery",detail: "Battery discharge only" },
  ];

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
          Hajj 1447 · Nokia COW Sites · 46°C Operations
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "2.6vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.15 }}>
          COW Power &amp; Cooling Risk Dashboard
        </div>
        <div style={{ fontFamily: V, fontSize: "1.3vw", color: "#6b21c8", fontWeight: "600", marginTop: "0.4vh" }}>
          A real-time risk intelligence tool for 79 Nokia COW sites across Makkah · Mina · Muzdalifah · Arafat
        </div>
      </div>

      <div className="absolute top-[19vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div style={{ width: "52%" }}>
          <div className="rounded-xl overflow-hidden border-2 mb-[1.5vh]" style={{ borderColor: "#6b21c8" }}>
            <div className="px-[1.5vw] py-[0.9vh]" style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "white" }}>
                What Does the Dashboard Do?
              </div>
            </div>
            <div className="px-[1.5vw] py-[1.2vh] bg-white">
              <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#374151", lineHeight: 1.6 }}>
                The dashboard simulates <strong>9 operating scenarios</strong> across every COW site and automatically
                classifies each site as <span style={{ color: "#059669", fontWeight: "bold" }}>SAFE</span> or{" "}
                <span style={{ color: "#dc2626", fontWeight: "bold" }}>AT RISK</span> — giving field teams and
                management instant visibility into power and cooling vulnerabilities <em>before</em> Hajj peak days.
              </div>
              <div className="flex gap-[1.5vw] mt-[1.2vh]">
                {[
                  { n: "79", label: "COW Sites", color: "#6b21c8" },
                  { n: "9",  label: "Scenarios",  color: "#6b21c8" },
                  { n: "16", label: "Technicians", color: "#6b21c8" },
                  { n: "2",  label: "Risk Levels", color: "#6b21c8" },
                ].map(({ n, label, color }) => (
                  <div key={label} className="flex-1 rounded-lg py-[0.8vh] text-center"
                    style={{ background: "#f5f3ff", border: "1px solid #c4b5fd" }}>
                    <div style={{ fontFamily: V, fontSize: "1.8vw", fontWeight: "bold", color }}>{n}</div>
                    <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#374151" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[1vw]">
            {pillars.map(({ icon, title, desc, color, bg, border }) => (
              <div key={title} className="rounded-xl p-[1.2vw]" style={{ background: bg, border: `1.5px solid ${border}` }}>
                <div className="flex items-center gap-[0.6vw] mb-[0.5vh]">
                  <span style={{ fontSize: "1.3vw" }}>{icon}</span>
                  <span style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color }}>{title}</span>
                </div>
                <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#4b5563", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "48%" }}>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#e5e7eb" }}>
            <div className="px-[1.5vw] py-[0.9vh] flex items-center justify-between" style={{ background: "#f5f3ff" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#4a0e8f" }}>
                The 9 Risk Scenarios
              </div>
              <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b21c8" }}>@ 46°C Ambient</div>
            </div>
            <div className="bg-white px-[1.5vw] py-[0.8vh]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", paddingBottom: "0.6vh", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>#</th>
                    <th style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", paddingBottom: "0.6vh", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Scenario</th>
                    <th style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", paddingBottom: "0.6vh", borderBottom: "2px solid #e5e7eb", textAlign: "center" }}>Source</th>
                    <th style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", paddingBottom: "0.6vh", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s) => {
                    const srcColor = s.src === "Prime" ? "#6b21c8" : s.src === "Backup" ? "#dc2626" : "#d97706";
                    const srcBg   = s.src === "Prime" ? "#f5f3ff" : s.src === "Backup" ? "#fff1f2" : "#fffbeb";
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#6b21c8", paddingTop: "0.45vh", paddingBottom: "0.45vh" }}>{s.id}</td>
                        <td style={{ fontFamily: V, fontSize: "1.1vw", color: "#1a0a2e", paddingTop: "0.45vh", paddingBottom: "0.45vh" }}>{s.label}</td>
                        <td style={{ paddingTop: "0.45vh", paddingBottom: "0.45vh", textAlign: "center" }}>
                          <span style={{ fontFamily: V, fontSize: "1.0vw", fontWeight: "bold", color: srcColor, background: srcBg, borderRadius: "4px", padding: "0.1vh 0.5vw" }}>{s.src}</span>
                        </td>
                        <td style={{ fontFamily: V, fontSize: "1.05vw", color: "#6b7280", paddingTop: "0.45vh", paddingBottom: "0.45vh" }}>{s.detail}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-[1.5vw] py-[0.8vh] flex gap-[1.5vw]" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
              {[
                { color: "#6b21c8", label: "Prime power (SEC / Generator)" },
                { color: "#dc2626", label: "Backup generator" },
                { color: "#d97706", label: "Battery only (S9)" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-[0.4vw]">
                  <span className="w-[0.7vw] h-[0.7vw] rounded-sm inline-block" style={{ background: color }} />
                  <span style={{ fontFamily: V, fontSize: "1.05vw", color: "#6b7280" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl px-[1.5vw] py-[1vh] mt-[1.2vh] flex items-start gap-[1vw]"
            style={{ background: "#1a0a2e", border: "1px solid #4c1d95" }}>
            <div style={{ fontSize: "1.4vw", flexShrink: 0 }}>💡</div>
            <div>
              <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#c4b5fd", marginBottom: "0.3vh" }}>
                Why It Matters
              </div>
              <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#ddd6fe", lineHeight: 1.5 }}>
                Hajj peak concentration puts extreme demand on COW infrastructure at 46°C. A single power failure
                during peak pilgrimage can disrupt critical communications for hundreds of thousands of pilgrims.
                This dashboard converts complex engineering data into clear, actionable risk flags.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2.5vh] left-[4vw] right-[3vw] flex items-center justify-between">
        <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
        <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#6b21c8" }}>Slide 1 / 4</div>
      </div>
    </div>
  );
}
