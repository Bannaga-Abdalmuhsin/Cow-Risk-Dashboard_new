import type { SiteAnalysis } from "../lib/calculations";

const SCENARIO_DESCRIPTIONS: Record<number, string[]> = {
  1: ["Prime Power Operational", "AC1 Operational only", "Batteries fully Charged", "Load at Full traffic", "Temp at 46°C"],
  2: ["Prime Power Operational", "AC1 & AC2 Operational", "Batteries fully Charged", "Load at Full traffic", "Temp at 46°C"],
  3: ["Prime Power Operational", "AC1 Operational only", "Batteries Charging", "Load at Full traffic", "Temp at 46°C"],
  4: ["Prime Power Operational", "AC1 & AC2 Operational", "Batteries Charging", "Load at Full traffic", "Temp at 46°C"],
};

type RiskLevel = "safe" | "risk";

function dotColor(level: RiskLevel, scenarioId: number): string {
  if (level === "safe") return "#00BFB3";
  return scenarioId === 9 ? "#E8175D" : "#f97316";
}

function worstRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.includes("risk")) return "risk";
  return "safe";
}

function RiskDot({ level, scenarioId }: { level: RiskLevel; scenarioId: number }) {
  return (
    <span
      className="inline-block w-4 h-4 rounded-full border-2 border-white shadow-sm"
      style={{ background: dotColor(level, scenarioId) }}
      title={level}
    />
  );
}

interface ScenarioMatrixProps {
  analyses: SiteAnalysis[];
  selectedScenarioId: number | null;
  onSelectScenario: (id: number) => void;
}

export function ScenarioMatrix({ analyses, selectedScenarioId, onSelectScenario }: ScenarioMatrixProps) {
  const scenarioRows = Array.from({ length: 4 }, (_, i) => {
    const sId = i + 1;
    const scenarioResults = analyses.map(a => a.scenarios.find(s => s.scenarioId === sId)!).filter(Boolean);

    const powerRisks   = scenarioResults.map(s => s.powerRisk);
    const rectRisks    = scenarioResults.map(s => s.rectifierRisk);
    const battRisks    = scenarioResults.map(s => s.batteryRisk);
    const coolRisks    = scenarioResults.map(s => s.coolingRisk);

    const worstPower   = worstRisk(powerRisks);
    const worstRect    = worstRisk(rectRisks);
    const worstBatt    = worstRisk(battRisks);
    const worstCool    = worstRisk(coolRisks);

    const atRiskCount = scenarioResults.filter(s =>
      s.powerRisk === "risk" || s.rectifierRisk === "risk" ||
      s.batteryRisk === "risk" || s.coolingRisk === "risk"
    ).length;

    const overallWorst = worstRisk([worstPower, worstRect, worstBatt, worstCool]);

    return { sId, worstPower, worstRect, worstBatt, worstCool, atRiskCount, overallWorst };
  });

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border" style={{ background: "linear-gradient(135deg, #4a0e8f 0%, #6b21c8 100%)" }}>
        <h2 className="text-white font-bold text-base">Operational Scenario Risk Matrix</h2>
        <p className="text-purple-200 text-xs mt-0.5">
          Click any row to drill into all site details · 4 operating scenarios · {analyses.length} sites
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border" style={{ background: "#f5f0ff" }}>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide w-12">Test<br/>Scenario</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">Scenario Description</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">Power<br/>Supply Risk</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">Rectifier<br/>Supply Risk</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">Batteries<br/>Supply Risk</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">Cooling<br/>Supply Risk</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide w-28">Sites at<br/>Risk</th>
            </tr>
          </thead>
          <tbody>
            {scenarioRows.map((row, idx) => {
              const isSelected = selectedScenarioId === row.sId;
              const isEven = idx % 2 === 0;
              const rowBg = isSelected
                ? "#ede9fe"
                : isEven ? "white" : "#fafafa";

              return (
                <tr
                  key={row.sId}
                  onClick={() => onSelectScenario(row.sId)}
                  className="border-b border-gray-100 transition-colors cursor-pointer"
                  style={{ background: rowBg }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#f3f0ff"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = rowBg; }}
                >
                  <td className="px-4 py-4 text-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                          : "linear-gradient(135deg, #4a0e8f, #6b21c8)"
                      }}
                    >
                      {row.sId}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-800 text-xs mb-0.5">
                      {SCENARIO_DESCRIPTIONS[row.sId][0]}
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      {SCENARIO_DESCRIPTIONS[row.sId].slice(1).join(" · ")}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center"><div className="flex justify-center"><RiskDot level={row.worstPower} scenarioId={row.sId} /></div></td>
                  <td className="px-3 py-4 text-center"><div className="flex justify-center"><RiskDot level={row.worstRect} scenarioId={row.sId} /></div></td>
                  <td className="px-3 py-4 text-center"><div className="flex justify-center"><RiskDot level={row.worstBatt} scenarioId={row.sId} /></div></td>
                  <td className="px-3 py-4 text-center"><div className="flex justify-center"><RiskDot level={row.worstCool} scenarioId={row.sId} /></div></td>
                  <td className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="inline-flex items-center justify-center text-white font-bold text-sm rounded-lg px-3 py-1 min-w-[48px]"
                        style={{ background: row.atRiskCount === 0 ? "#00BFB3" : row.sId === 9 ? "#E8175D" : "#f97316" }}
                      >
                        {row.atRiskCount}
                      </span>
                      <span className="text-[10px] text-gray-400">{row.atRiskCount === 1 ? "site" : "sites"}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border bg-gray-50 flex items-center gap-6 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Legend:</span>
        {[
          { color: "#00BFB3", label: "Safe" },
          { color: "#f97316", label: "Operating constraint" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full inline-block border border-white shadow-sm" style={{ background: color }} />
            <span className="text-xs text-gray-600 font-medium">{label}</span>
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-auto">Worst-case across all {analyses.length} sites per scenario</span>
      </div>
    </div>
  );
}
