export default function Slide02Summary() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Executive Summary</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Risk Overview — All 63 Surveyed Sites</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Operating conditions: 46°C · Scenarios S1–S9 · Full Traffic Telecom Load</div>
      </div>
      <div className="absolute top-[22vh] left-[6vw] right-[6vw] grid grid-cols-4 gap-[2vw]">
        <div className="rounded-lg p-[2vh_1.5vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.1vw] font-bold uppercase tracking-wide mb-[1vh]" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Prime Power Risk</div>
          <div className="text-[4.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>15</div>
          <div className="text-[1.2vw] font-bold" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>sites with margin ≤ 0</div>
          <div className="mt-[1.5vh] text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>SG sites: no backup path</div>
          <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>SB sites: S7/S8 overloaded</div>
        </div>
        <div className="rounded-lg p-[2vh_1.5vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.1vw] font-bold uppercase tracking-wide mb-[1vh]" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Rectifier Risk</div>
          <div className="text-[4.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>12</div>
          <div className="text-[1.2vw] font-bold" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>sites with margin ≤ 0</div>
          <div className="mt-[1.5vh] text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Rectifier kW below telecom</div>
          <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>load + battery charging</div>
        </div>
        <div className="rounded-lg p-[2vh_1.5vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.1vw] font-bold uppercase tracking-wide mb-[1vh]" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>Battery Backup</div>
          <div className="text-[4.5vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>63</div>
          <div className="text-[1.2vw] font-bold" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>sites below 4-hour target</div>
          <div className="mt-[1.5vh] text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>All sites: 0.63 – 3.07 hrs</div>
          <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Target: ≥ 4 hours (S9)</div>
        </div>
        <div className="rounded-lg p-[2vh_1.5vw]" style={{ background: "#fff7ed", border: "2px solid #d97706" }}>
          <div className="text-[1.1vw] font-bold uppercase tracking-wide mb-[1vh]" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>Scope</div>
          <div className="text-[4.5vw] font-bold" style={{ color: "#d97706", fontFamily: "Verdana, sans-serif" }}>S1–8</div>
          <div className="text-[1.2vw] font-bold" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>scenarios reviewed</div>
          <div className="mt-[1.5vh] text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Prime + Backup operation</div>
          <div className="text-[1.1vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>S9 Battery-only (all risk)</div>
        </div>
      </div>
      <div className="absolute top-[60vh] left-[6vw] right-[6vw]">
        <div className="text-[1.4vw] font-bold mb-[1.5vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Key Actions Required</div>
        <div className="grid grid-cols-3 gap-[2vw]">
          <div className="flex items-start gap-[0.8vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full mt-[0.5vh] flex-shrink-0" style={{ background: "#dc2626" }} />
            <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Upgrade generator KVA at 15 sites where prime/backup power margin is negative</div>
          </div>
          <div className="flex items-start gap-[0.8vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full mt-[0.5vh] flex-shrink-0" style={{ background: "#dc2626" }} />
            <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Replace or supplement rectifiers at 12 sites where rectifier output is below telecom demand</div>
          </div>
          <div className="flex items-start gap-[0.8vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full mt-[0.5vh] flex-shrink-0" style={{ background: "#dc2626" }} />
            <div className="text-[1.2vw]" style={{ color: "#374151", fontFamily: "Verdana, sans-serif" }}>Add battery strings at all 63 sites to reach minimum 4-hour backup time at full traffic load</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
