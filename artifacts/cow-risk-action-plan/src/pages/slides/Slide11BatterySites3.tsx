export default function Slide11BatterySites3() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[3.5vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.3vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Battery Backup — Muzdalifah Outdoor + Mina + Makkah Remote (3 of 3)</div>
        <div className="text-[2.3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Remaining 19 Sites — Battery Action Required</div>
      </div>
      <div className="absolute top-[14vh] left-[6vw] right-[6vw]">
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Verdana, sans-serif" }}>
          <thead>
            <tr style={{ background: "#6b21c8" }}>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "left" }}>Site ID</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "left" }}>Region</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "center" }}>Strings</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "center" }}>Ah/Str</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "center" }}>Load kW</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "center" }}>Backup hrs</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "center" }}>Deficit hrs</th>
              <th style={{ color: "#fff", fontSize: "1.05vw", fontWeight: 700, padding: "1.1vh 0.7vw", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["CWN202","Muzdalifah","4","190","12.0","1.58","2.42","Add 6 strings"],
              ["CWN922","Muzdalifah","3","190","12.0","1.19","2.81","Add 7 strings"],
              ["CWN214","Muzdalifah","4","190","17.0","1.12","2.88","Add 9 strings"],
              ["CWN318","Muzdalifah","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN300","Muzdalifah","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN004","Muzdalifah","4","200","17.0","1.18","2.82","Add 8 strings"],
              ["CWN301","Muzdalifah","4","200","15.0","1.33","2.67","Add 7 strings"],
              ["CWN032","Muzdalifah","4","190","17.0","1.12","2.88","Add 9 strings"],
              ["CWN972","Muzdalifah","4","190","17.0","1.12","2.88","Add 9 strings"],
              ["CWN211","Muzdalifah","4","190","17.0","1.12","2.88","Add 9 strings"],
              ["CWN997","Muzdalifah","3","150","17.0","0.66","3.34","Add 10 strings — CRITICAL"],
              ["CWN777","Mina","3","200","12.0","1.25","2.75","Add 7 strings"],
              ["CWN978","Mina","3","200","12.0","1.25","2.75","Add 7 strings"],
              ["CWN201","Mina","4","190","15.0","1.27","2.73","Add 7 strings"],
              ["CWN953","Mina","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN959","Mina","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN976","Mina","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN994","Mina SG","4","200","12.0","1.67","2.33","Add 6 strings"],
              ["CWN961","Mina","4","200","17.0","1.18","2.82","Add 8 strings"],
            ].map(([id, reg, str, ah, load, hrs, def, action], i) => (
              <tr key={id} style={{ background: i % 2 === 0 ? "#fff" : "#f9f5ff" }}>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", fontWeight: 700, color: "#1a0a2e" }}>{id}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", color: "#374151" }}>{reg}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", textAlign: "center", color: "#374151" }}>{str}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", textAlign: "center", color: "#374151" }}>{ah}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", textAlign: "center", color: "#374151" }}>{load}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", textAlign: "center", fontWeight: 700, color: parseFloat(hrs) < 1 ? "#dc2626" : parseFloat(hrs) < 2 ? "#d97706" : "#ca8a04" }}>{hrs}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", textAlign: "center", fontWeight: 700, color: "#dc2626" }}>{def}</td>
                <td style={{ fontSize: "1.0vw", padding: "0.5vh 0.7vw", color: "#374151" }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447 · Page 3 of 3</div>
    </div>
  );
}
