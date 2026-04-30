const V = "Verdana, sans-serif";

export default function Slide02PrimeOnly() {
  const sgSites = [
    { id: "CWN001", loc: "Arafat",      type: "SG", prime: 20.88, load: 17.00, ac: 0.71, chg: 1.68, margin_s4: 1.49 },
    { id: "CWN022", loc: "Arafat",      type: "SG", prime: 24.36, load: 15.00, ac: 6.68, chg: 1.52, margin_s4: 1.17 },
    { id: "CWN038", loc: "Arafat",      type: "SG", prime: 31.32, load: 17.00, ac: 6.68, chg: 1.84, margin_s4: 5.80 },
    { id: "CWN050", loc: "Arafat",      type: "SG", prime: 24.36, load: 15.00, ac: 6.68, chg: 1.54, margin_s4: 1.15 },
    { id: "CWN076", loc: "Arafat",      type: "SG", prime: 20.88, load: 12.00, ac: 5.00, chg: 1.44, margin_s4: 2.44 },
    { id: "CWN083", loc: "Arafat",      type: "SG", prime: 24.36, load: 12.00, ac: 5.00, chg: 1.44, margin_s4: 5.92 },
    { id: "CWN092", loc: "Arafat",      type: "SG", prime: 31.32, load: 15.00, ac: 5.00, chg: 1.52, margin_s4: 9.80 },
    { id: "CWN996", loc: "Arafat",      type: "SG", prime: 13.92, load: 17.00, ac: 0.71, chg: 1.60, margin_s4: -5.39 },
    { id: "CWN080", loc: "Arafat",      type: "DG", prime: 24.36, load: 17.00, ac: 5.00, chg: 1.73, margin_s4: 0.63 },
    { id: "CWN923", loc: "Arafat",      type: "DG", prime: 24.36, load: 17.00, ac: 5.00, chg: 1.76, margin_s4: 0.60 },
    { id: "CWN081", loc: "Makkah Rem.", type: "SG", prime: 20.88, load: 12.00, ac: 5.00, chg: 2.56, margin_s4: 1.32 },
    { id: "CWN967", loc: "Makkah Rem.", type: "SG", prime: 17.40, load: 12.00, ac: 0.71, chg: 2.64, margin_s4: 2.05 },
    { id: "CWN998", loc: "Makkah Rem.", type: "SG", prime: 31.32, load: 17.00, ac: 0.71, chg: 2.40, margin_s4: 11.21 },
    { id: "CWN002", loc: "Mina",        type: "SG", prime: 24.36, load: 15.00, ac: 5.00, chg: 1.54, margin_s4: 2.82 },
    { id: "CWN777", loc: "Mina",        type: "SG", prime: 20.88, load: 12.00, ac: 5.00, chg: 1.28, margin_s4: 2.60 },
    { id: "CWN907", loc: "Mina",        type: "SG", prime: 17.40, load: 15.00, ac: 0.71, chg: 1.44, margin_s4: 0.25 },
    { id: "CWN970", loc: "Mina",        type: "SG", prime: 13.92, load: 15.00, ac: 0.71, chg: 1.44, margin_s4: -3.23 },
    { id: "CWN994", loc: "Mina",        type: "SG", prime: 24.36, load: 12.00, ac: 0.71, chg: 1.20, margin_s4: 10.45 },
    { id: "CWN062", loc: "Muzdalifah",  type: "SG", prime: 24.36, load: 17.00, ac: 5.00, chg: 1.73, margin_s4: 0.63 },
    { id: "CWN099", loc: "Muzdalifah",  type: "SG", prime: 31.32, load: 17.00, ac: 5.00, chg: 1.68, margin_s4: 7.64 },
    { id: "CWN101", loc: "Muzdalifah",  type: "SG", prime: 31.32, load: 17.00, ac: 5.00, chg: 1.84, margin_s4: 7.48 },
    { id: "CWN206", loc: "Muzdalifah",  type: "SG", prime: 24.36, load: 15.00, ac: 0.71, chg: 1.92, margin_s4: 6.73 },
    { id: "CWN208", loc: "Muzdalifah",  type: "SG", prime: 24.36, load: 17.00, ac: 0.71, chg: 1.68, margin_s4: 4.97 },
    { id: "CWN915", loc: "Muzdalifah",  type: "SG", prime: 24.36, load: 15.00, ac: 6.68, chg: 1.52, margin_s4: 1.17 },
  ];

  const atRiskPrime = sgSites.filter(s => s.margin_s4 < 0);

  const TH: React.CSSProperties = {
    fontFamily: V, fontSize: "1.0vw", fontWeight: "bold", lineHeight: 1.2,
    textTransform: "uppercase", letterSpacing: "0.04em",
    paddingBottom: "0.4vh", borderBottom: "2px solid #d1d5db",
    color: "#6b7280", textAlign: "left",
  };
  const TH_R: React.CSSProperties = { ...TH, textAlign: "right" };
  const TH_C: React.CSSProperties = { ...TH, textAlign: "center" };

  const TD: React.CSSProperties = {
    fontFamily: V, fontSize: "1.0vw", lineHeight: 1.2,
    paddingTop: "0.15vh", paddingBottom: "0.15vh",
    borderBottom: "1px solid #f3f4f6", color: "#374151",
  };
  const TD_R: React.CSSProperties = { ...TD, textAlign: "right" };
  const TD_C: React.CSSProperties = { ...TD, textAlign: "center" };

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
        <div className="flex items-baseline gap-[1.5vw] mb-[0.4vh]">
          <div style={{ fontFamily: V, fontSize: "2.8vw", fontWeight: "bold", color: "#1a0a2e" }}>
            Power Supply Risk
          </div>
          <div style={{ fontFamily: V, fontSize: "1.8vw", fontWeight: "bold", color: "#6b21c8" }}>
            Prime Only (SG / DG Sites)
          </div>
        </div>
        <div style={{ fontFamily: V, fontSize: "1.15vw", color: "#6b7280" }}>
          24 single-generator sites (22 SG + 2 DG) · Scenarios S1–S8 · 46°C · No backup power source
        </div>
      </div>

      <div className="absolute top-[18vh] bottom-[5vh] left-[4vw] right-[3vw] flex gap-[2vw]">

        <div style={{ width: "42%" }}>
          <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: "#6b21c8" }}>
            <div className="px-[1.5vw] py-[1vh] flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#4a0e8f,#6b21c8)" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "white" }}>S1–S4 · Prime Generator</div>
              <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "8px", padding: "0.3vh 1vw" }}>
                2 AT RISK
              </div>
            </div>
            <div className="bg-white px-[1.5vw] py-[1vh]">
              <div className="rounded-lg px-[1.2vw] py-[0.8vh] mb-[0.8vh]"
                style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#991b1b" }}>
                  Sites with negative power margin (S4 worst-case):
                </div>
                {atRiskPrime.map(s => (
                  <div key={s.id} className="flex justify-between mt-[0.5vh]">
                    <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#6b21c8" }}>{s.id}</span>
                    <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#374151" }}>{s.loc}</span>
                    <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#dc2626" }}>{s.margin_s4.toFixed(2)} kW</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg px-[1.2vw] py-[0.8vh]"
                style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#166534" }}>
                  22 of 24 sites: SAFE on prime power · Min safe margin: +0.25 kW (CWN907)
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border-2 mt-[1.5vh]" style={{ borderColor: "#E8175D" }}>
            <div className="px-[1.5vw] py-[1vh] flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "white" }}>S5–S8 · Backup Scenarios</div>
              <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", background: "#E8175D", color: "white", borderRadius: "8px", padding: "0.3vh 1vw" }}>
                ALL 24 AT RISK
              </div>
            </div>
            <div className="bg-white px-[1.5vw] py-[1vh]">
              <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#374151" }}>
                SG/DG sites operate from a <strong>single generator</strong> with no backup power source.
                In S5–S8, when the prime generator is simulated offline, available power drops to
                <strong> 0 kW</strong> — all 24 sites enter power risk state.
              </div>
              <div className="mt-[0.8vh] rounded-lg px-[1.2vw] py-[0.7vh]"
                style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                <div style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#991b1b" }}>
                  Action: Generator redundancy or automatic UPS bridging to protect against single-point failure
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[0.8vw] mt-[0.8vh]">
                {(["Arafat","Makkah Rem.","Mina","Muzdalifah"] as const).map(loc => {
                  const count = sgSites.filter(s => s.loc === loc).length;
                  return count > 0 ? (
                    <div key={loc} className="rounded-lg px-[1vw] py-[0.5vh] flex items-center justify-between"
                      style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                      <span style={{ fontFamily: V, fontSize: "1.1vw", color: "#374151" }}>{loc}</span>
                      <span style={{ fontFamily: V, fontSize: "1.1vw", fontWeight: "bold", color: "#dc2626" }}>{count} sites</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "58%" }}>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
            <div style={{ background: "#f5f3ff", padding: "0.8vh 1.5vw" }}>
              <div style={{ fontFamily: V, fontSize: "1.2vw", fontWeight: "bold", color: "#4a0e8f" }}>
                All 24 SG/DG Sites — Prime Power Margin (S4 Worst-Case)
              </div>
            </div>
            <div style={{ background: "white", padding: "0.4vh 1.5vw", maxHeight: "72vh", overflow: "hidden" }}>
              <table className="w-full" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width: "22%" }}>Site</th>
                    <th style={{ ...TH, width: "26%" }}>Location</th>
                    <th style={{ ...TH_C, width: "12%" }}>Type</th>
                    <th style={{ ...TH_R, width: "14%" }}>Prime (kW)</th>
                    <th style={{ ...TH_R, width: "14%" }}>Load (kW)</th>
                    <th style={{ ...TH_R, width: "12%" }}>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {sgSites.map(s => (
                    <tr key={s.id} style={{ background: s.margin_s4 < 0 ? "#fff1f2" : "white" }}>
                      <td style={{ ...TD, fontWeight: "bold", color: "#6b21c8" }}>{s.id}</td>
                      <td style={TD}>{s.loc}</td>
                      <td style={TD_C}>
                        <span style={{ fontFamily: V, fontSize: "1.05vw", fontWeight: "bold", background: s.type === "DG" ? "#fef9c3" : "#f5f3ff", color: "#4a0e8f", borderRadius: "4px", padding: "0 0.4vw" }}>
                          {s.type}
                        </span>
                      </td>
                      <td style={TD_R}>{s.prime.toFixed(2)}</td>
                      <td style={TD_R}>{(s.load + s.ac + s.chg).toFixed(2)}</td>
                      <td style={{ ...TD_R, fontWeight: "bold", color: s.margin_s4 < 0 ? "#dc2626" : "#059669" }}>
                        {s.margin_s4 > 0 ? "+" : ""}{s.margin_s4.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[1.5vh] left-[4vw] right-[3vw]">
        <div style={{ fontFamily: V, fontSize: "1.1vw", color: "#6b7280" }}>
          Load = Telecom + AC1 + AC2 + Battery Charging (S4 worst-case) · 46°C
        </div>
      </div>
    </div>
  );
}
