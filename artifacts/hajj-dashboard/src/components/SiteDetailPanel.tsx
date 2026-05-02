import { useState } from "react";
import type { SiteAnalysis, ScenarioResult } from "../lib/calculations";
import { RiskBadge } from "./RiskBadge";
import { MarginBar } from "./MarginBar";

interface SiteDetailPanelProps {
  analysis: SiteAnalysis;
  onClose: () => void;
}

export function SiteDetailPanel({ analysis, onClose }: SiteDetailPanelProps) {
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const { site, scenarios } = analysis;
  const sc: ScenarioResult = scenarios[activeScenario];

  const formatNum = (n: number, d = 1) => n.toFixed(d);

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-xl overflow-hidden h-full flex flex-col">
      <div className="stc-gradient px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-base">{site.id}</div>
          <div className="text-purple-200 text-xs">{site.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge risk={analysis.overallRisk} size="md" />
          <button onClick={onClose} className="text-purple-200 hover:text-white transition-colors ml-2 text-lg font-bold">✕</button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border bg-muted/40 grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-muted-foreground">Type:</span> <span className="font-semibold capitalize">{site.siteType.replace("_", " ")}</span></div>
        <div><span className="text-muted-foreground">Power:</span> <span className="font-semibold capitalize">{site.powerConfig.replace(/_/g, " ")}</span></div>
        <div><span className="text-muted-foreground">Power Source:</span> <span className="font-semibold">
          {site.powerConfig === "commercial_with_backup"
            ? site.secCapacityAmp
              ? `SEC ${site.secCapacityAmp}A  |  Backup Gen: ${site.backupGeneratorKva ?? "—"}kVA`
              : `Gen1: ${site.generatorKva}kVA  |  Gen2: ${site.backupGeneratorKva ?? "—"}kVA`
            : `Single Gen: ${site.generatorKva}kVA`}
        </span></div>
        <div><span className="text-muted-foreground">Battery:</span> <span className="font-semibold">{site.batteryCapacityAh} Ah {site.batteryType.replace("_", "-")}</span></div>
        <div><span className="text-muted-foreground">AC1:</span> <span className="font-semibold">{(site.ac1CapacityBtu / 1000).toFixed(0)}k BTU/h</span></div>
        <div><span className="text-muted-foreground">AC2:</span> <span className="font-semibold">{site.ac2CapacityBtu ? `${(site.ac2CapacityBtu / 1000).toFixed(0)}k BTU/h` : "—"}</span></div>
        <div><span className="text-muted-foreground">Rectifier:</span> <span className="font-semibold">{site.rectifierCapacityKw} kW</span></div>
        <div><span className="text-muted-foreground">Site Load:</span> <span className="font-semibold">{site.telecomPowerKw.toFixed(1)} KW</span></div>
        <div><span className="text-muted-foreground">Shelter Heat Load:</span> <span className="font-semibold">{site.telecomHeatKBtuH.toFixed(2)} KBtu/h</span></div>
        {site.connectedTechnology && (
          <div><span className="text-muted-foreground">Technology:</span> <span className="font-semibold">{site.connectedTechnology}</span></div>
        )}
      </div>

      <div className="px-4 py-2 border-b border-border">
        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Scenario</div>
        <div className="flex flex-wrap gap-1">
          {scenarios.map((s, i) => {
            const worstRisk = [s.powerRisk, s.rectifierRisk, s.batteryRisk, s.coolingRisk].includes("risk")
              ? "risk" : "safe";

            const bg = worstRisk === "safe"
              ? "bg-[#d0f5f3] border-[#00BFB3] text-[#00736b]"
              : "bg-[#fce4ed] border-[#E8175D] text-[#b01040]";
            const activeCls = activeScenario === i ? "ring-2 ring-primary ring-offset-1 font-bold" : "";

            return (
              <button
                key={s.scenarioId}
                onClick={() => setActiveScenario(i)}
                className={`px-2 py-1 text-[10px] rounded border transition-all ${bg} ${activeCls}`}
              >
                S{s.scenarioId}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div>
          <div className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
            {sc.scenarioName}
          </div>
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex flex-wrap gap-x-2">
            <span>
              {sc.coolingConfig === "none" ? "No Cooling" : sc.coolingConfig === "ac1_only" ? "AC1 Operational only" : "AC1+AC2 Operational"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>
              {sc.batteryState === "normal" ? "Batteries Fully Charged" : sc.batteryState === "charging" ? "Batteries Charging" : "Batteries Discharging"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Load at Full Traffic</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Temp at 46°C</span>
          </div>
          <div className="text-[11px] text-muted-foreground mb-3">
            Source: <span className="font-medium capitalize">{sc.powerSource === "outage" ? "Power Outage" : sc.powerSource.replace("_", " ")}</span> ·
            Cooling: <span className="font-medium">{sc.coolingConfig === "none" ? "Off" : sc.coolingConfig === "ac1_only" ? "AC1" : "AC1+AC2"}</span> ·
            Battery: <span className="font-medium">{sc.batteryState === "normal" ? "Fully Charged" : sc.batteryState === "charging" ? "Charging" : "Discharging"}</span> ·
            Site Load at Full Traffic: <span className="font-medium">{sc.telecomPowerKw.toFixed(2)} kW</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Power Risk</div>
              <RiskBadge risk={sc.powerRisk} size="sm" />
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Cooling Risk</div>
              <RiskBadge risk={sc.coolingRisk} size="sm" />
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Battery Risk</div>
              <RiskBadge risk={sc.batteryRisk} size="sm" />
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Rectifier Risk</div>
              <RiskBadge risk={sc.rectifierRisk} size="sm" />
            </div>
          </div>

          <div className="space-y-2.5">
            <MarginBar
              label="Power Margin"
              value={sc.powerMarginKw}
              unit="kW"
              max={Math.max(sc.primePowerKw || sc.backupPowerKw || 20, 20)}
              risk={sc.powerRisk}
            />
            <MarginBar
              label="Rectifier Margin"
              value={sc.rectifierMarginKw}
              unit="kW"
              max={site.rectifierCapacityKw}
              risk={sc.rectifierRisk}
            />
            <MarginBar
              label="Battery Useful Time"
              value={sc.batteryUsefulHours}
              unit="hrs"
              max={3}
              risk={sc.batteryRisk}
            />
            <MarginBar
              label="Cooling Margin"
              value={sc.coolingMarginBtu / 1000}
              unit="kBTU/h"
              max={site.ac1CapacityBtu / 1000 + (site.ac2CapacityBtu ?? 0) / 1000}
              risk={sc.coolingRisk}
            />
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Engineering Parameters</div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {sc.primePowerKw > 0 && (
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">Prime Net Power</span>
                <span className="font-semibold">{formatNum(sc.primePowerKw)} kW</span>
              </div>
            )}
            {sc.backupPowerKw > 0 && (
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">Backup Gen Net Power</span>
                <span className="font-semibold">{formatNum(sc.backupPowerKw)} kW</span>
              </div>
            )}
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">Site Load (total)</span>
              <span className="font-semibold">{formatNum(sc.telecomPowerKw)} kW</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">Shelter Heat</span>
              <span className="font-semibold">{formatNum(sc.telecomHeatBtu / 1000, 1)} kBTU/h</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">AC1 Net Cooling</span>
              <span className="font-semibold">{formatNum(sc.ac1NetBtu / 1000, 1)} kBTU/h ({formatNum(sc.ac1NetPowerKw)} kW)</span>
            </div>
            {sc.ac2NetBtu > 0 && (
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">AC2 Net Cooling</span>
                <span className="font-semibold">{formatNum(sc.ac2NetBtu / 1000, 1)} kBTU/h ({formatNum(sc.ac2NetPowerKw)} kW)</span>
              </div>
            )}
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">Rectifier Net</span>
              <span className="font-semibold">{formatNum(sc.rectifierNetKw)} kW</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">Battery Useful Time</span>
              <span className="font-semibold">{formatNum(sc.batteryUsefulHours, 2)} hrs</span>
            </div>
            {sc.batteryChargingKw > 0 && (
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">Battery Charging</span>
                <span className="font-semibold">{formatNum(sc.batteryChargingKw)} kW</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
