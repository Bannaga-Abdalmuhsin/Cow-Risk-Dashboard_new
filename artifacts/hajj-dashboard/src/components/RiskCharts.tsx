import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import type { SiteAnalysis } from "../lib/calculations";

interface RiskChartsProps {
  analyses: SiteAnalysis[];
  glass?: boolean;
  compact?: boolean;
}

const COLORS = { safe: "#00BFB3", risk: "#E8175D" };

const GLASS_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(107,33,200,0.30)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
};

export function RiskDistributionPie({ analyses, glass, compact }: RiskChartsProps) {
  const safe = analyses.filter(a => a.overallRisk === "safe").length;
  const risk = analyses.filter(a => a.overallRisk === "risk").length;
  const total = safe + risk;
  const data = [
    { name: "Safe", value: safe, color: COLORS.safe },
    { name: "Risk", value: risk, color: COLORS.risk },
  ];
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const svgSize = compact ? 100 : 160;
  const r = compact ? 36 : 60;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const strokeW = compact ? 14 : 22;
  const C = 2 * Math.PI * r;
  const gap = 3;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} ${compact ? "p-2.5" : "p-4"}`}>
        <div className={`font-semibold ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}>Overall Risk Distribution</div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative" style={{ width: svgSize, height: svgSize }}>
            <svg width={svgSize} height={svgSize}>
              {(() => {
                let accumulated = 0;
                return data.map((entry) => {
                  const arc = (entry.value / total) * C - gap;
                  const offset = -accumulated;
                  accumulated += arc + gap;
                  return (
                    <circle key={entry.name}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={entry.color}
                      strokeWidth={strokeW}
                      strokeDasharray={`${arc} ${C}`}
                      strokeDashoffset={offset}
                      strokeLinecap="butt"
                      style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`font-bold leading-none ${compact ? "text-xl" : "text-3xl"}`}>{total}</span>
              <span className={`text-muted-foreground mt-0.5 ${compact ? "text-[9px]" : "text-xs"}`}>surveyed</span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="rounded-sm flex-shrink-0" style={{ width: compact ? 8 : 12, height: compact ? 8 : 12, backgroundColor: entry.color }} />
                  <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>{entry.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${compact ? "text-xs" : "text-sm"}`}>{entry.value}</span>
                  <span className={`text-muted-foreground w-8 text-right ${compact ? "text-[9px]" : "text-xs"}`}>{pct(entry.value)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PowerSourceDonut({ analyses, glass, compact }: RiskChartsProps) {
  const withBackup    = analyses.filter(a => a.site.powerConfig === "commercial_with_backup").length;
  const withoutBackup = analyses.filter(a => a.site.powerConfig === "single_generator").length;
  const total = withBackup + withoutBackup;
  const data = [
    { name: "Prime + Backup", value: withBackup,    color: "#6B21A8" },
    { name: "Prime Only",     value: withoutBackup, color: "#F59E0B" },
  ];
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const svgSize = compact ? 100 : 160;
  const r = compact ? 36 : 60;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const strokeW = compact ? 14 : 22;
  const C = 2 * Math.PI * r;
  const gap = 3;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} ${compact ? "p-2.5" : "p-4"}`}>
        <div className={`font-semibold ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}>Power Source Distribution</div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative" style={{ width: svgSize, height: svgSize }}>
            <svg width={svgSize} height={svgSize}>
              {(() => {
                let accumulated = 0;
                return data.map((entry) => {
                  const arc = (entry.value / total) * C - gap;
                  const offset = -accumulated;
                  accumulated += arc + gap;
                  return (
                    <circle key={entry.name}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={entry.color}
                      strokeWidth={strokeW}
                      strokeDasharray={`${arc} ${C}`}
                      strokeDashoffset={offset}
                      strokeLinecap="butt"
                      style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`font-bold leading-none ${compact ? "text-xl" : "text-3xl"}`}>{total}</span>
              <span className={`text-muted-foreground mt-0.5 ${compact ? "text-[9px]" : "text-xs"}`}>surveyed</span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="rounded-sm flex-shrink-0" style={{ width: compact ? 8 : 12, height: compact ? 8 : 12, backgroundColor: entry.color }} />
                  <span className={`font-medium ${compact ? "text-[10px]" : "text-sm"}`}>{entry.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${compact ? "text-xs" : "text-sm"}`}>{entry.value}</span>
                  <span className={`text-muted-foreground w-7 text-right ${compact ? "text-[9px]" : "text-xs"}`}>{pct(entry.value)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RiskTypeBreakdown({ analyses, glass, compact }: RiskChartsProps) {
  const byType: Record<"safe" | "risk", number> = { safe: 0, risk: 0 };
  const counts = { power: { ...byType }, cooling: { ...byType }, battery: { ...byType }, rectifier: { ...byType } };
  for (const a of analyses) {
    for (const s of a.scenarios) {
      counts.power[s.powerRisk]++;
      counts.cooling[s.coolingRisk]++;
      counts.battery[s.batteryRisk]++;
      counts.rectifier[s.rectifierRisk]++;
    }
  }
  const data = [
    { category: "Power",     safe: counts.power.safe,     risk: counts.power.risk },
    { category: "Cooling",   safe: counts.cooling.safe,   risk: counts.cooling.risk },
    { category: "Battery",   safe: counts.battery.safe,   risk: counts.battery.risk },
    { category: "Rectifier", safe: counts.rectifier.safe, risk: counts.rectifier.risk },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} ${compact ? "p-2.5" : "p-4"}`}>
        <div className={`font-semibold ${compact ? "text-xs mb-1" : "text-sm mb-3"}`}>Risk Type Breakdown</div>
        <ResponsiveContainer width="100%" height={compact ? 110 : 180}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: compact ? -28 : -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="category" tick={{ fontSize: compact ? 9 : 11 }} />
            <YAxis tick={{ fontSize: compact ? 8 : 10 }} />
            <Tooltip />
            <Legend iconSize={8} wrapperStyle={{ fontSize: compact ? 9 : 11 }} />
            <Bar dataKey="safe" name="Safe" fill={COLORS.safe} stackId="a" />
            <Bar dataKey="risk" name="Risk" fill={COLORS.risk} stackId="a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LocationRiskChart({ analyses, glass, compact }: RiskChartsProps) {
  const byLoc: Record<string, { safe: number; risk: number }> = {};
  for (const a of analyses) {
    const loc = a.site.location;
    if (!byLoc[loc]) byLoc[loc] = { safe: 0, risk: 0 };
    byLoc[loc][a.overallRisk]++;
  }
  const data = Object.entries(byLoc).map(([loc, counts]) => ({
    location: loc.replace("Jeddah Islamic Port", "Jeddah").replace("Jeddah-Makkah Highway", "Highway"),
    ...counts,
  }));

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} ${compact ? "p-2.5" : "p-4"}`}>
        <div className={`font-semibold ${compact ? "text-xs mb-1" : "text-sm mb-3"}`}>Risk by Location</div>
        <ResponsiveContainer width="100%" height={compact ? 120 : 200}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: compact ? -28 : -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="location" tick={{ fontSize: compact ? 8 : 9 }} angle={-20} textAnchor="end" height={compact ? 36 : 50} />
            <YAxis tick={{ fontSize: compact ? 8 : 10 }} />
            <Tooltip />
            <Legend iconSize={8} wrapperStyle={{ fontSize: compact ? 9 : 11 }} />
            <Bar dataKey="safe" name="Safe" fill={COLORS.safe} stackId="a" />
            <Bar dataKey="risk" name="Risk" fill={COLORS.risk} stackId="a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
