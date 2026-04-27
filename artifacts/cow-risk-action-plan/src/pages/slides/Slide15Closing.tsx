export default function Slide15Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #1a0a2e 0%, #3b0764 60%, #6b21c8 100%)" }}>
      <div className="absolute top-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg, #9333ea, #c084fc, #9333ea)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg, #9333ea, #c084fc, #9333ea)" }} />
      <div className="absolute top-[8vh] right-[7vw] flex flex-col items-end gap-[0.5vh]">
        <div className="text-[2.5vw] font-bold tracking-widest uppercase" style={{ color: "#ffffff", fontFamily: "Verdana, sans-serif" }}>stc</div>
        <div className="text-[1.3vw] font-bold tracking-wider uppercase" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[20vh] left-[7vw] right-[7vw]">
        <div className="text-[1.3vw] font-bold uppercase tracking-widest mb-[2vh]" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>Action Plan Summary</div>
        <div className="text-[4vw] font-bold leading-tight" style={{ color: "#ffffff", fontFamily: "Verdana, sans-serif" }}>Close All Power Risks</div>
        <div className="text-[4vw] font-bold leading-tight mb-[3vh]" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>Before Hajj 1447</div>
        <div className="grid grid-cols-4 gap-[2vw] mt-[3vh]">
          <div className="text-center">
            <div className="text-[3.5vw] font-bold" style={{ color: "#f87171", fontFamily: "Verdana, sans-serif" }}>15</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Generator</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Upgrades</div>
          </div>
          <div className="text-center">
            <div className="text-[3.5vw] font-bold" style={{ color: "#fbbf24", fontFamily: "Verdana, sans-serif" }}>12</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Rectifier</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Replacements</div>
          </div>
          <div className="text-center">
            <div className="text-[3.5vw] font-bold" style={{ color: "#34d399", fontFamily: "Verdana, sans-serif" }}>~450</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Battery Strings</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Fleet-Wide</div>
          </div>
          <div className="text-center">
            <div className="text-[3.5vw] font-bold" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>63</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Sites to</div>
            <div className="text-[1.2vw] font-bold" style={{ color: "#e2d9f3", fontFamily: "Verdana, sans-serif" }}>Clear Risk</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[12vh] left-[7vw] right-[7vw]" style={{ borderTop: "1px solid rgba(192,132,252,0.4)", paddingTop: "2.5vh" }}>
        <div className="grid grid-cols-3 gap-[3vw]">
          <div>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>Dashboard</div>
            <div className="text-[1.1vw]" style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}>Live monitoring at stc-cow.github.io/Cow-Risk-Dashboard/</div>
          </div>
          <div>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>Fleet Coverage</div>
            <div className="text-[1.1vw]" style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}>63 of 94 sites surveyed · 31 pending survey completion</div>
          </div>
          <div>
            <div className="text-[1.2vw] font-bold mb-[0.5vh]" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>Field Team</div>
            <div className="text-[1.1vw]" style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}>16 technicians · 12 escalation teams · 15 min ETA</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[4vh] left-[7vw]">
        <div className="text-[1.2vw]" style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}>Prepared by: stc · ACES MSD Division · April 2026</div>
      </div>
    </div>
  );
}
