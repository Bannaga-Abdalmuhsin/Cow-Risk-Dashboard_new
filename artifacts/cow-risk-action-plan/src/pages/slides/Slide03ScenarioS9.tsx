const V = "Verdana, sans-serif";

export default function Slide03ScenarioS9() {
  const total1h = 12;
  const total2h = 61;
  const total3h = 6;

  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0f0a1e 0%,#1a0a2e 50%,#1e1040 100%)", fontFamily: V }}>

      <div className="absolute top-0 left-0 w-[0.7vw] h-full" style={{ background: "#9333ea" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />

      <div className="absolute top-[2.5vh] right-[3vw] flex items-center gap-[1.5vw]">
        <div style={{ fontFamily: V, fontSize: "1.3vw", fontWeight: "bold", color: "#c4b5fd", letterSpacing: "0.15em", textTransform: "uppercase" }}>stc</div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#a78bfa" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[2.5vh] left-[4vw]">
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a78bfa" }}>
          Hajj 1447 · COW Risk Assessment
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div className="flex items-baseline gap-[1.5vw] mb-[0.3vh]">
          <div className="rounded-lg px-[1.2vw] py-[0.4vh]"
            style={{ background: "#6b21c8", color: "white", fontFamily: V, fontSize: "1.8vw", fontWeight: "900", letterSpacing: "0.15em" }}>S9</div>
          <div style={{ fontFamily: V, fontSize: "2.8vw", fontWeight: "bold", color: "white" }}>
            Power Outage — Battery Discharge
          </div>
        </div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#a78bfa" }}>
          Complete power failure across all 79 COW sites · Batteries as sole energy source · 46°C ambient
        </div>
      </div>

      <div className="absolute top-[19vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div style={{ width: "38%" }} className="flex flex-col gap-[1.5vh]">
          <div className="rounded-xl p-[1.5vw]" style={{ background: "#1e1040", border: "1px solid #4c1d95" }}>
            <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.08em", color: "#c4b5fd", marginBottom: "1.2vh" }}>
              Scenario Conditions
            </div>
            {[
              { label: "Power Source", value: "Batteries only (no SEC / no generator)" },
              { label: "Battery State", value: "Fully charged at outage start" },
              { label: "Cooling", value: "Offline (no AC power available)" },
              { label: "Telecom Load", value: "Full traffic — all radios active" },
              { label: "Temperature", value: "46°C ambient (max design load)" },
              { label: "Risk Threshold", value: "Backup Time < 1 hour → RISK" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-[0.8vw] py-[0.5vh] border-b" style={{ borderColor: "#2e1065" }}>
                <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#a78bfa", minWidth: "35%" }}>{label}</span>
                <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "600", color: "#e9d5ff" }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-[1.5vw]" style={{ background: "#1e1040", border: "1px solid #4c1d95" }}>
            <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.08em", color: "#c4b5fd", marginBottom: "1.2vh" }}>
              Fleet-Wide Battery Endurance
            </div>
            {[
              { hrs: "3 hours", count: total3h, color: "#00BFB3", pct: Math.round(total3h/79*100) },
              { hrs: "2 hours", count: total2h, color: "#6b21c8", pct: Math.round(total2h/79*100) },
              { hrs: "1 hour",  count: total1h, color: "#f59e0b", pct: Math.round(total1h/79*100) },
            ].map(({ hrs, count, color, pct }) => (
              <div key={hrs} className="mb-[0.8vh]">
                <div className="flex justify-between mb-[0.2vh]">
                  <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color }}>{hrs}</span>
                  <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#c4b5fd" }}>{count} sites ({pct}%)</span>
                </div>
                <div className="h-[1.2vh] rounded-full overflow-hidden" style={{ background: "#2e1065" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
            <div className="mt-[1.2vh] rounded-lg px-[1.2vw] py-[0.8vh]"
              style={{ background: "#134e4a", border: "1px solid #0d9488" }}>
              <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#2dd4bf" }}>
                ✓ All 79 sites ≥ 1 hour — SAFE under current S9 threshold
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "62%" }}>
          <div className="rounded-xl overflow-hidden h-full" style={{ border: "1px solid #4c1d95" }}>
            <div className="px-[1.5vw] py-[1vh]" style={{ background: "#2e1065" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#e9d5ff" }}>
                Battery Endurance by Location · Strings MAX Useful Time Hours
              </div>
            </div>

            <div className="p-[1.5vw] flex flex-col gap-[1.5vh]" style={{ background: "#160d2e" }}>
              {[
                { loc: "Arafat", total: 37, breakdown: [{h:"3h",n:6,c:"#00BFB3"},{h:"2h",n:28,c:"#6b21c8"},{h:"1h",n:3,c:"#f59e0b"}],
                  sites1h: "CWN050 · CWN092 · CWN080",
                  sites3h: "CWN038 · CWN072 · CWN076 · CWN093 · CWN102 · CWN923" },
                { loc: "Muzdalifah", total: 32, breakdown: [{h:"2h",n:24,c:"#6b21c8"},{h:"1h",n:8,c:"#f59e0b"}],
                  sites1h: "CWN021 · CWN066 · CWN068 · CWN074 · CWN089 · CWN104 · CWN997",
                  sites3h: null },
                { loc: "Mina", total: 10, breakdown: [{h:"2h",n:9,c:"#6b21c8"},{h:"1h",n:1,c:"#f59e0b"}],
                  sites1h: "CWN907",
                  sites3h: null },
                { loc: "Makkah Remote", total: 3, breakdown: [{h:"2h",n:2,c:"#6b21c8"},{h:"1h",n:1,c:"#f59e0b"}],
                  sites1h: "CWN967",
                  sites3h: null },
              ].map(({ loc, total, breakdown, sites1h, sites3h }) => (
                <div key={loc} className="rounded-xl p-[1.2vw]" style={{ background: "#1e1040", border: "1px solid #2e1065" }}>
                  <div className="flex items-center justify-between mb-[0.8vh]">
                    <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#e9d5ff" }}>{loc}</div>
                    <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#a78bfa" }}>{total} sites</div>
                  </div>
                  <div className="flex gap-[0.8vw] mb-[0.7vh]">
                    {breakdown.map(({ h, n, c }) => (
                      <div key={h} className="flex items-center gap-[0.4vw]">
                        <span className="w-[0.7vw] h-[0.7vw] rounded-sm inline-block" style={{ background: c }} />
                        <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#c4b5fd" }}>{h}: {n}</span>
                      </div>
                    ))}
                  </div>
                  {sites3h && (
                    <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#2dd4bf", marginBottom: "0.3vh" }}>
                      3h sites: {sites3h}
                    </div>
                  )}
                  <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#fbbf24" }}>
                    1h sites: {sites1h}
                  </div>
                </div>
              ))}

              <div className="rounded-xl px-[1.5vw] py-[1vh]" style={{ background: "#7c3aed22", border: "1px solid #7c3aed" }}>
                <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#c4b5fd", marginBottom: "0.4vh" }}>
                  Recommended Actions for S9 Preparedness
                </div>
                <div className="grid grid-cols-2 gap-[0.6vw]">
                  {[
                    "Ensure all batteries are fully charged before peak Hajj days",
                    "Prioritize battery maintenance at 1-hour sites (12 sites)",
                    "Deploy technicians pre-positioned near 1-hour backup sites",
                    "Establish generator standby protocol for rapid S9 response",
                  ].map((action, i) => (
                    <div key={i} className="flex gap-[0.5vw]">
                      <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#a78bfa" }}>›</span>
                      <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#ddd6fe" }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2.5vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#7c3aed" }}>
          Source: DB col "Batteries Strings MAX useful Time Hours" · All sites ≥ 1h currently SAFE
        </div>
      </div>
    </div>
  );
}
