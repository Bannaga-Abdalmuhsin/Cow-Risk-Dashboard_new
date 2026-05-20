const V = "Verdana, sans-serif";
export default function S06EngineeringModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#faf9fd 0%,#ede9f8 55%,#d8b4fe18 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#6b21c8" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#6b21c8,#9333ea,#6b21c8)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#6b21c8", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#9333ea" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Risk Dashboard · Engineering Model
        </div>
        <div style={{ fontSize: "3.8vw", fontWeight: "bold", color: "#1a0a2e", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          9 Scenarios. Calculated in Real Time.
        </div>
        <div style={{ fontSize: "1.4vw", color: "#4b5563", marginBottom: "3vh" }}>
          Every site is evaluated across all operating modes simultaneously — power source × AC state × battery condition.
        </div>
      </div>
      <div className="absolute top-[40vh] left-[5vw] right-[5vw]">
        <div className="flex gap-[2vw]">
          <div className="rounded-xl p-[1.8vw]" style={{ flex: 1, background: "linear-gradient(145deg,#f5f3ff,#ede9fe)", border: "2px solid #c4b5fd" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#6b21c8", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Prime Power · S1–S4
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S1 · 1 AC unit · no battery charge
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S2 · Both AC units · no charge
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S3 · 1 AC unit + battery charging
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S4 · Both AC + charging · max load
            </div>
          </div>
          <div className="rounded-xl p-[1.8vw]" style={{ flex: 1, background: "linear-gradient(145deg,#fff1f2,#ffe4e6)", border: "2px solid #fecdd3" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#dc2626", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Backup Generator · S5–S8
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S5 · Generator switch · 1 AC
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S6 · Full AC on generator
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S7 · Generator + 1 AC + charging
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S8 · Maximum backup load
            </div>
          </div>
          <div className="rounded-xl p-[1.8vw]" style={{ flex: 1, background: "linear-gradient(145deg,#fffbeb,#fef3c7)", border: "2px solid #fde68a" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: "bold", color: "#d97706", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Battery Only · S9
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8 }}>
              S9 · Complete power outage
            </div>
            <div style={{ fontSize: "1.2vw", color: "#4b5563", lineHeight: 1.8, marginTop: "2vh" }}>
              Batteries as the sole source of power — endurance calculated per site type
            </div>
            <div style={{ marginTop: "2vh", padding: "0.8vh 1vw", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
              <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#b45309" }}>
                46°C derating applied to all scenarios
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#9ca3af" }}>stc · ACES MSD · COW Operations Intelligence · Hajj 1447</div>
      </div>
    </div>
  );
}
