const V = "Verdana, sans-serif";

export default function Slide01PrimePlusBackup() {
  const atRiskBackup = [
    { id: "CWN901", loc: "Arafat",     backup: 17.40, load: 17.00, ac: 0.71, chg: 1.68, margin: -1.99 },
    { id: "CWN021", loc: "Muzdalifah", backup: 17.40, load: 12.00, ac: 5.00, chg: 1.92, margin: -1.52 },
    { id: "CWN089", loc: "Muzdalifah", backup: 17.40, load: 12.00, ac: 5.00, chg: 1.20, margin: -0.80 },
  ];

  const locationSb: Record<string, number> = {
    "Arafat": 29, "Muzdalifah": 22, "Mina": 6,
  };

  const COL_HDR: React.CSSProperties = {
    fontFamily: V, fontSize: "1.15vw", fontWeight: "bold",
    textTransform: "uppercase", letterSpacing: "0.05em",
    paddingBottom: "0.8vh", borderBottom: "2px solid #E8175D",
    color: "#6b7280", textAlign: "left",
  };
  const COL_HDR_R: React.CSSProperties = { ...COL_HDR, textAlign: "right" };

  const CELL: React.CSSProperties = {
    fontFamily: V, fontSize: "1.15vw",
    paddingTop: "0.6vh", paddingBottom: "0.6vh",
    borderBottom: "1px solid #f3f4f6", color: "#374151",
  };
  const CELL_R: React.CSSProperties = { ...CELL, textAlign: "right" };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>

      <div className="absolute top-0 left-0 w-[0.7vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />

      <div className="absolute top-[2.5vh] right-[3vw] flex items-center gap-[1.5vw]">
        <div style={{ fontFamily: V, fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em", textTransform: "uppercase" }}>stc</div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>

      <div className="absolute top-[2.5vh] left-[4vw]">
        <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9333ea" }}>
          Hajj 1447 · COW Risk Assessment · S1–S8
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div className="flex items-baseline gap-[1.5vw] mb-[0.5vh]">
          <div style={{ fontFamily: V, fontSize: "2.8vw", fontWeight: "bold", color: "#1a0a2e" }}>
            Power Supply Risk
          </div>
          <div style={{ fontFamily: V, fontSize: "1.8vw", fontWeight: "bold", color: "#6b21c8" }}>
            Prime + Backup (SB Sites)
          </div>
        </div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#6b7280" }}>
          55 SEC-primary sites with Diesel Generator backup · Scenarios S1–S8 · 46°C · Excluding S9
        </div>
      </div>

      <div className="absolute top-[19vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div className="flex-1">
          <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: "#6b21c8" }}>
            <div className="px-[1.5vw] py-[1.2vh] flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
              <div style={{ fontFamily: V, fontSize: "1.25vw", fontWeight: "bold", color: "white" }}>S1–S4 · Prime Power (SEC)</div>
              <div className="flex items-center gap-[1vw]">
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "999px", padding: "0.2vh 1.2vw" }}>
                  55 sites assessed
                </div>
                <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", background: "#00BFB3", color: "white", borderRadius: "8px", padding: "0.4vh 1.2vw" }}>
                  ALL SAFE
                </div>
              </div>
            </div>
            <div className="px-[1.5vw] py-[1.5vh] bg-white">
              <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#374151", marginBottom: "1vh" }}>
                SEC primary capacity (≈31.3 kW net) comfortably covers worst-case full-traffic load
                including battery charging (S3, S4). All 55 sites show positive power margin.
              </div>
              <div className="grid grid-cols-3 gap-[1vw] mt-[1.2vh]">
                {Object.entries(locationSb).map(([loc, count]) => (
                  <div key={loc} className="rounded-lg px-[1vw] py-[0.8vh] text-center"
                    style={{ background: "#f0fdf4", border: "1px solid #00BFB3" }}>
                    <div style={{ fontFamily: V, fontSize: "1.6vw", fontWeight: "bold", color: "#00BFB3" }}>{count}</div>
                    <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#374151" }}>{loc}</div>
                    <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b7280" }}>SAFE</div>
                  </div>
                ))}
              </div>
              <div className="mt-[1.2vh] rounded-lg px-[1.5vw] py-[0.8vh] flex items-center gap-[1vw]"
                style={{ background: "#f5f3ff", border: "1px solid #c4b5fd" }}>
                <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b21c8" }}>
                  Min margin: <strong>+0.60 kW</strong> (CWN923, Arafat) ·
                  Max margin: <strong>+40.8 kW</strong> (CWN093, Arafat)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: "#E8175D" }}>
            <div className="px-[1.5vw] py-[1.2vh] flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#991b1b,#dc2626)" }}>
              <div style={{ fontFamily: V, fontSize: "1.25vw", fontWeight: "bold", color: "white" }}>S5–S8 · Backup Generator</div>
              <div className="flex items-center gap-[1vw]">
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "999px", padding: "0.2vh 1.2vw" }}>
                  55 sites assessed
                </div>
                <div style={{ fontFamily: V, fontSize: "1.15vw", fontWeight: "bold", background: "#E8175D", color: "white", borderRadius: "8px", padding: "0.4vh 1.2vw" }}>
                  3 AT RISK
                </div>
              </div>
            </div>
            <div className="px-[1.5vw] pt-[1.2vh] pb-[1vh] bg-white">
              <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#374151", marginBottom: "1vh" }}>
                Backup generator capacity insufficient to cover full charging + AC load (S8 worst-case).
                52 of 55 sites remain safe on backup.
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={COL_HDR}>Site</th>
                    <th style={COL_HDR}>Location</th>
                    <th style={COL_HDR_R}>Backup Net (kW)</th>
                    <th style={COL_HDR_R}>Total Load (kW)</th>
                    <th style={COL_HDR_R}>Margin (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskBackup.map((s) => {
                    const totalLoad = s.load + s.ac + s.chg;
                    return (
                      <tr key={s.id}>
                        <td style={{ ...CELL, fontWeight: "bold", color: "#6b21c8" }}>{s.id}</td>
                        <td style={CELL}>{s.loc}</td>
                        <td style={CELL_R}>{s.backup.toFixed(2)}</td>
                        <td style={CELL_R}>{totalLoad.toFixed(2)}</td>
                        <td style={{ ...CELL_R, fontWeight: "bold", color: "#dc2626" }}>
                          {s.margin.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-[1vh] rounded-lg px-[1.5vw] py-[0.8vh]"
                style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#991b1b" }}>
                  Action: Upgrade backup generator capacity at CWN901, CWN021, CWN089 to cover worst-case S8 load
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[3vh] left-[4vw] right-[3vw] flex items-center justify-between">
        <div className="flex items-center gap-[2vw]">
          <span className="flex items-center gap-[0.5vw]">
            <span className="w-[0.8vw] h-[0.8vw] rounded-full inline-block" style={{ background: "#00BFB3" }} />
            <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b7280" }}>Safe (52 sites)</span>
          </span>
          <span className="flex items-center gap-[0.5vw]">
            <span className="w-[0.8vw] h-[0.8vw] rounded-full inline-block" style={{ background: "#E8175D" }} />
            <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b7280" }}>At Risk (3 sites)</span>
          </span>
          <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#9ca3af" }}>· Load = Telecom + AC1 + AC2 + Battery Charging · Temp 46°C</span>
        </div>
        <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#6b21c8" }}>Slide 2 / 4</div>
      </div>
    </div>
  );
}
