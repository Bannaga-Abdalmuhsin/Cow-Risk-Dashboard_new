import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import type { SiteAnalysis } from "../lib/calculations";

interface RiskChartsProps {
  analyses: SiteAnalysis[];
}

const COLORS = {
  safe: "#00BFB3",
  risk: "#E8175D",
};

export function RiskDistributionPie({ analyses }: RiskChartsProps) {
  const safe = analyses.filter(a => a.overallRisk === "safe").length;
  const risk = analyses.filter(a => a.overallRisk === "risk").length;
  const total = safe + risk;

  const data = [
    { name: "Safe", value: safe, color: COLORS.safe },
    { name: "Risk", value: risk, color: COLORS.risk },
  ];

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-sm mb-3">Overall Risk Distribution</div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160">
            {(() => {
              const r = 60, cx = 80, cy = 80, strokeW = 22;
              const C = 2 * Math.PI * r;
              const gap = 4;
              let accumulated = 0;
              return data.map((entry) => {
                const arc = (entry.value / total) * C - gap;
                const offset = -accumulated;
                accumulated += arc + gap;
                return (
                  <circle
                    key={entry.name}
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
            <span className="text-3xl font-bold leading-none">{total}</span>
            <span className="text-xs text-muted-foreground mt-1">surveyed</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm flex-shrink-0"
                  style={{ width: 12, height: 12, backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{entry.value}</span>
                <span className="text-xs text-muted-foreground w-8 text-right">{pct(entry.value)}%</span>
              </div>
            </div>
          ))}
          <div className="border-t border-card-border pt-2 mt-1 text-center">
            <span className="text-xs text-muted-foreground">63 surveyed · 31 pending survey</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PowerSourceDonut({ analyses }: RiskChartsProps) {
  const withBackup  = analyses.filter(a => a.site.powerConfig === "commercial_with_backup").length;
  const withoutBackup = analyses.filter(a => a.site.powerConfig === "single_generator").length;
  const total = withBackup + withoutBackup;

  const data = [
    { name: "Prime + Backup",   value: withBackup,    color: "#6B21A8" },
    { name: "Prime Only",       value: withoutBackup, color: "#F59E0B" },
  ];

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-sm mb-3">Power Source Distribution</div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160">
            {(() => {
              const r = 60, cx = 80, cy = 80, strokeW = 22;
              const C = 2 * Math.PI * r;
              const gap = 4;
              let accumulated = 0;
              return data.map((entry) => {
                const arc = (entry.value / total) * C - gap;
                const offset = -accumulated;
                accumulated += arc + gap;
                return (
                  <circle
                    key={entry.name}
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
            <span className="text-3xl font-bold leading-none">{total}</span>
            <span className="text-xs text-muted-foreground mt-1">surveyed</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-sm flex-shrink-0" style={{ width: 12, height: 12, backgroundColor: entry.color }} />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{entry.value}</span>
                <span className="text-xs text-muted-foreground w-8 text-right">{pct(entry.value)}%</span>
              </div>
            </div>
          ))}
          <div className="border-t border-card-border pt-2 mt-1 text-center">
            <span className="text-xs text-muted-foreground">SEC+Gen vs Single Gen sites</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RiskTypeBreakdown({ analyses }: RiskChartsProps) {
  const byType: Record<"safe" | "risk", number> = { safe: 0, risk: 0 };

  const counts = {
    power: { ...byType },
    cooling: { ...byType },
    battery: { ...byType },
    rectifier: { ...byType },
  };

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
    <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-sm mb-3">Risk Type Breakdown (All Scenarios)</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="safe" name="Safe" fill={COLORS.safe} stackId="a" />
          <Bar dataKey="risk" name="Risk" fill={COLORS.risk} stackId="a" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LocationRiskChart({ analyses }: RiskChartsProps) {
  const byLoc: Record<string, { safe: number; risk: number }> = {};

  for (const a of analyses) {
    const loc = a.site.location;
    if (!byLoc[loc]) byLoc[loc] = { safe: 0, risk: 0 };
    byLoc[loc][a.overallRisk]++;
  }

  const data = Object.entries(byLoc).map(([loc, counts]) => ({
    location: loc.replace("Jeddah Islamic Port", "Jeddah Port").replace("Jeddah-Makkah Highway", "Highway"),
    ...counts,
  }));

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-sm mb-3">Risk by Location</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="location" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="safe" name="Safe" fill={COLORS.safe} stackId="a" />
          <Bar dataKey="risk" name="Risk" fill={COLORS.risk} stackId="a" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
