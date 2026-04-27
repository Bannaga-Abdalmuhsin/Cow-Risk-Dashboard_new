export default function Slide12MakkahRemote() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f8f6fb" }}>
      <div className="absolute top-0 left-0 right-0 h-[1.2vh]" style={{ background: "linear-gradient(90deg, #6b21c8, #9333ea)" }} />
      <div className="absolute top-[4vh] left-[6vw] right-[6vw]">
        <div className="text-[1.1vw] font-bold uppercase tracking-widest mb-[0.5vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Section 4 — Makkah Remote Sites</div>
        <div className="text-[3vw] font-bold" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>Remote Sites — Combined Risk Profile</div>
        <div className="text-[1.4vw]" style={{ color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>3 isolated sites with combined power + battery risks requiring priority attention</div>
      </div>
      <div className="absolute top-[22vh] left-[6vw] right-[6vw] grid grid-cols-3 gap-[2vw]">
        <div className="rounded-xl p-[3vh_2vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.8vw] font-bold mb-[0.5vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>CWN998</div>
          <div className="text-[1.2vw] mb-[2vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Makkah Remote · Outdoor · SG</div>
          <div className="flex flex-col gap-[1.2vh]">
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Prime Gen Net</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>31.32 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Source</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>NONE (SG)</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Telecom Load</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>17.0 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Time</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#d97706", fontFamily: "Verdana, sans-serif" }}>1.18 hrs</span>
            </div>
          </div>
          <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #fca5a5" }}>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>1. Add backup generator (45 KVA)</div>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>2. Add 8 battery strings (200 Ah)</div>
          </div>
        </div>
        <div className="rounded-xl p-[3vh_2vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.8vw] font-bold mb-[0.5vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>CWN967</div>
          <div className="text-[1.2vw] mb-[2vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Makkah Remote · Outdoor · SG</div>
          <div className="flex flex-col gap-[1.2vh]">
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Prime Gen Net</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>17.4 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Source</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>NONE (SG)</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Telecom Load</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>12.0 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Time</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>0.63 hrs — CRITICAL</span>
            </div>
          </div>
          <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #fca5a5" }}>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>1. Add backup generator (25 KVA)</div>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>2. Expand to 10 battery strings</div>
          </div>
        </div>
        <div className="rounded-xl p-[3vh_2vw]" style={{ background: "#fff", border: "2px solid #dc2626" }}>
          <div className="text-[1.8vw] font-bold mb-[0.5vh]" style={{ color: "#1a0a2e", fontFamily: "Verdana, sans-serif" }}>CWN081</div>
          <div className="text-[1.2vw] mb-[2vh]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>Makkah Remote · Shelter · SG</div>
          <div className="flex flex-col gap-[1.2vh]">
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Prime Gen Net</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>17.4 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Source</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>NONE (SG)</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Telecom Load</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#374151", fontFamily: "Verdana, sans-serif" }}>12.0 kW</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "1.1vw", color: "#6b7280", fontFamily: "Verdana, sans-serif" }}>Backup Time</span>
              <span style={{ fontSize: "1.1vw", fontWeight: 700, color: "#d97706", fontFamily: "Verdana, sans-serif" }}>1.58 hrs</span>
            </div>
          </div>
          <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #fca5a5" }}>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>1. Add backup gen or SEC (35 KVA)</div>
            <div className="text-[1.1vw] font-bold" style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}>2. Add 6 battery strings (190 Ah)</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[5vh] left-[6vw] right-[6vw] rounded-lg p-[2vh_2vw]" style={{ background: "#6b21c8" }}>
        <div className="text-[1.3vw] font-bold" style={{ color: "#fff", fontFamily: "Verdana, sans-serif" }}>Remote site logistics: coordinate with field ops teams for transportation and remote access permits well ahead of Hajj season. ETA from nearest zone: 60+ minutes.</div>
      </div>
      <div className="absolute bottom-[2.5vh] right-[6vw] text-[1.1vw]" style={{ color: "#9333ea", fontFamily: "Verdana, sans-serif" }}>stc · ACES MSD · Hajj 1447</div>
    </div>
  );
}
