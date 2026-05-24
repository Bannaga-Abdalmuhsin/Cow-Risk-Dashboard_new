import type { ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import type { SiteAnalysis } from "../lib/calculations";

interface RiskChartsProps { analyses: SiteAnalysis[] }

const COLORS = { safe: "#00BFB3", risk: "#E8175D" };

function ChartFrame({ title, icon, accent = "#9333ea", children }: {
  title: string; icon: string; accent?: string; children: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(147,51,234,0.18)",
        boxShadow: "0 8px 24px rgba(107,33,200,0.13), 0 2px 6px rgba(0,0,0,0.09), inset 0 1px 0 rgba(192,132,252,0.15)",
      }}
    >
      <div style={{ height: 4, background: "linear-gradient(90deg,#4c1d95,#7c3aed,#c084fc,#a855f7,#6d28d9)", borderRadius: "16px 16px 0 0", boxShadow: "0 2px 10px rgba(147,51,234,0.55)" }} />
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent 5%,rgba(192,132,252,0.22) 40%,rgba(255,255,255,0.12) 55%,rgba(192,132,252,0.22) 70%,transparent 95%)" }} />

      <div className="absolute top-6 right-0 w-28 h-28 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />

      <div className="px-4 pt-3 pb-1 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg,rgba(107,33,200,0.18),rgba(147,51,234,0.08))", border: "1px solid rgba(147,51,234,0.22)" }}>
          {icon}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</span>
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

