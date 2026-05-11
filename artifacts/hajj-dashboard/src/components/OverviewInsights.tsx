import { AlertTriangle } from "lucide-react";
import type { SiteAnalysis } from "../lib/calculations";

interface Props {
  analyses: SiteAnalysis[];
  glass?: boolean;
}

const GLASS_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(107,33,200,0.30)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
};

// ── Sites Needing Action ──────────────────────────────────────────────────────
export function ActionSitesCard({ analyses, glass }: Props) {
  const noBackup = analyses.filter(a =>
    a.site.powerConfig === "single_generator" &&
    a.overallRisk === "risk"
  );

  const sections = [
    {
      label: "No Backup (Single-Gen at Risk)",
      sites: noBackup,
      icon: <AlertTriangle size={11} />,
      bg: "#fce4ed",
      border: "#E8175D",
      color: "#b01040",
      dot: "#E8175D",
    },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} p-3 space-y-2`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
            <AlertTriangle size={13} />
          </div>
          <div>
            <div className="font-semibold text-xs">Sites Needing Action</div>
            <div className="text-[10px] text-muted-foreground">SG sites requiring intervention</div>
          </div>
        </div>

        <div className="space-y-1.5">
          {sections.map(({ label, sites, icon, bg, border, color, dot }) => (
            <div key={label} className="rounded-lg border px-2.5 py-1.5"
              style={{ background: bg, borderColor: border }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-xs font-bold" style={{ color }}>
                  {icon && <span style={{ color }}>{icon}</span>}
                  <span className="text-[10px]">{label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color }}>{sites.length}</span>
              </div>
              {sites.length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {sites.slice(0, 6).map(a => (
                    <span key={a.site.id}
                      className="text-[9px] font-bold font-mono px-1 py-0.5 rounded border"
                      style={{ background: "white", borderColor: dot, color }}>
                      {a.site.id}
                    </span>
                  ))}
                  {sites.length > 6 && (
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ color }}>
                      +{sites.length - 6} more
                    </span>
                  )}
                </div>
              )}
              {sites.length === 0 && (
                <div className="text-[9px]" style={{ color }}>✓ No issues detected</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
