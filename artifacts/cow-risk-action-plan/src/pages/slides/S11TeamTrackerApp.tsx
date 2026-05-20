const V = "Verdana, sans-serif";
export default function S11TeamTrackerApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg,#f0fdf9 0%,#ccfbf1 55%,#99f6e420 100%)", fontFamily: V }}>
      <div className="absolute top-0 left-0 w-[0.8vw] h-full" style={{ background: "#0d9488" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[0.8vh]" style={{ background: "linear-gradient(90deg,#0d9488,#14b8a6,#0d9488)" }} />
      <div className="absolute top-[3vh] right-[4vw] flex items-center gap-[1.5vw]">
        <div style={{ fontSize: "1.3vw", fontWeight: "bold", color: "#0d9488", letterSpacing: "0.15em" }}>stc</div>
        <div style={{ fontSize: "1.1vw", fontWeight: "bold", color: "#0d9488" }}>ACES MSD</div>
      </div>
      <div className="absolute top-[8vh] left-[5vw] right-[5vw]">
        <div style={{ fontSize: "1.2vw", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>
          Team Tracker · Introduction
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0c3b3a", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          The Field Team in Your Pocket.
        </div>
        <div style={{ fontSize: "4vw", fontWeight: "bold", color: "#0d9488", lineHeight: 1.1, marginBottom: "4vh" }}>
          Anywhere. Any Time.
        </div>
      </div>
      <div className="absolute top-[44vh] left-[5vw] right-[5vw]">
        <div style={{ display: "flex", gap: "2vw" }}>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #99f6e4", boxShadow: "0 4px 16px rgba(13,148,136,0.12)" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>iOS + Android</div>
            <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Built with React Native and Expo — one codebase deployed to both platforms. Published to App Store and Google Play.</div>
          </div>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #99f6e4", boxShadow: "0 4px 16px rgba(13,148,136,0.12)" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>Live GPS Tracking</div>
            <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Each technician's location updates in real time on ESRI satellite tiles — visible from the Risk Dashboard Teams tab.</div>
          </div>
          <div style={{ flex: 1, background: "white", borderRadius: "1.2vw", padding: "1.8vw", border: "2px solid #99f6e4", boxShadow: "0 4px 16px rgba(13,148,136,0.12)" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: "bold", color: "#0d9488", marginBottom: "1vh" }}>Push Notifications</div>
            <div style={{ fontSize: "1.2vw", color: "#374151", lineHeight: 1.6 }}>Firebase FCM delivers assignment alerts, fault dispatches, and priority escalations instantly to the field team.</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[2.5vh] left-[5vw]">
        <div style={{ fontSize: "1.05vw", color: "#6b7280" }}>stc · ACES MSD · ACES Field Team Tracker · Hajj 1447</div>
      </div>
    </div>
  );
}
