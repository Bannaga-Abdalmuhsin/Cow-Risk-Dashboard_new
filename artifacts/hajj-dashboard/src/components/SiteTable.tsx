import { useState } from "react";
import type { SiteAnalysis } from "../lib/calculations";
import { RiskBadge } from "./RiskBadge";

interface SiteTableProps {
  analyses: SiteAnalysis[];
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
}

export function SiteTable({ analyses, selectedSiteId, onSelectSite }: SiteTableProps) {
  const [filter, setFilter] = useState<"all" | "safe" | "risk">("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [search, setSearch] = useState("");

  const locations = Array.from(new Set(analyses.map(a => a.site.location)));

  const filtered = analyses.filter(a => {
    if (filter !== "all" && a.overallRisk !== filter) return false;
    if (locationFilter !== "all" && a.site.location !== locationFilter) return false;
    if (search && !a.site.id.toLowerCase().includes(search.toLowerCase()) && !a.site.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const worst = (a: SiteAnalysis) => {
    if (!a.scenarios.length) return null;
    return a.scenarios.reduce((acc, cur) => cur.riskScore > acc.riskScore ? cur : acc);
  };

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search sites..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-border rounded-md bg-background flex-1 min-w-32"
        />
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="px-2 py-1.5 text-xs border border-border rounded-md bg-background"
        >
          <option value="all">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="flex gap-1">
          {(["all", "safe", "risk"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs rounded font-medium capitalize transition-colors ${
                filter === f
                  ? f === "safe" ? "bg-[#00BFB3] text-white" :
                    f === "risk" ? "bg-[#E8175D] text-white" :
                    "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? `All (${analyses.length})` : f === "risk" ? `Risk` : "Safe"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto max-h-80">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Site ID</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Location</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Type</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Power</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Technology</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Risk Score</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const ws = worst(a);
              const isSelected = a.site.id === selectedSiteId;
              return (
                <tr
                  key={a.site.id}
                  onClick={() => onSelectSite(a.site.id)}
                  className={`border-t border-border cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 font-semibold" : "hover:bg-muted/40"
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold text-foreground">{a.site.id}</td>
                  <td className="px-3 py-2 text-muted-foreground truncate max-w-28">{a.site.location}</td>
                  <td className="px-3 py-2 capitalize">{a.site.siteType.replace("_", " ")}</td>
                  <td className="px-3 py-2">
                    {a.site.powerConfig === "commercial_with_backup"
                      ? `SEC ${a.site.secCapacityAmp ?? "—"}A / Gen ${a.site.rawBackupGenKva ?? "—"}kVA`
                      : a.site.primeGenNetPowerKw != null
                        ? `Gen1: ${a.site.rawGenKva ?? "—"}kVA | Gen2: ${a.site.rawBackupGenKva ?? "—"}kVA`
                        : `${a.site.rawGenKva ?? "—"} kVA`}
                  </td>
                  <td className="px-3 py-2">
                    {a.site.connectedTechnology
                      ? <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 whitespace-nowrap">{a.site.connectedTechnology}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-sm ${i < a.worstRiskScore ? "bg-red-400" : "bg-muted"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <RiskBadge risk={a.overallRisk} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">No sites match your filters</div>
        )}
      </div>
      <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
        Showing {filtered.length} of {analyses.length} sites
      </div>
    </div>
  );
}
