export default function Slide05PrimePowerSites2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Prime Power Risk — Site Detail (continued)</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>7 Additional Sites — Generator Action Required</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]">
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
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN001</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Arafat</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Outdoor / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Add backup generator (min 35 KVA)</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN998</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Makkah Remote</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Outdoor / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Add backup generator (min 45 KVA)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN967</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Makkah Remote</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Outdoor / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Add backup generator (min 25 KVA)</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN994</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Mina</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Outdoor / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Add backup generator (min 25 KVA)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN021</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Muzdalifah</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Shelter / SB</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>Backup Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−0.32</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Upgrade backup gen to 30 KVA</td>
            </tr>
            <tr style={{ background: "#f9f5ff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN002</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Mina</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>None (SG)</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>0.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>15.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.00</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Add backup generator (min 35 KVA)</td>
            </tr>
            <tr style={{ background: "#fff" }}>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", fontWeight: 700, color: "#1a0a2e" }}>CWN081</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Makkah Remote</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Shelter / SG</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>Prime Gen</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>17.4</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", color: "#374151" }}>12.0</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>−1.43</td>
              <td style={{ fontSize: "1.1vw", padding: "1.1vh 0.8vw", color: "#374151" }}>Upgrade to 35 KVA or add SEC feed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[3vh] left-[6vw] right-[6vw] rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff3cd", border: "1px solid #d97706" }}>
        <div className="text-[1.2vw] font-bold" style={{ color: "#92400e", fontFamily: "Verdana, sans-serif" }}>Total Action: 15 sites require backup generator addition or KVA upgrade before Hajj season</div>
        <div className="text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
      </div>
    </div>
  );
}
