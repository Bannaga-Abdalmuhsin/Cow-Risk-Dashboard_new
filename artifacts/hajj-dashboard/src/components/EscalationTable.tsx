import { Clock, AlertTriangle, Zap, Thermometer, Radio, MapPin } from "lucide-react";
import { MC_CLUSTERS, TRANSPORT_ICON } from "../lib/escalationTeams";
import type { SiteAnalysis } from "../lib/calculations";

interface EscalationTableProps {
  analyses: SiteAnalysis[];
  onSelectSite: (id: string) => void;
  selectedSiteId: string | null;
}

const LOCATION_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  "Arafat":        { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
  "Mina":          { bg: "#ede9fe", text: "#4c1d95", border: "#8b5cf6" },
  "Muzdalifah":    { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
  "Makkah Remote": { bg: "#fee2e2", text: "#7f1d1d", border: "#ef4444" },
};

export function EscalationTable({ analyses, onSelectSite, selectedSiteId }: EscalationTableProps) {
  const analysisByID = Object.fromEntries(analyses.map(a => [a.site.id, a]));

  const clusterRiskFlags = (siteIds: string[]) => {
    const flags = new Set<string>();
    for (const sid of siteIds) {
      const a = analysisByID[sid];
      if (!a) continue;
      for (const sc of a.scenarios) {
        if (sc.powerRisk     === "risk") flags.add("Power");
        if (sc.rectifierRisk === "risk") flags.add("Rectifier");
        if (sc.coolingRisk   === "risk" && sc.scenarioId !== 9) flags.add("Cooling");
      }
    }
    return Array.from(flags);
  };

  const clusterOverallRisk = (siteIds: string[]) =>
    siteIds.some(sid => analysisByID[sid]?.overallRisk === "risk") ? "risk" : "safe";

  const totalClusters  = MC_CLUSTERS.length;
  const riskyClusters  = MC_CLUSTERS.filter(c => clusterOverallRisk(c.siteIds) === "risk").length;
  const anchorSiteId   = (c: typeof MC_CLUSTERS[0]) =>
    c.siteIds.find(sid => analysisByID[sid]) ?? c.siteIds[0];

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-card-border flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #4A0E8F 0%, #6d28d9 100%)" }}
      >
        <div className="flex items-center gap-2 text-white">
          <AlertTriangle size={16} />
          <span className="font-semibold text-sm">1st Escalation Team Clusters — Hajj MC Deployment</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1">
          <Clock size={12} className="text-white" />
          <span className="text-white text-[11px] font-semibold">15 min ETA — Arafat · Mina · Muzdalifah</span>
        </div>
      </div>

      {/* Issue type legend */}
      <div className="px-4 py-2 border-b border-card-border bg-muted/30 flex items-center gap-4 flex-wrap text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1"><Zap size={11} className="text-red-500" /><span>Power issue</span></div>
        <div className="flex items-center gap-1"><Radio size={11} className="text-orange-500" /><span>Rectifier issue</span></div>
        <div className="flex items-center gap-1"><Thermometer size={11} className="text-blue-500" /><span>AC/Cooling issue</span></div>
        <span className="ml-auto italic">
          {riskyClusters > 0
            ? <span style={{ color: "#b01040" }}>{riskyClusters} cluster{riskyClusters > 1 ? "s" : ""} with risk sites</span>
            : <span style={{ color: "#059669" }}>All clusters safe</span>}
          {" "}· {totalClusters} teams · click row to inspect MC site
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-[11px] text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-3 py-2 font-semibold">Team Member</th>
              <th className="text-left px-3 py-2 font-semibold">Hajj MC</th>
              <th className="text-left px-3 py-2 font-semibold">Zone</th>
              <th className="text-center px-3 py-2 font-semibold">Sites</th>
              <th className="text-left px-3 py-2 font-semibold">Transport</th>
              <th className="text-left px-3 py-2 font-semibold">ETA</th>
              <th className="text-left px-3 py-2 font-semibold">Active Issues</th>
              <th className="text-left px-3 py-2 font-semibold">Cluster Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {MC_CLUSTERS.map(cluster => {
              const riskFlags    = clusterRiskFlags(cluster.siteIds);
              const overallRisk  = clusterOverallRisk(cluster.siteIds);
              const locStyle     = LOCATION_COLOR[cluster.location] ?? { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" };
              const anchor       = anchorSiteId(cluster);
              const isSelected   = cluster.siteIds.includes(selectedSiteId ?? "");
              const knownSites   = cluster.siteIds.filter(sid => analysisByID[sid]).length;

              return (
                <tr
                  key={cluster.teamName}
                  className={`cursor-pointer transition-colors hover:bg-muted/40 ${isSelected ? "bg-purple-50 ring-1 ring-inset ring-purple-400" : ""}`}
                  onClick={() => anchor && onSelectSite(anchor)}
                >
                  {/* Team member */}
                  <td className="px-3 py-2.5">
                    <span className="font-bold text-xs" style={{ color: "#4A0E8F" }}>{cluster.teamName}</span>
                  </td>

                  {/* Hajj MC */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-purple-400 shrink-0" />
                      <span className="font-mono text-xs font-semibold">{cluster.mcId}</span>
                    </div>
                  </td>

                  {/* Zone */}
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: locStyle.bg, color: locStyle.text, border: `1px solid ${locStyle.border}` }}
                    >
                      {cluster.location}
                    </span>
                  </td>

                  {/* Site count */}
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-xs font-bold">{knownSites}</span>
                    <span className="text-[10px] text-muted-foreground">/{cluster.siteIds.length}</span>
                  </td>

                  {/* Transport */}
                  <td className="px-3 py-2.5">
                    <span className="text-sm">{TRANSPORT_ICON[cluster.transport]}</span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground hidden lg:inline">{cluster.transport}</span>
                  </td>

                  {/* ETA */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className={cluster.etaMinutes === 15 ? "text-emerald-600" : "text-amber-500"} />
                      <span
                        className="text-xs font-bold"
                        style={{ color: cluster.etaMinutes === 15 ? "#059669" : "#d97706" }}
                      >
                        {cluster.etaMinutes} min
                      </span>
                    </div>
                  </td>

                  {/* Active Issues */}
                  <td className="px-3 py-2.5">
                    {riskFlags.length === 0 ? (
                      <span className="text-[10px] text-emerald-600 font-medium">No issues</span>
                    ) : (
                      <div className="flex gap-1 flex-wrap">
                        {riskFlags.map(f => (
                          <span
                            key={f}
                            className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: "#fce4ed", color: "#b01040", border: "1px solid #E8175D" }}
                          >
                            {f === "Power"     ? <><Zap       size={9} className="inline mr-0.5" />{f}</> :
                             f === "Rectifier" ? <><Radio     size={9} className="inline mr-0.5" />{f}</> :
                                                 <><Thermometer size={9} className="inline mr-0.5" />{f}</>}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Cluster risk */}
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                      style={{
                        background: overallRisk === "risk" ? "#fce4ed" : "#d0f5f3",
                        color:      overallRisk === "risk" ? "#b01040" : "#00736b",
                        border:     `1px solid ${overallRisk === "risk" ? "#E8175D" : "#00BFB3"}`,
                      }}
                    >
                      {overallRisk}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-card-border bg-muted/20 text-[11px] text-muted-foreground flex justify-between">
        <span>{totalClusters} team clusters · {MC_CLUSTERS.reduce((n, c) => n + c.siteIds.length, 0)} sites assigned · Click row to view MC anchor site</span>
        <span>Cluster risk = any site in cluster at risk</span>
      </div>
    </div>
  );
}
