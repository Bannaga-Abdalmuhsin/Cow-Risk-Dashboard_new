export default function Slide10BatterySites2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Battery Backup — Arafat Outdoor + Muzdalifah (2 of 3)</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Arafat Outdoor & Muzdalifah — 22 Sites</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]">
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "left" }}>Site ID</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.6vw", textAlign: "left" }}>Region</th>
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
              ["CWN102","Arafat","8","200","15.0","2.67","1.33","Add 4 strings"],
              ["CWN956","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN980","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN951","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN020","Arafat Out.","4","200","15.0","1.33","2.67","Add 7 strings"],
              ["CWN203","Arafat Out.","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN914","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN015","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN212","Arafat Out.","4","200","15.0","1.33","2.67","Add 7 strings"],
              ["CWN960","Arafat Out.","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN984","Arafat Out.","4","190","12.0","1.58","2.42","Add 6 strings"],
              ["CWN906","Arafat Out.","4","190","15.0","1.27","2.73","Add 7 strings"],
              ["CWN903","Arafat Out.","4","200","15.0","1.33","2.67","Add 7 strings"],
              ["CWN992","Muzdalifah","4","190","12.0","1.58","2.42","Add 6 strings"],
              ["CWN074","Muzdalifah","2","200","12.0","0.83","3.17","Add 8 strings (critical)"],
              ["CWN068","Muzdalifah","3","200","15.0","1.00","3.00","Add 8 strings"],
              ["CWN089","Muzdalifah","2","200","12.0","0.83","3.17","Add 8 strings (critical)"],
              ["CWN079","Muzdalifah","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN104","Muzdalifah","3","200","15.0","1.00","3.00","Add 8 strings"],
              ["CWN066","Muzdalifah","2","200","12.0","0.83","3.17","Add 8 strings (critical)"],
              ["CWN021","Muzdalifah","3","100","12.0","0.63","3.37","Add 10 strings — CRITICAL"],
              ["CWN001","Arafat Out.","4","200","17.0","1.18","2.82","Add 8 strings"],
            ].map(([id, reg, str, ah, load, hrs, def, action], i) => (
              <tr key={id} style={{ background: i % 2 === 0 ? "#fff" : "#f9f5ff" }}>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", fontWeight: 700, color: "#1a0a2e" }}>{id}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", color: "#374151" }}>{reg}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", textAlign: "center", color: "#374151" }}>{str}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", textAlign: "center", color: "#374151" }}>{ah}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", textAlign: "center", color: "#374151" }}>{load}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", textAlign: "center", fontWeight: 700, color: parseFloat(hrs) < 1 ? "#dc2626" : parseFloat(hrs) < 2 ? "#d97706" : "#ca8a04" }}>{hrs}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>{def}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.55vh 0.6vw", color: "#374151" }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447 · Page 2 of 3</div>
    </div>
  );
}
