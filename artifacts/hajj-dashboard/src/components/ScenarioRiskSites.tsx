import { X } from "lucide-react";
import type { SiteAnalysis, ScenarioResult } from "../lib/calculations";

interface Props {
  analyses: SiteAnalysis[];
  scenarioId: number;
  onClose: () => void;
}

const SCENARIO_TITLE: Record<number, string> = {
  1: "S1 — Prime SEC / AC1 / Normal",
  2: "S2 — Prime SEC / AC1+AC2 / Normal",
  3: "S3 — Prime SEC / AC1 / Charging",
  4: "S4 — Prime SEC / AC1+AC2 / Charging",
  5: "S5 — Generator / AC1 / Normal",
  6: "S6 — Generator / AC1+AC2 / Normal",
  7: "S7 — Generator / AC1 / Charging",
  8: "S8 — Generator / AC1+AC2 / Charging",
  9: "S9 — Power Outage / Battery Discharge",
};

type RiskDim = "powerRisk" | "rectifierRisk" | "batteryRisk" | "coolingRisk";

const DIMS: Array<{ key: RiskDim; label: string }> = [
  { key: "powerRisk",      label: "Power Supply" },
  { key: "rectifierRisk",  label: "Rectifier Supply" },
  { key: "coolingRisk",    label: "Cooling Supply" },
];

function RiskCell({ risk }: { risk: "safe" | "risk" }) {
  return (
    <td className="px-3 py-2.5 text-center">
      <span
        className="inline-flex items-center justify-center w-16 rounded text-white text-[10px] font-bold py-0.5 uppercase tracking-wide"
        style={{ background: risk === "risk" ? "#E8175D" : "#00BFB3" }}
      >
        {risk}
      </span>
    </td>
  );
}

function fmt(v: number) {
  return v.toFixed(2);
}

export function ScenarioRiskSites({ analyses, scenarioId, onClose }: Props) {
  const rows: Array<{ analysis: SiteAnalysis; scenario: ScenarioResult }> = [];

  for (const a of analyses) {
    const s = a.scenarios.find(sc => sc.scenarioId === scenarioId);
    if (s) rows.push({ analysis: a, scenario: s });
  }

  const riskCount = rows.filter(r =>
    r.scenario.powerRisk === "risk" || r.scenario.rectifierRisk === "risk" ||
    r.scenario.batteryRisk === "risk" || r.scenario.coolingRisk === "risk"
  ).length;

  const sorted = [...rows].sort((a, b) => b.scenario.riskScore - a.scenario.riskScore);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #4a0e8f 0%, #6b21c8 100%)" }}>
        <div>
          <h2 className="text-white font-bold text-sm">{SCENARIO_TITLE[scenarioId]}</h2>
          <p className="text-purple-200 text-xs mt-0.5">
            All {rows.length} sites · {riskCount} at risk · sorted by risk score
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-purple-200 hover:text-white transition-colors p-1 rounded"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border" style={{ background: "#f5f0ff" }}>
              <th className="text-left px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Site ID</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Location</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Power Source</th>
              {DIMS.map(d => (
                <th key={d.key} className="text-center px-3 py-2.5 font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                  {d.label}
                </th>
              ))}
              <th className="text-right px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Pwr Margin<br/>(kW)</th>
              <th className="text-right px-4 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Rect Margin<br/>(kW)</th>
              <th className="text-center px-3 py-2.5 font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Batt. Backup<br/>(hrs)</th>
              <th className="text-center px-3 py-2.5 font-bold text-gray-600 uppercase tracking-wide">Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ analysis, scenario }, idx) => {
              const hasRisk = scenario.riskScore > 0;
              const rowBg = hasRisk
                ? (idx % 2 === 0 ? "#fff5f7" : "#fff0f3")
                : (idx % 2 === 0 ? "white" : "#fafafa");

              const powerLabel =
                analysis.site.powerConfig === "commercial_with_backup"
                  ? analysis.site.secCapacityAmp
                    ? `SEC ${analysis.site.secCapacityAmp}A / Gen ${analysis.site.backupGeneratorKva?.toFixed(1) ?? "—"}kVA`
                    : `Gen ${analysis.site.backupGeneratorKva?.toFixed(1) ?? "—"}kVA`
                  : `${analysis.site.generatorKva.toFixed(1)} kVA`;

              return (
                <tr key={analysis.site.id}
                  className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                  style={{ background: rowBg }}>
                  <td className="px-4 py-2.5 font-mono font-semibold text-purple-700">{analysis.site.id}</td>
                  <td className="px-4 py-2.5 text-gray-700">{analysis.site.location}</td>
                  <td className="px-4 py-2.5 text-gray-500 capitalize">{analysis.site.siteType.replace("_", " ")}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{powerLabel}</td>
                  {DIMS.map(d => (
                    <RiskCell key={d.key} risk={scenario[d.key]} />
                  ))}
                  <td className={`px-4 py-2.5 text-right font-mono font-semibold ${scenario.powerMarginKw < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {fmt(scenario.powerMarginKw)}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono font-semibold ${scenario.rectifierMarginKw < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {fmt(scenario.rectifierMarginKw)}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="inline-flex items-center justify-center text-white font-bold text-[10px] rounded px-2 py-0.5 min-w-[40px]"
                      style={{
                        background: scenario.batteryUsefulHours < 1
                          ? "#E8175D"
                          : scenario.batteryUsefulHours < 2
                          ? "#f59e0b"
                          : "#00BFB3"
                      }}
                    >
                      {scenario.batteryUsefulHours.toFixed(2)}h
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
                      style={{ background: scenario.riskScore === 0 ? "#00BFB3" : "#E8175D" }}
                    >
                      {scenario.riskScore}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 border-t border-border bg-gray-50 flex items-center gap-6 flex-wrap text-[10px] text-gray-500">
        <span className="font-semibold uppercase tracking-wide">Score</span>
        <span>0 = all safe · 1–4 = number of risk dimensions</span>
        <span className="font-semibold uppercase tracking-wide ml-2">Backup Time:</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded inline-block" style={{ background: "#00BFB3" }} /> ≥ 2h
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded inline-block" style={{ background: "#f59e0b" }} /> 1–2h
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded inline-block" style={{ background: "#E8175D" }} /> &lt; 1h
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded inline-block" style={{ background: "#E8175D" }} /> Risk
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded inline-block" style={{ background: "#00BFB3" }} /> Safe
          </span>
        </span>
      </div>
    </div>
  );
}
