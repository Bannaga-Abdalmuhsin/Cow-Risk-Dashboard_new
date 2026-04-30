const V = "Verdana, sans-serif";

export default function Slide00DashboardIdea() {
  const risks = [
    {
      icon: "⚡",
      title: "Power Failure",
      desc: "SEC grid outages or generator breakdown leaves sites without primary power during peak operations",
      color: "#6b21c8", bg: "#f5f3ff", border: "#c4b5fd",
    },
    {
      icon: "🌡️",
      title: "Thermal Overload",
      desc: "46°C ambient temperature forces AC systems to maximum capacity — any failure leads to equipment shutdown",
      color: "#dc2626", bg: "#fff1f2", border: "#fecdd3",
    },
    {
      icon: "🔋",
      title: "Battery Exhaustion",
      desc: "During total outages, battery strings are the last line of defense — insufficient endurance = complete blackout",
      color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    },
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
          Hajj 1447 · Nokia COW Sites · Executive Brief
        </div>
      </div>

      <div className="absolute top-[10vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.8vh" }}>
          The Challenge
        </div>
        <div style={{ fontFamily: V, fontSize: "3.4vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.6vh" }}>
          79 COW Sites. 46°C.
        </div>
        <div style={{ fontFamily: V, fontSize: "3.4vw", fontWeight: "bold", lineHeight: 1.1, marginBottom: "2vh" }}>
          <span style={{ color: "#6b21c8" }}>Zero Margin</span>
          <span style={{ color: "#1a0a2e" }}> for Error.</span>
        </div>
        <div style={{ fontFamily: V, fontSize: "1.3vw", color: "#4b5563", lineHeight: 1.6, maxWidth: "55vw" }}>
          During Hajj 1447 peak, Nokia COW infrastructure across Makkah, Mina, Muzdalifah and Arafat
          must sustain uninterrupted telecom coverage for millions of pilgrims under extreme heat. A single
          power or cooling failure silences communications for an entire zone.
        </div>
      </div>

      <div className="absolute top-[52vh] left-[4vw] right-[3vw] flex gap-[1.5vw]">
        {risks.map(({ icon, title, desc, color, bg, border }) => (
          <div key={title} className="flex-1 rounded-xl p-[1.4vw]" style={{ background: bg, border: `1.5px solid ${border}` }}>
            <div className="flex items-center gap-[0.6vw] mb-[0.8vh]">
              <span style={{ fontSize: "1.6vw" }}>{icon}</span>
              <span style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color }}>{title}</span>
            </div>
            <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#4b5563", lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div className="absolute top-[79vh] left-[4vw] right-[3vw] flex gap-[3vw]">
        {[
          { n: "79", label: "Nokia COW Sites" },
          { n: "4",  label: "Operational Zones" },
          { n: "46°C", label: "Ambient Design Temp" },
          { n: "9",  label: "Risk Scenarios Modelled" },
        ].map(({ n, label }) => (
          <div key={label} className="text-center">
            <div style={{ fontFamily: V, fontSize: "2.2vw", fontWeight: "bold", color: "#6b21c8" }}>{n}</div>
            <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#6b7280" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[2.5vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
      </div>
    </div>
  );
}
