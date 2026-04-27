export default function Slide07RectifierSites() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Rectifier Risk — Site Detail</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>12 Sites Requiring Rectifier Upgrade</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]">
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Site ID</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Location</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Type</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Rect kW</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Telecom kW</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Scenario</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Margin kW</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Required Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN076</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#d97706", fontWeight: 700 }}>S3</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−0.36</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 19.2 kW</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN073</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>16.2</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>17.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#dc2626", fontWeight: 700 }}>S1</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−0.80</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 21.6 kW</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN093</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#dc2626", fontWeight: 700 }}>S1</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>0.00</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 19.2 kW (zero margin)</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN036</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>16.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#d97706", fontWeight: 700 }}>S3</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.28</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 21.6 kW</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN101</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Muzdalifah</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>19.2</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>17.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#d97706", fontWeight: 700 }}>S3</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−0.20</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 24.3 kW</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN104</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Muzdalifah</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#dc2626", fontWeight: 700 }}>S1</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>0.00</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade rectifier to 19.2 kW (zero margin)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN214 / CWN318 / CWN972 / CWN001 / CWN032 / CWN961</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Mixed</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Outdoor / SB</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15–18</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#374151" }}>15–17</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", color: "#d97706", fontWeight: 700 }}>S3</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−2.0 to −0.82</td>
              <td style={{ fontSize: "1.05vw", padding: "0.9vh 0.8vw", color: "#374151" }}>Upgrade each rectifier to ≥ 24 kW</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[3vh] left-[6vw] right-[6vw] rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff3cd", border: "1px solid #d97706" }}>
        <div className="text-[1.2vw] font-bold" style={{ color: "#92400e", fontFamily: "Verdana, sans-serif" }}>Total Action: 12 sites — rectifier replacement or parallel module addition to achieve positive margin in S1 and S3</div>
        <div className="text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
      </div>
    </div>
  );
}
