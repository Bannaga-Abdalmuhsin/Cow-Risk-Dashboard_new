export default function Slide08BatteryIntro() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Section 3 of 4</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Battery Backup Time — All 63 Sites</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Target: ≥ 4 hours backup at full traffic telecom load · All 63 sites currently fall short</div>
      </div>
      <div className="absolute top-[21vh] left-[6vw] right-[6vw] grid grid-cols-3 gap-[2vw]">
        <div className="rounded-lg p-[2.5vh_2vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <div className="text-[1.3vw] font-bold mb-[1.5vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Backup Time Formula</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Useful Capacity (kWh)</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>= Strings × Ah × 50V × DoD × Age Factor</div>
          <div className="text-[1.2vw] mb-[1.5vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>÷ Telecom Load (kW)</div>
          <div className="pt-[1.5vh]" style={{ borderTop: "1px solid #e5e7eb" }}>
            <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Risk = Backup Time &lt; 4 hours</div>
          </div>
        </div>
        <div className="rounded-lg p-[2.5vh_2vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <div className="text-[1.3vw] font-bold mb-[1.5vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Current State</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Minimum: <span style={{ fontWeight: 700, color: "#dc2626" }}>0.63 hrs</span> (CWN967, CWN021)</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Maximum: <span style={{ fontWeight: 700, color: "#d97706" }}>3.07 hrs</span> (CWN072)</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Average: <span style={{ fontWeight: 700, color: "#dc2626" }}>~1.5 hrs</span></div>
          <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>All 63 sites below 4-hour target</div>
        </div>
        <div className="rounded-lg p-[2.5vh_2vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <div className="text-[1.3vw] font-bold mb-[1.5vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Additional Strings Required</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Each 200 Ah string at 50V ≈ 10 kWh</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Lead-acid DoD 50% → 5 kWh usable per string</div>
          <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>To achieve 4 hrs at 12 kW load = 48 kWh needed</div>
          <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>= ~10 strings of 200 Ah per site</div>
        </div>
      </div>
      <div className="absolute top-[57vh] left-[6vw] right-[6vw]">
        <div className="text-[1.4vw] font-bold mb-[1.5vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Priority Grouping by Backup Time</div>
        <div className="grid grid-cols-3 gap-[2vw]">
          <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Critical (below 1 hr)</div>
            <div className="text-[1.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>3 sites</div>
            <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>CWN050 (0.67h), CWN967 (0.63h), CWN021 (0.63h)</div>
          </div>
          <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#fff8f1", border: "1px solid #d97706" }}>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>High Priority (1–2 hrs)</div>
            <div className="text-[1.5vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>47 sites</div>
            <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Majority of fleet — significant additional capacity needed</div>
          </div>
          <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#fefce8", border: "1px solid #ca8a04" }}>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#ca8a04", fontFamily: "Verdana, sans-serif" }}>Medium (2–4 hrs)</div>
            <div className="text-[1.5vw] font-bold" style={{ color: "#ca8a04", fontFamily: "Verdana, sans-serif" }}>13 sites</div>
            <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Closer to target — fewer additional strings required</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
