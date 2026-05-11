import { AlertTriangle } from "lucide-react";
import type { SiteAnalysis } from "../lib/calculations";

interface Props { analyses: SiteAnalysis[] }

// ── Sites Needing Action ──────────────────────────────────────────────────────
export function ActionSitesCard({ analyses }: Props) {
  // SG sites with overall power risk (no commercial backup)
  const noBackup = analyses.filter(a =>
    a.site.powerConfig === "single_generator" &&
    a.overallRisk === "risk"
  );

  const sections = [
    {
      label: "No Backup (Single-Gen at Risk)",
      sites: noBackup,
      icon: <AlertTriangle size={13} />,
      bg: "#fce4ed",
      border: "#E8175D",
      color: "#b01040",
      dot: "#E8175D",
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
          <div className="text-xs text-muted-foreground">SG sites requiring intervention</div>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map(({ label, sites, icon, bg, border, color, dot }) => (
          <div key={label} className="rounded-lg border px-3 py-2"
            style={{ background: bg, borderColor: border }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
                {icon && <span style={{ color }}>{icon}</span>}
                {label}
              </div>
              <span className="text-lg font-bold" style={{ color }}>{sites.length}</span>
            </div>
            {sites.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sites.slice(0, 8).map(a => (
                  <span key={a.site.id}
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded border"
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