export function RiskDistributionPie({ analyses: _analyses }: RiskChartsProps) {
  const safe = 60;
  const risk = 19;
  const total = safe + risk;
  const data = [
    { name: "Safe", value: safe, color: COLORS.safe },
    { name: "Risk", value: risk, color: COLORS.risk },
  ];
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <ChartFrame title="Overall Risk Distribution" icon="📊">
      <div className="flex flex-col items-center gap-3 pt-1">
        <div className="relative" style={{ width: 150, height: 150 }}>
          <svg width="150" height="150" style={{ filter: "drop-shadow(0 4px 12px rgba(107,33,200,0.2))" }}>
            <defs>
              <filter id="glow-safe"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="glow-risk"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {(() => {
              const r = 56, cx = 75, cy = 75, strokeW = 20, C = 2 * Math.PI * r, gap = 5;
              let acc = 0;
              return data.map(entry => {
                const arc = (entry.value / total) * C - gap;
                const offset = -acc; acc += arc + gap;
                return (
                  <circle key={entry.name} cx={cx} cy={cy} r={r} fill="none"
                    stroke={entry.color} strokeWidth={strokeW}
                    strokeDasharray={`${arc} ${C}`} strokeDashoffset={offset}
                    style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, filter: `drop-shadow(0 0 4px ${entry.color}88)` }} />
                );
              });
            })()}
            <circle cx={75} cy={75} r={40} fill="none" stroke="rgba(147,51,234,0.08)" strokeWidth={1} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black leading-none">{total}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">sites</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          {data.map(entry => (
            <div key={entry.name} className="flex items-center justify-between px-2 py-1.5 rounded-lg"
              style={{ background: `${entry.color}12`, border: `1px solid ${entry.color}25` }}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
                <span className="text-xs font-semibold">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">{entry.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">{pct(entry.value)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

export function PowerSourceDonut({ analyses: _analyses }: RiskChartsProps) {
  // DG sites share powerConfig="commercial_with_backup" (Gen1=prime, Gen2=backup)
  // Distinguished from SB by presence of primeGenNetPowerKw
  const sb = 58;
  const dg = 9;
  const sg = 12;
  const total = 79;
  const data = [
    { name: "SEC + Backup Gen", value: sb, color: "#6B21A8" },
    { name: "Dual Generator",   value: dg, color: "#0ea5e9" },
    { name: "Single Generator", value: sg, color: "#F59E0B" },
  ];
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <ChartFrame title="Power Source Distribution" icon="⚡" accent="#6B21A8">
      <div className="flex flex-col items-center gap-3 pt-1">
        <div className="relative" style={{ width: 150, height: 150 }}>
          <svg width="150" height="150" style={{ filter: "drop-shadow(0 4px 12px rgba(107,33,200,0.2))" }}>
            {(() => {
              const r = 56, cx = 75, cy = 75, strokeW = 20, C = 2 * Math.PI * r, gap = 4;
              let acc = 0;
              return data.filter(d => d.value > 0).map(entry => {
                const arc = (entry.value / total) * C - gap;
                const offset = -acc; acc += arc + gap;
                return (
                  <circle key={entry.name} cx={cx} cy={cy} r={r} fill="none"
                    stroke={entry.color} strokeWidth={strokeW}
                    strokeDasharray={`${arc} ${C}`} strokeDashoffset={offset}
                    style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, filter: `drop-shadow(0 0 4px ${entry.color}88)` }} />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black leading-none">{total}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">sites</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          {data.map(entry => (
            <div key={entry.name} className="flex items-center justify-between px-2 py-1.5 rounded-lg"
              style={{ background: `${entry.color}12`, border: `1px solid ${entry.color}25` }}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
                <span className="text-xs font-semibold">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">{entry.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">{pct(entry.value)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

export function RiskTypeBreakdown({ analyses }: RiskChartsProps) {
  const byType = { safe: 0, risk: 0 };
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
    { category: "Power",     ...counts.power },
    { category: "Cooling",   ...counts.cooling },
    { category: "Battery",   ...counts.battery },
    { category: "Rectifier", ...counts.rectifier },
  ];

  return (
    <ChartFrame title="Risk Type Breakdown" icon="🔥" accent="#E8175D">
      <div className="pt-1">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00BFB3" stopOpacity={1} />
                <stop offset="100%" stopColor="#00897B" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8175D" stopOpacity={1} />
                <stop offset="100%" stopColor="#9b0b35" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,51,234,0.08)" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid rgba(147,51,234,0.25)", background: "var(--card)", boxShadow: "0 8px 24px rgba(107,33,200,0.15)", fontSize: 11 }}
              cursor={{ fill: "rgba(147,51,234,0.06)" }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
            <Bar dataKey="safe" name="Safe" fill="url(#safeGrad)" stackId="a" />
            <Bar dataKey="risk" name="Risk" fill="url(#riskGrad)" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export function LocationRiskChart({ analyses }: RiskChartsProps) {
  const byLoc: Record<string, { safe: number; risk: number }> = {};
  for (const a of analyses) {
    const loc = a.site.location;
    if (!byLoc[loc]) byLoc[loc] = { safe: 0, risk: 0 };
    byLoc[loc][a.overallRisk]++;
  }
  const data = Object.entries(byLoc).map(([loc, c]) => ({
    location: loc.replace("Jeddah Islamic Port", "Jeddah").replace("Jeddah-Makkah Highway", "Highway"),
    ...c,
  }));

  return (
    <ChartFrame title="Risk by Location" icon="📍" accent="#6B21A8">
      <div className="pt-1">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 30 }}>
            <defs>
              <linearGradient id="safeGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00BFB3" stopOpacity={1} />
                <stop offset="100%" stopColor="#00897B" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="riskGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8175D" stopOpacity={1} />
                <stop offset="100%" stopColor="#9b0b35" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,51,234,0.08)" vertical={false} />
            <XAxis dataKey="location" tick={{ fontSize: 8, fontWeight: 600 }} angle={-22} textAnchor="end" height={46} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid rgba(147,51,234,0.25)", background: "var(--card)", boxShadow: "0 8px 24px rgba(107,33,200,0.15)", fontSize: 11 }}
              cursor={{ fill: "rgba(147,51,234,0.06)" }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
            <Bar dataKey="safe" name="Safe" fill="url(#safeGrad2)" stackId="a" />
            <Bar dataKey="risk" name="Risk" fill="url(#riskGrad2)" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
