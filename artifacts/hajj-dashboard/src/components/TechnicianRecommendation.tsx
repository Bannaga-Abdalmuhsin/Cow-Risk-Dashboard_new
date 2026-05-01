import { HardHat } from "lucide-react";
import type { SiteAnalysis } from "../lib/calculations";

interface TechnicianRecommendationProps {
  analyses: SiteAnalysis[];
  plannedTechs?: number;
  totalFleet?: number;
}

export function TechnicianRecommendation({ analyses, plannedTechs, totalFleet }: TechnicianRecommendationProps) {
  const risk = analyses.filter(a => a.overallRisk === "risk");
  const safe = analyses.filter(a => a.overallRisk === "safe");

  const techForRisk = Math.ceil(risk.length / 3);
  const totalTech = plannedTechs ?? techForRisk;
  const fleetTotal = totalFleet ?? analyses.length;

  const LOCATION_TECH_MIN: Record<string, number> = {
    "Makkah Remote": 2,
  };

  const byLocation: Record<string, { risk: number; safe: number }> = {};
  for (const a of analyses) {
    const loc = a.site.location;
    if (!byLocation[loc]) byLocation[loc] = { risk: 0, safe: 0 };
    byLocation[loc][a.overallRisk]++;
  }

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          <HardHat size={16} />
        </div>
        <div>
          <div className="font-semibold text-sm">Technician Deployment Plan</div>
          <div className="text-xs text-muted-foreground">Based on risk classification</div>
        </div>
      </div>

      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="text-2xl font-bold text-blue-600">{totalTech}</div>
        <div className="text-xs text-blue-700 font-medium mt-0.5">
          {plannedTechs ? "Planned Techs" : "Total Techs"}
        </div>
        <div className="text-[10px] text-blue-500 mt-1">
          {plannedTechs ? `For ${fleetTotal} total sites` : `${safe.length} sites remote`}
        </div>
      </div>

    </div>
  );
}
