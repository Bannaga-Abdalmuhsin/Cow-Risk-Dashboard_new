import { useState } from "react";

const VALID_EMAIL = "cowms.hajj@aces-co.com";
const VALID_PASSWORD = "Ac@eS#2026";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email.trim() === VALID_EMAIL && password === VALID_PASSWORD) {
        localStorage.setItem("cowms_auth", "1");
        onLogin();
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
      setLoading(false);
    }, 500);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}login-bg.png)` }}
      />
      {/* Deep gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,4,22,0.82) 0%, rgba(27,4,60,0.75) 40%, rgba(60,10,100,0.65) 70%, rgba(10,4,22,0.85) 100%)",
        }}
      />

      {/* Animated signal rings — COW tower effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Tower position — right side */}
        <div
          className="absolute"
          style={{ right: "14%", bottom: "18%", width: 0, height: 0 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `${i * 80}px`,
                height: `${i * 45}px`,
                top: `${-i * 22}px`,
                left: `${-i * 40}px`,
                borderColor: `rgba(147,51,234,${0.5 - i * 0.1})`,
                borderWidth: "1.5px",
                animation: `pulse-ring ${1.8 + i * 0.4}s ease-out infinite`,
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes pulse-ring {
          0% { opacity: 0.9; transform: scale(0.85); }
          70% { opacity: 0.2; }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(147,51,234,0.4); }
          50% { box-shadow: 0 0 28px rgba(147,51,234,0.75), 0 0 50px rgba(107,33,200,0.3); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fade-in-up 0.55s ease-out both; }
      `}</style>

      {/* Content layout */}
      <div className="relative z-10 w-full max-w-5xl mx-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-0">

        {/* Left: Branding panel */}
        <div className="flex-1 flex flex-col justify-center pr-0 lg:pr-12 text-center lg:text-left">
          {/* stc logo */}
          <div className="mb-3">
            <span
              className="text-6xl font-black tracking-widest text-white"
              style={{ fontFamily: "Verdana, sans-serif", textShadow: "0 2px 20px rgba(147,51,234,0.7)" }}
            >
              stc
            </span>
            <div
              className="text-xs font-bold tracking-[0.4em] uppercase mt-1"
              style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}
            >
              ACES MSD DIVISION
            </div>
          </div>

          <h1
            className="text-2xl font-bold text-white mt-4 mb-2 leading-snug"
            style={{ fontFamily: "Verdana, sans-serif", textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}
          >
            COW Power &amp; Cooling
            <br />
            <span style={{ color: "#c084fc" }}>Risk Monitoring Dashboard</span>
          </h1>

          <p
            className="text-sm mb-6"
            style={{ color: "rgba(209,196,233,0.85)", fontFamily: "Verdana, sans-serif", lineHeight: 1.7 }}
          >
            Nokia COW Telecom Sites · Hajj 1447<br />
            Makkah · Mina · Muzdalifah · Arafat<br />
            46°C Operational Scenarios · S1–S9
          </p>

          {/* Stats bar */}
          <div className="flex gap-6 justify-center lg:justify-start mt-2">
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#f87171", fontFamily: "Verdana, sans-serif" }}>94</div>
              <div className="text-xs" style={{ color: "rgba(209,196,233,0.7)", fontFamily: "Verdana, sans-serif" }}>COW Sites</div>
            </div>
            <div className="w-px" style={{ background: "rgba(167,139,250,0.25)" }} />
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#fbbf24", fontFamily: "Verdana, sans-serif" }}>24</div>
              <div className="text-xs" style={{ color: "rgba(209,196,233,0.7)", fontFamily: "Verdana, sans-serif" }}>At Risk</div>
            </div>
            <div className="w-px" style={{ background: "rgba(167,139,250,0.25)" }} />
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#34d399", fontFamily: "Verdana, sans-serif" }}>16</div>
              <div className="text-xs" style={{ color: "rgba(209,196,233,0.7)", fontFamily: "Verdana, sans-serif" }}>Technicians</div>
            </div>
            <div className="w-px" style={{ background: "rgba(167,139,250,0.25)" }} />
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#c084fc", fontFamily: "Verdana, sans-serif" }}>9</div>
              <div className="text-xs" style={{ color: "rgba(209,196,233,0.7)", fontFamily: "Verdana, sans-serif" }}>Scenarios</div>
            </div>
          </div>
        </div>

        {/* Right: Login card */}
        <div
          className="login-card w-full lg:w-[380px] flex-shrink-0 rounded-2xl p-8"
          style={{
            background: "rgba(12,4,30,0.78)",
            border: "1px solid rgba(167,139,250,0.3)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation: "glow-pulse 3s ease-in-out infinite",
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(107,33,200,0.35)", border: "1px solid rgba(147,51,234,0.5)" }}
            >
              {/* Signal tower icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="#c084fc" />
                <path d="M9.5 9.5 Q12 7 14.5 9.5" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M7.5 7.5 Q12 4.5 16.5 7.5" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M5.5 5.5 Q12 2 18.5 5.5" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
                <line x1="12" y1="14" x2="12" y2="22" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="22" x2="15" y2="22" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white" style={{ fontFamily: "Verdana, sans-serif" }}>Secure Access</div>
              <div className="text-xs" style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}>Hajj 1447 Operations</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-purple-600 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  fontFamily: "Verdana, sans-serif",
                }}
                onFocus={(e) => { e.target.style.border = "1px solid #9333ea"; e.target.style.background = "rgba(107,33,200,0.15)"; }}
                onBlur={(e) => { e.target.style.border = "1px solid rgba(167,139,250,0.25)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-purple-600 outline-none transition-all pr-14"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    fontFamily: "Verdana, sans-serif",
                  }}
                  onFocus={(e) => { e.target.style.border = "1px solid #9333ea"; e.target.style.background = "rgba(107,33,200,0.15)"; }}
                  onBlur={(e) => { e.target.style.border = "1px solid rgba(167,139,250,0.25)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                  style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c084fc")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a78bca")}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg px-3 py-2.5 text-xs font-bold"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.4)",
                  color: "#fca5a5",
                  fontFamily: "Verdana, sans-serif",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white mt-1 transition-all relative overflow-hidden"
              style={{
                background: loading
                  ? "rgba(107,33,200,0.45)"
                  : "linear-gradient(135deg, #6b21c8, #9333ea)",
                fontFamily: "Verdana, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #a855f7)"); }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "linear-gradient(135deg, #6b21c8, #9333ea)"); }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Bottom badge */}
          <div className="mt-6 flex items-center gap-2 justify-center">
            <div className="h-px flex-1" style={{ background: "rgba(167,139,250,0.2)" }} />
            <span className="text-xs" style={{ color: "#6b4fa0", fontFamily: "Verdana, sans-serif" }}>
              Powered by ACES MSD
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(167,139,250,0.2)" }} />
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div
        className="absolute bottom-0 left-0 right-0 py-2 px-6 flex items-center justify-between text-xs"
        style={{
          background: "rgba(10,4,22,0.6)",
          borderTop: "1px solid rgba(107,33,200,0.25)",
          fontFamily: "Verdana, sans-serif",
          color: "rgba(167,139,250,0.5)",
        }}
      >
        <span>stc · ACES MSD · Nokia COW Monitoring System</span>
        <span>Hajj 1447 · Authorized Personnel Only</span>
        <span>v1.0 · April 2026</span>
      </div>
    </div>
  );
}
