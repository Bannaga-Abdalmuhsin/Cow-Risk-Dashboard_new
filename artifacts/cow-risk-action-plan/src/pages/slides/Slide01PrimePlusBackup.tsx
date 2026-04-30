const V = "Verdana, sans-serif";

export default function Slide01PrimePlusBackup() {
  const pillars = [
    { icon: "⚡", label: "Power Supply",   desc: "SEC grid & generator capacity vs full load at 46°C",  color: "#9333ea" },
    { icon: "🔋", label: "Battery Backup", desc: "Battery string endurance when all power sources fail",  color: "#0d9488" },
    { icon: "🔌", label: "Rectifier",      desc: "Rectifier net capacity against telecom load with derating", color: "#d97706" },
    { icon: "🌡️", label: "Thermal Risk",   desc: "AC system capacity vs shelter heat load at peak temperature", color: "#dc2626" },
  ];

  const scenarios = [
    { group: "Prime Power (S1–S4)", color: "#6b21c8", bg: "#f5f3ff", border: "#c4b5fd",
      items: ["S1 · 1 AC unit active — no battery charging", "S2 · Both AC units active — no battery charging", "S3 · 1 AC active — includes battery charging load", "S4 · Both AC active + charging — maximum prime load"] },
    { group: "Backup Generator (S5–S8)", color: "#dc2626", bg: "#fff1f2", border: "#fecdd3",
      items: ["S5 · Generator switch test — 1 AC, no charging", "S6 · Full AC on backup generator — no charging", "S7 · Backup generator + 1 AC + battery charging", "S8 · Maximum load on backup — 2 AC + charging"] },
    { group: "Battery Only (S9)", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
      items: ["S9 · Complete power outage — batteries as sole source", "", "", ""] },
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
          Hajj 1447 · COW Risk Intelligence Dashboard
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5vh" }}>
          The Solution
        </div>
        <div style={{ fontFamily: V, fontSize: "2.6vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.3vh" }}>
          Real-Time Risk Intelligence for All 79 Sites
        </div>
        <div style={{ fontFamily: V, fontSize: "1.2vw", color: "#6b21c8" }}>
          9 engineering scenarios modelled simultaneously · Automatic SAFE / AT RISK classification · 46°C design baseline
        </div>
      </div>

      <div className="absolute top-[22vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div style={{ width: "42%" }}>
          <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#4a0e8f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1vh" }}>
            4 Risk Dimensions Monitored
          </div>
          <div className="flex flex-col gap-[0.9vh]">
            {pillars.map(({ icon, label, desc, color }) => (
              <div key={label} className="flex items-center gap-[1.2vw] rounded-xl px-[1.2vw] py-[1vh]"
                style={{ background: "white", border: "1.5px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "1.5vw", flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color }}>{label}</div>
                  <div style={{ fontFamily: V, fontSize: "1.0vw", color: "#6b7280" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-[1.4vw] py-[1.2vh] mt-[1.2vh]"
            style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
            <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#e9d5ff", marginBottom: "0.6vh" }}>
              Dashboard delivers instant, site-by-site risk visibility to field teams and management — enabling
              pre-emptive action <em>before</em> Hajj peak days begin.
            </div>
            <div className="flex gap-[2vw] mt-[0.8vh]">
              {[["79","Sites"], ["16","Technicians"], ["2","Risk Tiers"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div style={{ fontFamily: V, fontSize: "1.6vw", fontWeight: "bold", color: "white" }}>{n}</div>
                  <div style={{ fontFamily: V, fontSize: "1.0vw", color: "#c4b5fd" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: "58%" }}>
          <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#4a0e8f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1vh" }}>
            9 Operating Scenarios at 46°C
          </div>
          <div className="flex flex-col gap-[1vh]">
            {scenarios.map(({ group, color, bg, border, items }) => (
              <div key={group} className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
                <div className="px-[1.2vw] py-[0.7vh]" style={{ background: bg }}>
                  <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color }}>{group}</span>
                </div>
                <div className="bg-white px-[1.2vw] py-[0.6vh]">
                  {items.filter(Boolean).map((item) => (
                    <div key={item} className="flex items-center gap-[0.6vw] py-[0.2vh]">
                      <span style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontFamily: V, fontSize: "1.05vw", color: "#374151" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2.5vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
      </div>
    </div>
  );
}
