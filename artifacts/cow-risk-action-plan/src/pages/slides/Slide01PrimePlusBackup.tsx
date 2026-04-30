export default function Slide01PrimePlusBackup() {
  const atRiskBackup = [
    { id: "CWN901", loc: "Arafat",     backup: 17.40, load: 17.00, ac: 0.71, chg: 1.68, margin: -1.99 },
    { id: "CWN021", loc: "Muzdalifah", backup: 17.40, load: 12.00, ac: 5.00, chg: 1.92, margin: -1.52 },
    { id: "CWN089", loc: "Muzdalifah", backup: 17.40, load: 12.00, ac: 5.00, chg: 1.20, margin: -0.80 },
  ];

  const locationSb: Record<string, number> = {
    "Arafat": 29, "Muzdalifah": 22, "Mina": 6,
  };

  const COL_HDR = "text-[1.1vw] font-bold uppercase tracking-wider pb-[1vh] border-b-2";
  const CELL = "text-[1.05vw] py-[0.7vh] border-b border-gray-100";

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: "Verdana,sans-serif" }}>

      <div className="absolute top-0 left-0 w-[0.7vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />

      <div className="absolute top-[2.5vh] right-[3vw] flex items-center gap-[1.5vw]">
        <div className="text-[1.2vw] font-bold tracking-widest uppercase" style={{ color: "#6b21c8" }}>stc</div>
        <div className="text-[0.9vw] font-bold" style={{ color: "#9333ea" }}>ACES MSD</div>
      </div>

      <div className="absolute top-[2.5vh] left-[4vw]">
        <div className="text-[1vw] font-bold uppercase tracking-widest" style={{ color: "#9333ea" }}>
          Hajj 1447 · COW Risk Assessment · S1–S8
        </div>
      </div>

      <div className="absolute top-[8vh] left-[4vw] right-[3vw]">
        <div className="flex items-baseline gap-[1.5vw] mb-[0.5vh]">
          <div className="text-[2.8vw] font-bold leading-tight" style={{ color: "#1a0a2e" }}>
            Power Supply Risk
          </div>
          <div className="text-[1.8vw] font-bold" style={{ color: "#6b21c8" }}>
            Prime + Backup (SB Sites)
          </div>
        </div>
        <div className="text-[1.1vw]" style={{ color: "#6b7280" }}>
          55 SEC-primary sites with Diesel Generator backup · Scenarios S1–S8 · 46°C · Excluding S9
        </div>
      </div>

      <div className="absolute top-[19vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div className="flex-1">
          <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: "#6b21c8" }}>
            <div className="px-[1.5vw] py-[1.2vh] flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
              <div className="text-white font-bold text-[1.2vw]">S1–S4 · Prime Power (SEC)</div>
              <div className="flex items-center gap-[1vw]">
                <div className="text-[0.9vw] font-bold rounded-full px-[1.2vw] py-[0.3vh] bg-white/20 text-white">
                  55 sites assessed
                </div>
                <div className="rounded-lg px-[1.2vw] py-[0.5vh] font-bold text-[1.1vw]"
                  style={{ background: "#00BFB3", color: "white" }}>
                  ALL SAFE
                </div>
              </div>
            </div>
            <div className="px-[1.5vw] py-[1.5vh] bg-white">
              <div className="text-[1.05vw] mb-[1vh]" style={{ color: "#374151" }}>
                SEC primary capacity (≈31.3 kW net) comfortably covers worst-case full-traffic load
                including battery charging (S3, S4). All 55 sites show positive power margin.
              </div>
              <div className="grid grid-cols-3 gap-[1vw] mt-[1.2vh]">
                {Object.entries(locationSb).map(([loc, count]) => (
                  <div key={loc} className="rounded-lg px-[1vw] py-[0.8vh] text-center"
                    style={{ background: "#f0fdf4", border: "1px solid #00BFB3" }}>
                    <div className="text-[1.5vw] font-bold" style={{ color: "#00BFB3" }}>{count}</div>
                    <div className="text-[0.85vw] font-bold" style={{ color: "#374151" }}>{loc}</div>
                    <div className="text-[0.75vw]" style={{ color: "#6b7280" }}>SAFE</div>
                  </div>
                ))}
              </div>
              <div className="mt-[1.2vh] rounded-lg px-[1.5vw] py-[0.8vh] flex items-center gap-[1vw]"
                style={{ background: "#f5f3ff", border: "1px solid #c4b5fd" }}>
                <div className="text-[1vw]" style={{ color: "#6b21c8" }}>
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
              <div className="text-white font-bold text-[1.2vw]">S5–S8 · Backup Generator</div>
              <div className="flex items-center gap-[1vw]">
                <div className="text-[0.9vw] font-bold rounded-full px-[1.2vw] py-[0.3vh] bg-white/20 text-white">
                  55 sites assessed
                </div>
                <div className="rounded-lg px-[1.2vw] py-[0.5vh] font-bold text-[1.1vw]"
                  style={{ background: "#E8175D", color: "white" }}>
                  3 AT RISK
                </div>
              </div>
            </div>
            <div className="px-[1.5vw] pt-[1.2vh] pb-[1vh] bg-white">
              <div className="text-[1.05vw] mb-[1vh]" style={{ color: "#374151" }}>
                Backup generator capacity insufficient to cover full charging + AC load (S8 worst-case).
                52 of 55 sites remain safe on backup.
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ color: "#6b7280" }}>
                    <th className={`${COL_HDR} text-left`} style={{ borderColor: "#E8175D" }}>Site</th>
                    <th className={`${COL_HDR} text-left`} style={{ borderColor: "#E8175D" }}>Location</th>
                    <th className={`${COL_HDR} text-right`} style={{ borderColor: "#E8175D" }}>Backup Net (kW)</th>
                    <th className={`${COL_HDR} text-right`} style={{ borderColor: "#E8175D" }}>Total Load (kW)</th>
                    <th className={`${COL_HDR} text-right`} style={{ borderColor: "#E8175D" }}>Margin (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskBackup.map((s) => {
                    const totalLoad = s.load + s.ac + s.chg;
                    return (
                      <tr key={s.id}>
                        <td className={`${CELL} text-left font-mono font-bold`} style={{ color: "#6b21c8" }}>{s.id}</td>
                        <td className={`${CELL} text-left`} style={{ color: "#374151" }}>{s.loc}</td>
                        <td className={`${CELL} text-right`} style={{ color: "#374151" }}>{s.backup.toFixed(2)}</td>
                        <td className={`${CELL} text-right`} style={{ color: "#374151" }}>{totalLoad.toFixed(2)}</td>
                        <td className={`${CELL} text-right font-bold`} style={{ color: "#dc2626" }}>
                          {s.margin.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-[1vh] rounded-lg px-[1.5vw] py-[0.7vh]"
                style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                <div className="text-[0.95vw] font-bold" style={{ color: "#991b1b" }}>
                  Action: Upgrade backup generator capacity at CWN901, CWN021, CWN089 to cover worst-case S8 load
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[3vh] left-[4vw] right-[3vw] flex items-center justify-between">
        <div className="flex items-center gap-[2vw] text-[0.9vw]" style={{ color: "#6b7280" }}>
          <span className="flex items-center gap-[0.5vw]">
            <span className="w-[0.8vw] h-[0.8vw] rounded-full inline-block" style={{ background: "#00BFB3" }} />
            Safe (52 sites)
          </span>
          <span className="flex items-center gap-[0.5vw]">
            <span className="w-[0.8vw] h-[0.8vw] rounded-full inline-block" style={{ background: "#E8175D" }} />
            At Risk (3 sites)
          </span>
          <span style={{ color: "#9ca3af" }}>· Load = Telecom + AC1 + AC2 + Battery Charging · Temp 46°C</span>
        </div>
        <div className="text-[0.9vw] font-bold" style={{ color: "#6b21c8" }}>Slide 1 / 3</div>
      </div>
    </div>
  );
}
