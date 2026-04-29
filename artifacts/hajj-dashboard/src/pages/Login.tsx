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
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-start pl-16 md:pl-24">

      {/* Background — real Hajj photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${base}login-bg.png)` }}
      />

      {/* Gradient overlay — heavier on top and bottom, light in centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,30,0.72) 0%, rgba(10,4,30,0.45) 40%, rgba(10,4,30,0.55) 70%, rgba(10,4,30,0.88) 100%)",
        }}
      />

      {/* CSS keyframes */}
      <style>{`
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 14px rgba(147,51,234,0.35); }
          50%      { box-shadow: 0 0 32px rgba(147,51,234,0.65), 0 0 60px rgba(107,33,200,0.25); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fade-in-up 0.5s ease-out both, glow-pulse 3.2s ease-in-out infinite; }
      `}</style>

      {/* Centered login card */}
      <div
        className="login-card relative z-10 w-full max-w-sm rounded-2xl p-8 flex flex-col"
        style={{
          background: "rgba(10,4,28,0.80)",
          border: "1px solid rgba(167,139,250,0.28)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* ACES logo */}
        <div className="flex justify-center mb-5">
          <img
            src={`${base}aces-logo-nobg.png`}
            alt="ACES Managed Services"
            className="h-24 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 14px rgba(220,38,38,0.45))" }}
          />
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <div
            className="text-sm font-bold"
            style={{ color: "rgba(209,196,233,0.72)", fontFamily: "Verdana, sans-serif", letterSpacing: "0.04em" }}
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

      {/* Powered by ACES MSD — fixed at very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2"
        style={{ background: "rgba(10,4,28,0.75)", borderTop: "1px solid rgba(107,33,200,0.2)" }}
      >
        <span
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: "#dc2626", fontFamily: "Verdana, sans-serif" }}
        >
          Powered by
        </span>
        <span
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: "#1e3a8a", fontFamily: "Verdana, sans-serif", textShadow: "0 0 10px rgba(255,255,255,0.35)" }}
        >
          ACES MSD
        </span>
      </div>
    </div>
  );
}
