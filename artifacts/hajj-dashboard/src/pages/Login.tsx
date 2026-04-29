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

  const base = import.meta.env.BASE_URL;

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
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${base}login-bg.png)` }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,4,22,0.80) 0%, rgba(27,4,60,0.72) 40%, rgba(60,10,100,0.62) 70%, rgba(10,4,22,0.82) 100%)",
        }}
      />

      {/* Animated signal rings */}
      <style>{`
        @keyframes pulse-ring {
          0%  { opacity: 0.85; transform: scale(0.82); }
          70% { opacity: 0.15; }
          100%{ opacity: 0; transform: scale(1.35); }
        }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 14px rgba(147,51,234,0.35); }
          50%      { box-shadow: 0 0 32px rgba(147,51,234,0.7), 0 0 60px rgba(107,33,200,0.28); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fade-in-up 0.5s ease-out both; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ right: "12%", bottom: "20%" }}>
          {[1,2,3,4].map((i) => (
            <div key={i} className="absolute rounded-full border" style={{
              width: `${i * 90}px`,
              height: `${i * 50}px`,
              top: `${-i * 25}px`,
              left: `${-i * 45}px`,
              borderColor: `rgba(147,51,234,${0.55 - i * 0.1})`,
              borderWidth: "1.5px",
              animation: `pulse-ring ${1.9 + i * 0.4}s ease-out infinite`,
              animationDelay: `${i * 0.38}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Centered login card */}
      <div
        className="login-card relative z-10 w-full max-w-sm mx-4 rounded-2xl p-8 flex flex-col"
        style={{
          background: "rgba(10,4,28,0.82)",
          border: "1px solid rgba(167,139,250,0.28)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          animation: "glow-pulse 3.2s ease-in-out infinite",
        }}
      >
        {/* ACES logo */}
        <div className="flex justify-center mb-6">
          <img
            src={`${base}aces-logo-nobg.png`}
            alt="ACES Managed Services"
            className="h-16 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(220,38,38,0.4))" }}
          />
        </div>

        {/* Card subtitle */}
        <div className="text-center mb-6">
          <div
            className="text-sm font-bold"
            style={{ color: "rgba(209,196,233,0.7)", fontFamily: "Verdana, sans-serif", letterSpacing: "0.04em" }}
          >
            COW Risk Dashboard · Hajj 1447
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
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-purple-700 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(167,139,250,0.25)",
                fontFamily: "Verdana, sans-serif",
              }}
              onFocus={(e) => { e.target.style.border = "1px solid #9333ea"; e.target.style.background = "rgba(107,33,200,0.14)"; }}
              onBlur={(e)  => { e.target.style.border = "1px solid rgba(167,139,250,0.25)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
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
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-purple-700 outline-none transition-all pr-14"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  fontFamily: "Verdana, sans-serif",
                }}
                onFocus={(e) => { e.target.style.border = "1px solid #9333ea"; e.target.style.background = "rgba(107,33,200,0.14)"; }}
                onBlur={(e)  => { e.target.style.border = "1px solid rgba(167,139,250,0.25)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
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
            className="w-full py-3 rounded-lg text-sm font-bold text-white mt-1 transition-all"
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
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                  <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Bottom "Powered by ACES MSD" */}
      <div className="relative z-10 mt-5 flex items-center gap-2">
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}
        >
          Powered by
        </span>
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "#1e3a8a", fontFamily: "Verdana, sans-serif", textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
        >
          ACES MSD
        </span>
      </div>
    </div>
  );
}
