import { AlertTriangle, MapPin, Zap, Battery } from "lucide-react";
import type { SiteAnalysis } from "../lib/calculations";

interface Props { analyses: SiteAnalysis[] }

// ── Risk by Area ──────────────────────────────────────────────────────────────
export function RiskByAreaCard({ analyses }: Props) {
  const byLoc: Record<string, { risk: number; total: number }> = {};
  for (const a of analyses) {
    const loc = a.site.location;
    if (!byLoc[loc]) byLoc[loc] = { risk: 0, total: 0 };
    byLoc[loc].total++;
    if (a.overallRisk === "risk") byLoc[loc].risk++;
  }

  const entries = Object.entries(byLoc).sort((a, b) => b[1].risk - a[1].risk);

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white">
          <MapPin size={16} />
        </div>
        <div>
          <div className="font-semibold text-sm">Risk by Area</div>
          <div className="text-xs text-muted-foreground">At-risk sites per zone</div>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map(([loc, { risk, total }]) => {
          const pct = total > 0 ? (risk / total) * 100 : 0;
          const safePct = 100 - pct;
          return (
            <div key={loc}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{loc}</span>
                <div className="flex items-center gap-1.5">
                  {risk > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#fce4ed", color: "#b01040" }}>
                      {risk} risk
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{total} total</span>
                </div>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full transition-all" style={{ width: `${pct}%`, background: "#E8175D" }} />
                <div className="h-full transition-all" style={{ width: `${safePct}%`, background: "#00BFB3" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#E8175D" }} /> At Risk</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#00BFB3" }} /> Safe</span>
      </div>
    </div>
  );
}

// ── Sites Needing Action ──────────────────────────────────────────────────────
export function ActionSitesCard({ analyses }: Props) {
  // Prime undersized: at risk in any of S1–S4 (prime power scenarios, idx 0-3)
  const primeFail = analyses.filter(a =>
    a.scenarios.slice(0, 4).some(s => s.powerRisk === "risk")
  );

  // Backup undersized: SB sites at risk in any of S5–S8 (backup scenarios, idx 4-7)
  const backupFail = analyses.filter(a =>
    a.site.powerConfig === "commercial_with_backup" &&
    a.scenarios.slice(4, 8).some(s => s.powerRisk === "risk")
  );

  // SG sites flagged in S5-S8 (no backup at all)
  const noBackup = analyses.filter(a =>
    a.site.powerConfig === "single_generator" &&
    a.overallRisk === "risk"
  );

  const sections = [
    {
      label: "Undersized Prime Generator",
      sites: primeFail,
      icon: <Zap size={13} />,
      bg: "#fff3cd",
      border: "#f59e0b",
      color: "#92400e",
      dot: "#f59e0b",
    },
    {
      label: "Undersized Backup Generator",
      sites: backupFail,
      icon: <Battery size={13} />,
      bg: "#fce4ed",
      border: "#E8175D",
      color: "#b01040",
      dot: "#E8175D",
    },
    {
      label: "No Backup (Single-Gen Sites)",
      sites: noBackup,
      icon: <AlertTriangle size={13} />,
      bg: "#f3f4f6",
      border: "#6b7280",
      color: "#374151",
      dot: "#6b7280",
    },
  ];

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
          <AlertTriangle size={16} />
        </div>
        <div>
          <div className="font-semibold text-sm">Sites Needing Action</div>
          <div className="text-xs text-muted-foreground">Generator capacity issues</div>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map(({ label, sites, icon, bg, border, color, dot }) => (
          <div key={label} className="rounded-lg border px-3 py-2"
            style={{ background: bg, borderColor: border }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                <span style={{ color }}>{icon}</span>
                {label}
              </div>
              <span className="text-lg font-bold" style={{ color }}>{sites.length}</span>
            </div>
            {sites.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sites.slice(0, 8).map(a => (
                  <span key={a.site.id}
                    className="text-[9px] font-mono px-1 py-0.5 rounded border"
                    style={{ background: "white", borderColor: dot, color }}>
                    {a.site.id}
                  </span>
                ))}
                {sites.length > 8 && (
                  <span className="text-[9px] px-1 py-0.5 rounded" style={{ color }}>
                    +{sites.length - 8} more
                  </span>
                )}
              </div>
            )}
            {sites.length === 0 && (
              <div className="text-[10px]" style={{ color }}>✓ No issues detected</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
