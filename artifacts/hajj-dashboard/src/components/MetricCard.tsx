import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "green" | "yellow" | "red" | "blue" | "purple" | "default";
  large?: boolean;
}

const colorMap = {
  green:   { grad: "from-emerald-500 to-green-600",   glow: "rgba(16,185,129,0.35)",  bar: "linear-gradient(90deg,#065f46,#10b981,#6ee7b7,#34d399,#059669)" },
  yellow:  { grad: "from-amber-400 to-orange-500",    glow: "rgba(245,158,11,0.35)",   bar: "linear-gradient(90deg,#92400e,#f59e0b,#fde68a,#fbbf24,#d97706)" },
  red:     { grad: "from-red-500 to-rose-600",        glow: "rgba(239,68,68,0.35)",    bar: "linear-gradient(90deg,#7f1d1d,#ef4444,#fca5a5,#f87171,#dc2626)" },
  blue:    { grad: "from-sky-500 to-blue-600",        glow: "rgba(14,165,233,0.35)",   bar: "linear-gradient(90deg,#0c4a6e,#0ea5e9,#bae6fd,#38bdf8,#0284c7)" },
  purple:  { grad: "from-purple-600 to-violet-700",   glow: "rgba(147,51,234,0.45)",   bar: "linear-gradient(90deg,#4c1d95,#7c3aed,#c084fc,#a855f7,#6d28d9)" },
  default: { grad: "from-slate-500 to-slate-600",     glow: "rgba(100,116,139,0.25)",  bar: "linear-gradient(90deg,#1e293b,#64748b,#cbd5e1,#94a3b8,#475569)" },
};

export function MetricCard({ title, value, subtitle, icon, color = "default", large = false }: MetricCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 group cursor-default"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(147,51,234,0.18)",
        boxShadow: `0 4px 16px ${c.glow}, 0 1px 4px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.04) inset`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 12px 32px ${c.glow}, 0 4px 12px rgba(0,0,0,0.14), 0 0 0 1px rgba(192,132,252,0.18) inset`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 4px 16px ${c.glow}, 0 1px 4px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.04) inset`;
      }}
    >
      <div style={{ height: 4, background: c.bar, borderRadius: "12px 12px 0 0", boxShadow: `0 2px 8px ${c.glow}` }} />
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent 5%,rgba(192,132,252,0.22) 40%,rgba(255,255,255,0.12) 55%,rgba(192,132,252,0.22) 70%,transparent 95%)" }} />

      <div className="absolute top-8 right-0 w-24 h-24 rounded-full opacity-[0.06] blur-2xl pointer-events-none"
        style={{ background: c.bar }} />

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide leading-tight">{title}</span>
          {icon && (
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
              style={{ boxShadow: `0 4px 12px ${c.glow}, 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)` }}
            >
              {icon}
            </div>
          )}
        </div>
        <div className={`font-black text-foreground ${large ? "text-4xl" : "text-2xl"} tracking-tight`}>{value}</div>
        {subtitle && <div className="text-[11px] text-muted-foreground leading-tight">{subtitle}</div>}
      </div>
    </div>
  );
}
