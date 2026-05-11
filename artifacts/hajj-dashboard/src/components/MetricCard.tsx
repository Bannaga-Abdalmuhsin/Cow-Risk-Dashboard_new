import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "green" | "yellow" | "red" | "blue" | "default";
  large?: boolean;
  compact?: boolean;
}

const colorMap = {
  green: "from-emerald-500 to-green-600",
  yellow: "from-amber-400 to-orange-500",
  red: "from-red-500 to-rose-600",
  blue: "from-sky-500 to-blue-600",
  default: "from-slate-500 to-slate-600",
};

export function MetricCard({ title, value, subtitle, icon, color = "default", large = false, compact = false }: MetricCardProps) {
  return (
    <div
      className="bg-card border border-card-border rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c084fc, #a855f7, #6d28d9)",
          boxShadow: "0 2px 8px rgba(147,51,234,0.55), 0 1px 0 rgba(192,132,252,0.4)",
          borderRadius: "12px 12px 0 0",
        }}
      />
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(192,132,252,0.25) 30%, rgba(255,255,255,0.18) 50%, rgba(192,132,252,0.25) 70%, transparent 95%)",
        }}
      />

      {compact ? (
        <div className="px-3 py-1.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground font-medium leading-tight truncate">{title}</div>
            <div className="text-lg font-bold text-foreground leading-tight">{value}</div>
          </div>
          {icon && (
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shrink-0`}>
              {icon}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">{title}</span>
            {icon && (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white`}>
                {icon}
              </div>
            )}
          </div>
          <div className={`font-bold text-foreground ${large ? "text-4xl" : "text-2xl"}`}>{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      )}
    </div>
  );
}
