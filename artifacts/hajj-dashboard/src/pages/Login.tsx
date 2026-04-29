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
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(150deg, #1a0a2e 0%, #3b0764 55%, #6b21c8 100%)" }}
    >
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold tracking-widest text-white mb-1" style={{ fontFamily: "Verdana, sans-serif" }}>
            stc
          </div>
          <div className="text-sm font-bold tracking-[0.3em] uppercase text-purple-300" style={{ fontFamily: "Verdana, sans-serif" }}>
            ACES MSD
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.25)", backdropFilter: "blur(12px)" }}>
          <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "Verdana, sans-serif" }}>
            COW Risk Dashboard
          </h1>
          <p className="text-sm text-purple-300 mb-8" style={{ fontFamily: "Verdana, sans-serif" }}>
            Hajj 1447 · Nokia Sites Monitoring · Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2" style={{ fontFamily: "Verdana, sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-purple-400 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  fontFamily: "Verdana, sans-serif",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #9333ea")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(167,139,250,0.3)")}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2" style={{ fontFamily: "Verdana, sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-purple-400 outline-none transition-all pr-12"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    fontFamily: "Verdana, sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #9333ea")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(167,139,250,0.3)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors text-xs select-none"
                  style={{ fontFamily: "Verdana, sans-serif" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm font-bold"
                style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", color: "#fca5a5", fontFamily: "Verdana, sans-serif" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white transition-all mt-1"
              style={{
                background: loading ? "rgba(107,33,200,0.5)" : "#6b21c8",
                fontFamily: "Verdana, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
              }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = "#7c3aed"; }}
              onMouseLeave={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = "#6b21c8"; }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-purple-500" style={{ fontFamily: "Verdana, sans-serif" }}>
          Powered by ACES MSD · Hajj 1447
        </div>
      </div>
    </div>
  );
}
