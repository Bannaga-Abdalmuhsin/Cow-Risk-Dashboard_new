export default function Slide03PrimePowerIntro() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Section 1 of 4</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Prime Power Supply Risk</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Scenarios S1–S4 (Prime Source) and S5–S8 (Backup Source) · Margin ≤ 0 kW</div>
      </div>
      <div className="absolute top-[20vh] left-[6vw] right-[6vw] grid grid-cols-2 gap-[3vw]">
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Power Margin Formula</div>
          <div className="rounded-lg p-[2.5vh_2vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
            <div className="text-[1.3vw] font-bold mb-[1.5vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Power Margin (kW) =</div>
            <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Source Net kW</div>
            <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>− Telecom Load kW</div>
            <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>− AC Cooling Power kW</div>
            <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>− Battery Charging kW (if charging scenario)</div>
            <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #e5e7eb" }}>
              <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Risk = Margin ≤ 0 kW</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Risk Breakdown by Type</div>
          <div className="flex flex-col gap-[1.5vh]">
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #fca5a5" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>SG Sites (Single Generator)</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>S5–S8: No backup source — automatic Risk</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>11</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #fca5a5" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>SB/DG Sites — Backup Overload</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>S7/S8: Backup kW below load + battery charging</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>4</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff8f1", border: "1px solid #d97706" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>Required Action</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Add second generator or upgrade KVA rating</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>15</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[5vh] left-[6vw] right-[6vw] rounded-lg p-[2vh_2vw]" style={{ background: "#6b21c8" }}>
        <div className="text-[1.3vw] font-bold" style={{ color: "#fff", fontFamily: "Verdana, sans-serif" }}>Action Required: For each site listed on the following slide, increase available power kW to cover telecom load + cooling + battery charging with positive margin under the affected scenario.</div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
