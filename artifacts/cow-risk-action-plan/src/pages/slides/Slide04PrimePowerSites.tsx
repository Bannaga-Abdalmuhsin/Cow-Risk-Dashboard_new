export default function Slide04PrimePowerSites() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Prime Power Risk — Site Detail</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>15 Sites Requiring Generator Upgrade</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Site ID</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Location</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Type</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Power Src</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Source kW</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Load kW</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "center" }}>Margin kW</th>
              <th style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, padding: "1.2vh 0.8vw", textAlign: "left" }}>Required Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN105</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>Backup Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.04</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Upgrade backup gen to 35 KVA</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN076</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Add backup generator (min 25 KVA)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN108</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>Backup Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.04</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Upgrade backup gen to 35 KVA</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN083</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Add backup generator (min 25 KVA)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN050</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Add backup generator (min 35 KVA)</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN777</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Mina</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>Prime Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.04</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Upgrade to 35 KVA or add SEC feed</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN101</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Muzdalifah</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Add backup generator (min 45 KVA)</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN089</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Muzdalifah</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>Backup Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−0.56</td>
              <td style={{ fontSize: "1.1vw", padding: "1vh 0.8vw", color: "#374151" }}>Upgrade backup gen to 30 KVA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[4vh] left-[6vw] right-[6vw] flex justify-between items-center">
        <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>* 7 additional sites on next slide (CWN001, CWN998, CWN967, CWN994, CWN021, CWN002, CWN081)</div>
        <div className="text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
      </div>
    </div>
  );
}
