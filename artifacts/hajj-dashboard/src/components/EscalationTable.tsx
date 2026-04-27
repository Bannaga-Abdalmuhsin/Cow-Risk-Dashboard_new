import { Clock, AlertTriangle, Zap, Thermometer, Radio } from "lucide-react";
import { ESCALATION_TEAMS, TRANSPORT_ICON } from "../lib/escalationTeams";
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
  "Umrah office":  { bg: "#e0f2fe", text: "#0c4a6e", border: "#0ea5e9" },
};

export function EscalationTable({ analyses, onSelectSite, selectedSiteId }: EscalationTableProps) {
  const analysisByID = Object.fromEntries(analyses.map(a => [a.site.id, a]));

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-card-border flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #4A0E8F 0%, #6d28d9 100%)" }}>
        <div className="flex items-center gap-2 text-white">
          <AlertTriangle size={16} />
          <span className="font-semibold text-sm">1st Escalation Team Deployment</span>
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
        <span className="ml-auto italic">Team center locations pending — routes to be added</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-[11px] text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-3 py-2 font-semibold">Team</th>
              <th className="text-left px-3 py-2 font-semibold">Site</th>
              <th className="text-left px-3 py-2 font-semibold">Location</th>
              <th className="text-left px-3 py-2 font-semibold">Transport</th>
              <th className="text-left px-3 py-2 font-semibold">ETA</th>
              <th className="text-left px-3 py-2 font-semibold">Active Issues</th>
              <th className="text-left px-3 py-2 font-semibold">Site Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {ESCALATION_TEAMS.map(team => {
              const analysis = analysisByID[team.siteId];
              const locStyle = LOCATION_COLOR[team.location] ?? { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" };
              const isSelected = selectedSiteId === team.siteId;

              const riskFlags = analysis ? (() => {
                const flags: string[] = [];
                for (const sc of analysis.scenarios) {
                  if (sc.powerRisk     === "risk" && !flags.includes("Power"))     flags.push("Power");
                  if (sc.rectifierRisk === "risk" && !flags.includes("Rectifier")) flags.push("Rectifier");
                  if (sc.coolingRisk   === "risk" && !flags.includes("Cooling"))   flags.push("Cooling");
                }
                return flags;
              })() : [];

              return (
                <tr
                  key={team.teamName}
                  className={`cursor-pointer transition-colors hover:bg-muted/40 ${isSelected ? "bg-purple-50 ring-1 ring-inset ring-purple-400" : ""}`}
                  onClick={() => onSelectSite(team.siteId)}
                >
                  {/* Team */}
                  <td className="px-3 py-2.5">
                    <span className="font-bold text-xs" style={{ color: "#4A0E8F" }}>{team.teamName}</span>
                  </td>

                  {/* Site */}
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs font-semibold">{team.siteId}</span>
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{team.powerType}</span>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: locStyle.bg, color: locStyle.text, border: `1px solid ${locStyle.border}` }}
                    >
                      {team.location}
                    </span>
                  </td>

                  {/* Transport */}
                  <td className="px-3 py-2.5">
                    <span className="text-sm">{TRANSPORT_ICON[team.transport]}</span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground">{team.transport}</span>
                  </td>

                  {/* ETA */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className={team.etaMinutes === 15 ? "text-emerald-600" : "text-amber-500"} />
                      <span
                        className="text-xs font-bold"
                        style={{ color: team.etaMinutes === 15 ? "#059669" : "#d97706" }}
                      >
                        {team.etaMinutes} min
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
                          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: "#fce4ed", color: "#b01040", border: "1px solid #E8175D" }}>
                            {f === "Power" ? <><Zap size={9} className="inline mr-0.5" />{f}</> :
                             f === "Rectifier" ? <><Radio size={9} className="inline mr-0.5" />{f}</> :
                             <><Thermometer size={9} className="inline mr-0.5" />{f}</>}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Site Risk */}
                  <td className="px-3 py-2.5">
                    {analysis ? (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{
                          background: analysis.overallRisk === "risk" ? "#fce4ed" : "#d0f5f3",
                          color: analysis.overallRisk === "risk" ? "#b01040" : "#00736b",
                          border: `1px solid ${analysis.overallRisk === "risk" ? "#E8175D" : "#00BFB3"}`,
                        }}
                      >
                        {analysis.overallRisk}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-card-border bg-muted/20 text-[11px] text-muted-foreground flex justify-between">
        <span>{ESCALATION_TEAMS.length} teams deployed · Click row to view site analysis</span>
        <span>Issues: Power · Rectifier · AC — Response triggers on any risk flag</span>
      </div>
    </div>
  );
}
