export default function Slide09BatterySites1() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Battery Backup — Arafat Sites (1 of 3)</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Arafat Region — 22 Sites · Additional Battery Strings Required</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]">
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "left" }}>Site ID</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Type</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Strings</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Ah/Str</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Load kW</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Backup hrs</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "center" }}>Deficit hrs</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["CWN105","SB","3","200","12.0","1.25","2.75","Add 7 strings (200 Ah each)"],
              ["CWN991","SB","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN076","SG","7","200","12.0","2.92","1.08","Add 3 strings"],
              ["CWN108","SB","3","200","12.0","1.25","2.75","Add 7 strings (200 Ah each)"],
              ["CWN087","SB","4","190","12.0","1.58","2.42","Add 6 strings"],
              ["CWN075","SB","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN072","SB","5","295","12.0","3.07","0.93","Add 3 strings (295 Ah)"],
              ["CWN078","SB","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN084","SB","4","200","15.0","1.33","2.67","Add 7 strings"],
              ["CWN085","SB","4","190","12.0","1.58","2.42","Add 6 strings"],
              ["CWN073","SB","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN093","SB","8","200","15.0","2.67","1.33","Add 4 strings"],
            ].map(([id, ps, str, ah, load, hrs, def, action], i) => (
              <tr key={id} style={{ background: i % 2 === 0 ? "#fff" : "#f9f5ff" }}>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", fontWeight: 700, color: "#1a0a2e" }}>{id}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", color: "#374151" }}>{ps}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", color: "#374151" }}>{str}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", color: "#374151" }}>{ah}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", color: "#374151" }}>{load}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", fontWeight: 700, color: parseFloat(hrs) < 1 ? "#dc2626" : parseFloat(hrs) < 2 ? "#d97706" : "#ca8a04" }}>{hrs}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>{def}</td>
                <td style={{ fontSize: "1.05vw", padding: "0.7vh 0.6vw", color: "#374151" }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447 · Page 1 of 3</div>
    </div>
  );
}
