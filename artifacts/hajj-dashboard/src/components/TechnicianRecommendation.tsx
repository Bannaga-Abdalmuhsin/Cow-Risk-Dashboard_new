import { HardHat } from "lucide-react";
import type { SiteAnalysis } from "../lib/calculations";

const GLASS_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(107,33,200,0.30)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
};

interface TechnicianRecommendationProps {
  analyses: SiteAnalysis[];
  plannedTechs?: number;
  totalFleet?: number;
  glass?: boolean;
}

export function TechnicianRecommendation({ analyses, plannedTechs, totalFleet, glass }: TechnicianRecommendationProps) {
  const risk = analyses.filter(a => a.overallRisk === "risk");
  const safe = analyses.filter(a => a.overallRisk === "safe");

  const techForRisk = Math.ceil(risk.length / 3);
  const totalTech = plannedTechs ?? techForRisk;
  const fleetTotal = totalFleet ?? analyses.length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={glass ? GLASS_STYLE : undefined}
    >
      <div className={`${!glass ? "bg-card border border-card-border rounded-xl shadow-sm" : ""} p-3 space-y-2`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <HardHat size={13} />
          </div>
          <div>
            <div className="font-semibold text-xs">Technician Deployment Plan</div>
            <div className="text-[10px] text-muted-foreground">Based on risk classification</div>
          </div>
        </div>

        <div className="text-center py-2 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{totalTech}</div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">
            {plannedTechs ? "Planned Techs" : "Total Techs"}
          </div>
          <div className="text-[9px] text-blue-500 mt-0.5">
            {plannedTechs ? `For ${fleetTotal} total sites` : `${safe.length} sites remote`}
          </div>
        </div>
      </div>
    </div>
  );
}
