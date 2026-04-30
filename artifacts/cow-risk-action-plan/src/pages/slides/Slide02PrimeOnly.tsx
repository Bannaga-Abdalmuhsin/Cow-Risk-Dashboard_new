const V = "Verdana, sans-serif";

export default function Slide02PrimeOnly() {
  const groups = [
    {
      label: "S1 – S4  ·  Prime Power Scenarios",
      sublabel: "SEC grid or prime generator — battery charging included at worst case",
      safe: 77, risk: 2, total: 79,
      color: "#6b21c8", safeColor: "#059669", riskColor: "#dc2626",
      safeBg: "#f0fdf4", riskBg: "#fff1f2",
      finding: "2 SG sites insufficient prime capacity at S4 (max load)",
      detail: "CWN996 · CWN970 — generator undersized vs full AC + charging load",
      severity: "LOW",
    },
    {
      label: "S5 – S8  ·  Backup Generator Scenarios",
      sublabel: "Prime power offline — backup generator as sole supply source",
      safe: 52, risk: 27, total: 79,
      color: "#dc2626", safeColor: "#059669", riskColor: "#dc2626",
      safeBg: "#f0fdf4", riskBg: "#fff1f2",
      finding: "27 sites at risk when backup generator is active",
      detail: "3 SB sites (backup undersized) · 24 SG/DG sites (no backup source — total exposure)",
      severity: "HIGH",
    },
    {
      label: "S9  ·  Complete Power Outage",
      sublabel: "All power offline — batteries as sole energy source",
      safe: 79, risk: 0, total: 79,
      color: "#d97706", safeColor: "#059669", riskColor: "#dc2626",
      safeBg: "#f0fdf4", riskBg: "#fff1f2",
      finding: "All 79 sites hold ≥ 1 hour battery endurance — currently SAFE",
      detail: "12 sites: 1h · 61 sites: 2h · 6 sites: 3h  (threshold: < 1h = risk)",
      severity: "SAFE",
    },
  ];

  const sevColor = (s: string) => s === "HIGH" ? { bg: "#fff1f2", color: "#dc2626", border: "#fecdd3" }
    : s === "LOW" ? { bg: "#fffbeb", color: "#d97706", border: "#fde68a" }
    : { bg: "#f0fdf4", color: "#059669", border: "#86efac" };

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
          Hajj 1447 · Risk Assessment · 79 Sites @ 46°C
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5vh" }}>
          Key Findings
        </div>
        <div style={{ fontFamily: V, fontSize: "2.6vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.3vh" }}>
          Risk Assessment Summary — All 9 Scenarios
        </div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#6b21c8" }}>
          Each of 79 COW sites evaluated against full load at 46°C ambient · Automatic Safe / At Risk classification
        </div>
      </div>

      <div className="absolute top-[21vh] left-[4vw] right-[3vw] flex flex-col gap-[1.4vh]">
        {groups.map((g) => {
          const sev = sevColor(g.severity);
          const safePct = Math.round((g.safe / g.total) * 100);
          return (
            <div key={g.label} className="rounded-xl overflow-hidden border-2"
              style={{ borderColor: g.color + "55", background: "white" }}>
              <div className="flex items-center gap-[1.5vw] px-[1.5vw] py-[0.9vh]"
                style={{ background: g.color + "12" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: g.color }}>{g.label}</div>
                  <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#6b7280" }}>{g.sublabel}</div>
                </div>
                <div style={{ display: "flex", gap: "1.2vw", alignItems: "center" }}>
                  <div className="text-center rounded-lg px-[1vw] py-[0.4vh]" style={{ background: g.safeBg, border: "1px solid #86efac" }}>
                    <div style={{ fontFamily: V, fontSize: "1.7vw", fontWeight: "bold", color: g.safeColor }}>{g.safe}</div>
                    <div style={{ fontFamily: V, fontSize: "0.95vw", color: "#059669", fontWeight: "bold" }}>SAFE</div>
                  </div>
                  <div className="text-center rounded-lg px-[1vw] py-[0.4vh]" style={{ background: g.risk > 0 ? g.riskBg : "#f0fdf4", border: `1px solid ${g.risk > 0 ? "#fecdd3" : "#86efac"}` }}>
                    <div style={{ fontFamily: V, fontSize: "1.7vw", fontWeight: "bold", color: g.risk > 0 ? g.riskColor : "#059669" }}>{g.risk}</div>
                    <div style={{ fontFamily: V, fontSize: "0.95vw", color: g.risk > 0 ? "#dc2626" : "#059669", fontWeight: "bold" }}>{g.risk > 0 ? "AT RISK" : "AT RISK"}</div>
                  </div>
                  <div className="rounded-lg px-[0.8vw] py-[0.3vh]" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
                    <div style={{ fontFamily: V, fontSize: "1.05vw", fontWeight: "bold", color: sev.color }}>{g.severity}</div>
                  </div>
                </div>
              </div>
              <div className="px-[1.5vw] py-[0.8vh]">
                <div style={{ width: "100%", height: "0.7vh", borderRadius: "4px", background: "#f3f4f6", marginBottom: "0.7vh", overflow: "hidden" }}>
                  <div style={{ width: `${safePct}%`, height: "100%", background: g.safe === g.total ? "#059669" : "linear-gradient(90deg,#059669,#10b981)", borderRadius: "4px" }} />
                </div>
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#374151" }}>{g.finding}</div>
                <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#6b7280", marginTop: "0.2vh" }}>{g.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-[2.5vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.05vw", color: "#9ca3af" }}>
          stc · ACES MSD Division · COW Power Risk Dashboard · Hajj 1447
        </div>
      </div>
    </div>
  );
}
