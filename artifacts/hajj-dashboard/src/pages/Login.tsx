import { useState, useEffect } from "react";

const EH = "90756f521ba73844d4b207b59e7f6a371b6740a1bd8cc8847d3e8e4da9c19959";
const PH = "76c12bd27efdd1b7c9e76e5bd2c4dede6cf6c257522d5a2e3c745eaa103b9d64";

const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000;
const SESSION_MS    = 8  * 60 * 60 * 1000;
const ATTEMPT_KEY   = "cowms_fa";
const SESSION_KEY   = "cowms_sess";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getAttemptState(): { count: number; since: number } {
  try { return JSON.parse(sessionStorage.getItem(ATTEMPT_KEY) || "{}"); } catch { return { count: 0, since: 0 }; }
}

function bumpAttempt() {
  const s = getAttemptState();
  const now = Date.now();
  const base = (now - (s.since || 0)) < LOCKOUT_MS ? s : { count: 0, since: now };
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ count: (base.count || 0) + 1, since: base.since || now }));
}

function clearAttempts() { sessionStorage.removeItem(ATTEMPT_KEY); }

function isLockedOut(): { locked: boolean; remainingMs: number } {
  const { count, since } = getAttemptState();
  if (count >= MAX_ATTEMPTS) {
    const remaining = LOCKOUT_MS - (Date.now() - since);
    if (remaining > 0) return { locked: true, remainingMs: remaining };
    clearAttempts();
  }
  return { locked: false, remainingMs: 0 };
}

export function createSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_MS }));
}

export function checkSession(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { exp } = JSON.parse(raw);
    if (Date.now() > exp) { localStorage.removeItem(SESSION_KEY); return false; }
    return true;
  } catch { return false; }
}

export function clearSession() { localStorage.removeItem(SESSION_KEY); }

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [lockMsg, setLockMsg]       = useState("");

  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const { locked, remainingMs } = isLockedOut();
    if (locked) {
      const mins = Math.ceil(remainingMs / 60000);
      setLockMsg(`Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { locked, remainingMs } = isLockedOut();
    if (locked) {
      const mins = Math.ceil(remainingMs / 60000);
      setLockMsg(`Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const [eh, ph] = await Promise.all([sha256(email.trim()), sha256(password)]);

    if (eh === EH && ph === PH) {
      clearAttempts();
      createSession();
      onLogin();
    } else {
      bumpAttempt();
      const state = getAttemptState();
      const left = MAX_ATTEMPTS - state.count;
      if (left <= 0) {
        setLockMsg(`Too many failed attempts. Account locked for ${LOCKOUT_MS / 60000} minutes.`);
        setError("");
      } else {
        setError(`Invalid credentials. ${left} attempt${left !== 1 ? "s" : ""} remaining.`);
      }
    }
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-start pl-16 md:pl-24">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${base}login-bg.png)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,30,0.72) 0%, rgba(10,4,30,0.45) 40%, rgba(10,4,30,0.55) 70%, rgba(10,4,30,0.88) 100%)",
        }}
      />

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

      <div
        className="login-card relative z-10 w-full max-w-sm rounded-2xl p-8 flex flex-col"
        style={{
          background: "rgba(10,4,28,0.80)",
          border: "1px solid rgba(167,139,250,0.28)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="flex justify-center mb-5">
          <img
            src={`${base}aces-logo-login.png`}
            alt="ACES Managed Services"
            className="h-24 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(220,38,38,0.5))" }}
          />
        </div>

        <div className="text-center mb-6">
          <div
            className="text-sm font-bold text-center leading-relaxed"
            style={{ color: "rgba(209,196,233,0.85)", fontFamily: "Verdana, sans-serif", letterSpacing: "0.04em" }}
          >
            COW Energy &amp; Environmental Risk Scenarios<br />Dashboard
          </div>
        </div>

        {lockMsg ? (
          <div
            className="rounded-lg px-3 py-3 text-xs font-bold text-center"
            style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.4)",
              color: "#fca5a5",
              fontFamily: "Verdana, sans-serif",
            }}
          >
            🔒 {lockMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="on">
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
                  type={showPass ? "text" : "password"}
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
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                  style={{ color: "#a78bca", fontFamily: "Verdana, sans-serif" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c084fc")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a78bca")}
                >
                  {showPass ? "Hide" : "Show"}
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
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2"
        style={{ background: "rgba(10,4,28,0.75)", borderTop: "1px solid rgba(107,33,200,0.2)" }}
      >
        <span
          className="text-sm font-black tracking-widest"
          style={{ color: "#7f1d1d", fontFamily: "Verdana, sans-serif" }}
        >
          Powered By
        </span>
        <span
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: "#001f5b", fontFamily: "Verdana, sans-serif" }}
        >
          ACES MSD
        </span>
      </div>
    </div>
  );
}
