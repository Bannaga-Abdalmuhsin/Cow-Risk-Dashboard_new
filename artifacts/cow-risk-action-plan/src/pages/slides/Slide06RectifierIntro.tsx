export default function Slide06RectifierIntro() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Section 2 of 4</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Rectifier Supply Risk</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Scenarios S1–S8 · Rectifier Output below Telecom Demand · Margin ≤ 0 kW</div>
      </div>
      <div className="absolute top-[21vh] left-[6vw] right-[6vw] grid grid-cols-2 gap-[3vw]">
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Rectifier Margin Formula</div>
          <div className="rounded-lg p-[2.5vh_2vw]" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
            <div className="text-[1.3vw] font-bold mb-[1.5vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Rectifier Margin (kW) =</div>
            <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Rectifier Net kW</div>
            <div className="text-[1.2vw] mb-[0.8vh]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>− Telecom Load kW</div>
            <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>− Battery Charging kW (S3/S4/S7/S8 only)</div>
            <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #e5e7eb" }}>
              <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Risk = Margin ≤ 0 kW</div>
            </div>
          </div>
          <div className="mt-[2vh] rounded-lg p-[2vh_2vw]" style={{ background: "#ede9f8", border: "1px solid #9333ea" }}>
            <div className="text-[1.2vw] font-bold mb-[1vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Note on Charging Scenarios</div>
            <div className="text-[1.1vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>In S3, S4, S7, S8 the batteries are in charging state. The rectifier must supply both the telecom load AND battery charging current simultaneously. Sites with marginal rectifiers fail under combined demand.</div>
          </div>
        </div>
        <div>
          <div className="text-[1.4vw] font-bold mb-[2vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Risk Profile — 12 Sites</div>
          <div className="flex flex-col gap-[1.5vh]">
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #fca5a5" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Telecom exceeds rectifier (S1)</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Rectifier kW below base telecom load alone</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>3</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff", border: "1px solid #fca5a5" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Fails under charging load (S3)</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Passes S1 but fails when batteries charge</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>9</div>
            </div>
            <div className="rounded-lg p-[1.5vh_1.5vw] flex items-center justify-between" style={{ background: "#fff8f1", border: "1px solid #d97706" }}>
              <div>
                <div className="text-[1.2vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>Required Action</div>
                <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Upgrade rectifier capacity to cover load + charging</div>
              </div>
              <div className="text-[2.5vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>12</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[5vh] left-[6vw] right-[6vw] rounded-lg p-[2vh_2vw]" style={{ background: "#6b21c8" }}>
        <div className="text-[1.3vw] font-bold" style={{ color: "#fff", fontFamily: "Verdana, sans-serif" }}>Action Required: Replace or supplement rectifiers so that output kW covers telecom load plus battery charging current with positive margin under scenarios S1 and S3.</div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
