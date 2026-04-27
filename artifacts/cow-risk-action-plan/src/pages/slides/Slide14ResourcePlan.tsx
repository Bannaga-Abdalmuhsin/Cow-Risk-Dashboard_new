export default function Slide14ResourcePlan() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Resource & Logistics Plan</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Procurement & Field Deployment</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Summary of equipment requirements and field team allocation across 63 sites</div>
      </div>
      <div className="absolute top-[22vh] left-[6vw] right-[6vw] grid grid-cols-2 gap-[3vw]">
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Equipment Procurement Summary</div>
          <div className="flex flex-col gap-[1.5vh]">
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Backup Generators</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>25–45 KVA diesel units · 11 new + 4 upgrades</div>
              </div>
              <div className="text-right">
                <div className="text-[2.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>15</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>units</div>
              </div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Rectifier Modules</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>19.2–24.3 kW capacity · replacement or parallel add</div>
              </div>
              <div className="text-right">
                <div className="text-[2.5vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>12</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>sites</div>
              </div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Battery Strings (200 Ah lead-acid)</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Average 6–8 additional strings per site · all 63 sites</div>
              </div>
              <div className="text-right">
                <div className="text-[2.5vw] font-bold" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>~450</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>strings est.</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Field Team Deployment</div>
          <div className="flex flex-col gap-[1.5vh]">
            <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div className="text-[1.2vw] font-bold mb-[0.8vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>16 Technicians Available</div>
              <div className="text-[1.1vw] mb-[0.5vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>12 escalation teams · 15-min ETA to Mina/Arafat/Muzdalifah</div>
              <div className="text-[1.1vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>60+ min ETA to Makkah Remote sites (CWN998, 967, 081)</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#ede9f8", border: "1px solid #9333ea" }}>
              <div className="text-[1.2vw] font-bold mb-[0.8vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Recommended Work Sequence</div>
              <div className="text-[1.1vw] mb-[0.5vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>1. Generator installations (P1) — 4 weeks pre-Hajj</div>
              <div className="text-[1.1vw] mb-[0.5vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>2. Rectifier upgrades (P3) — 3 weeks pre-Hajj</div>
              <div className="text-[1.1vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>3. Battery additions (P4/P5) — 2 weeks pre-Hajj</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw]" style={{ background: "#fff8f1", border: "1px solid #d97706" }}>
              <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>31 Sites Pending Survey</div>
              <div className="text-[1.1vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Complete surveys for remaining 31 sites as soon as possible — additional risk actions may be identified</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
