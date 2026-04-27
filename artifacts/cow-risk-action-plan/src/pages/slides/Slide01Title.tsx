export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #f8f6fb 0%, #ede9f8 60%, #d8b4fe22 100%)" }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea, #6b21c8)" }} />
      <div className="absolute top-[6vh] right-[5vw] flex flex-col items-end gap-[0.5vh]">
        <div className="text-[1.8vw] font-bold tracking-widest uppercase" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>stc</div>
        <div className="text-[1.1vw] font-bold tracking-wider uppercase" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[6vh] left-[6vw]">
        <div className="text-[1.2vw] font-bold uppercase tracking-widest" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>CONFIDENTIAL — INTERNAL USE ONLY</div>
      </div>
      <div className="absolute top-[22vh] left-[6vw] right-[8vw]">
        <div className="text-[1.5vw] font-bold uppercase tracking-widest mb-[2vh]" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Nokia COW Sites · Hajj 1447 · 46°C Operations</div>
        <div className="text-[4.5vw] font-bold leading-tight tracking-tight" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif", textWrap: "balance" }}>COW Power Risk</div>
        <div className="text-[4.5vw] font-bold leading-tight tracking-tight" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>Mitigation Action Plan</div>
        <div className="mt-[3vh] text-[1.8vw] font-bold" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Scenarios S1–S8 · Closing All Risk Flags (Margin ≤ 0)</div>
        <div className="mt-[1vh] text-[1.5vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Prime Power · Backup Power · Rectifier · Battery Backup Time</div>
      </div>
      <div className="absolute bottom-[8vh] left-[6vw] right-[6vw] flex items-end justify-between">
        <div>
          <div className="text-[1.5vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>stc Telecom · ACES MSD Division</div>
          <div className="text-[1.3vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Makkah / Mina / Muzdalifah / Arafat</div>
        </div>
        <div className="text-right">
          <div className="text-[1.3vw] font-bold" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>April 2026</div>
          <div className="text-[1.2vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>63 Surveyed Sites · 94 Total Fleet</div>
        </div>
      </div>
      <div className="absolute right-[5vw] top-[35vh] flex flex-col gap-[2vh]">
        <div className="text-right">
          <div className="text-[5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>24</div>
          <div className="text-[1.3vw] font-bold" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Sites at Risk</div>
        </div>
        <div className="text-right">
          <div className="text-[5vw] font-bold" style={{ color: "#6b21c8", fontFamily: "Verdana, sans-serif" }}>295</div>
          <div className="text-[1.3vw] font-bold" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Risk Flags</div>
        </div>
        <div className="text-right">
          <div className="text-[5vw] font-bold" style={{ color: "#0d9488", fontFamily: "Verdana, sans-serif" }}>39</div>
          <div className="text-[1.3vw] font-bold" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Safe Sites</div>
        </div>
      </div>
    </div>
  );
}
