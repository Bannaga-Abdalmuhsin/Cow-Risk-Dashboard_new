export default function Slide13ActionPriority() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Consolidated Action Summary</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Prioritized Action Register</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>All actions required before Hajj 1447 · Ordered by severity and impact</div>
      </div>
      <div className="absolute top-[21vh] left-[6vw] right-[6vw]">
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 1vw", textAlign: "center", width: "8%" }}>Priority</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 1vw", textAlign: "left", width: "22%" }}>Action Category</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 1vw", textAlign: "center", width: "10%" }}>Sites</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 1vw", textAlign: "left", width: "35%" }}>Action Required</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 1vw", textAlign: "left", width: "25%" }}>Key Sites</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fef2f2" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center" }}>
                <span style={{ background: "#dc2626", color: "#fff", fontWeight: 700, padding: "0.3vh 0.8vw", borderRadius: "4px", fontSize: "1.1vw", fontFamily: "Verdana, sans-serif" }}>P1</span>
              </td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Add Backup Generator (SG sites)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>11</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>Procure and install backup generators (25–45 KVA) — no backup power currently available for S5–S8</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>CWN076, 083, 050, 101, 001, 998, 967, 994, 021, 002, 081</td>
            </tr>
            <tr style={{ background: "#fff8f1" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center" }}>
                <span style={{ background: "#d97706", color: "#fff", fontWeight: 700, padding: "0.3vh 0.8vw", borderRadius: "4px", fontSize: "1.1vw", fontFamily: "Verdana, sans-serif" }}>P2</span>
              </td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", fontWeight: 700, color: "#d97706", fontFamily: "Verdana, sans-serif" }}>Upgrade Backup Generator (SB sites)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center", fontWeight: 700, color: "#d97706", fontFamily: "Verdana, sans-serif" }}>4</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>Replace 25 KVA backup generator with 30–35 KVA unit — current KVA insufficient for S7/S8 combined load</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>CWN105, CWN108, CWN089, CWN021</td>
            </tr>
            <tr style={{ background: "#fef9ee" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center" }}>
                <span style={{ background: "#ca8a04", color: "#fff", fontWeight: 700, padding: "0.3vh 0.8vw", borderRadius: "4px", fontSize: "1.1vw", fontFamily: "Verdana, sans-serif" }}>P3</span>
              </td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", fontWeight: 700, color: "#ca8a04", fontFamily: "Verdana, sans-serif" }}>Rectifier Upgrade</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center", fontWeight: 700, color: "#ca8a04", fontFamily: "Verdana, sans-serif" }}>12</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>Replace or add parallel rectifier modules to achieve net kW above telecom load + battery charging in S1/S3</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>CWN073, 036, 032, 214, 318, 972, 961 + 5 more</td>
            </tr>
            <tr style={{ background: "#f0fdf4" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center" }}>
                <span style={{ background: "#0d9488", color: "#fff", fontWeight: 700, padding: "0.3vh 0.8vw", borderRadius: "4px", fontSize: "1.1vw", fontFamily: "Verdana, sans-serif" }}>P4</span>
              </td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", fontWeight: 700, color: "#0d9488", fontFamily: "Verdana, sans-serif" }}>Battery String Addition — Critical</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center", fontWeight: 700, color: "#0d9488", fontFamily: "Verdana, sans-serif" }}>5</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>Sites below 1 hr backup — add 8–10 strings immediately (CWN050, 967, 021, 074, 066, 089, 997)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>CWN050, CWN967, CWN021, CWN997, CWN074</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center" }}>
                <span style={{ background: "#9333ea", color: "#fff", fontWeight: 700, padding: "0.3vh 0.8vw", borderRadius: "4px", fontSize: "1.1vw", fontFamily: "Verdana, sans-serif" }}>P5</span>
              </td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", fontWeight: 700, color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Battery String Addition — Fleet-Wide</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", textAlign: "center", fontWeight: 700, color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>58</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>All remaining sites: add 3–9 additional 200 Ah strings per site to reach 4-hour minimum backup target</td>
              <td style={{ fontSize: "1.1vw", padding: "1.2vh 1vw", color: "#374151", fontFamily: "Verdana, sans-serif" }}>All 63 sites — see battery detail slides</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
