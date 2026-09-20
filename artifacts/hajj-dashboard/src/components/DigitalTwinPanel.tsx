import { useMemo, useState } from "react";
import { Activity, BatteryCharging, CloudSun, Gauge, Leaf, ThermometerSun, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SiteAnalysis } from "../lib/calculations";

interface DigitalTwinPanelProps {
  analyses: SiteAnalysis[];
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
}

const round = (value: number, digits = 1) => Number(value.toFixed(digits));

export function DigitalTwinPanel({ analyses, selectedSiteId, onSelectSite }: DigitalTwinPanelProps) {
  const siteAnalysis = analyses.find(a => a.site.id === selectedSiteId) ?? analyses[0];
  const [ambientTemp, setAmbientTemp] = useState(46);
  const [traffic, setTraffic] = useState(100);
  const [gridHours, setGridHours] = useState(18);

  const model = useMemo(() => {
    const site = siteAnalysis.site;
    const trafficFactor = traffic / 100;
    const temperatureFactor = 1 + Math.max(0, ambientTemp - 35) * 0.018;
    const telecomKw = site.telecomPowerKw * trafficFactor;
    const coolingKw = ((site.ac1CapacityBtu + (site.ac2CapacityBtu ?? 0)) / 3412 / 3.5) * temperatureFactor;
    const totalKw = telecomKw + coolingKw;
    const dailyEnergyKwh = totalKw * 24;
    const generatorHours = Math.max(0, 24 - gridHours);
    const dieselLitres = totalKw * generatorHours * 0.27;
    const gridEnergy = totalKw * gridHours;
    const generatorEnergy = totalKw * generatorHours;
    const co2Kg = gridEnergy * 0.57 + dieselLitres * 2.68;
    const base = siteAnalysis.scenarios[0];
    const coolingMargin = base ? base.coolingMarginBtu - Math.max(0, ambientTemp - 46) * 1200 : 0;
    const powerMargin = base ? base.powerMarginKw - Math.max(0, trafficFactor - 1) * site.telecomPowerKw : 0;
    const riskIndex = Math.min(100, Math.max(0,
      (powerMargin < 0 ? 38 : powerMargin < 5 ? 20 : 5) +
      (coolingMargin < 0 ? 38 : coolingMargin < 5000 ? 20 : 5) +
      (site.batteryMaxUsefulTimeHours < 1 ? 24 : site.batteryMaxUsefulTimeHours < 1.5 ? 12 : 3)
    ));

    const profile = Array.from({ length: 24 }, (_, hour) => {
      const heatWave = Math.max(0, Math.sin(((hour - 7) / 24) * Math.PI * 2));
      const loadWave = 0.74 + 0.26 * Math.max(0, Math.sin(((hour - 8) / 24) * Math.PI));
      const temperature = ambientTemp - 11 + heatWave * 11;
      const demand = totalKw * loadWave * (1 + heatWave * 0.08);
      return { hour: `${String(hour).padStart(2, "0")}:00`, temperature: round(temperature), demand: round(demand) };
    });

    return { totalKw, dailyEnergyKwh, dieselLitres, co2Kg, coolingMargin, powerMargin, riskIndex, profile };
  }, [siteAnalysis, ambientTemp, traffic, gridHours]);

  const status = model.riskIndex >= 60 ? "Critical" : model.riskIndex >= 35 ? "Watch" : "Healthy";
  const statusColor = model.riskIndex >= 60 ? "#ef4444" : model.riskIndex >= 35 ? "#f59e0b" : "#00bfb3";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-950 via-purple-900 to-violet-800 p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-200"><Activity size={14} /> Live engineering model</div>
            <h2 className="text-2xl font-black">{siteAnalysis.site.id} Digital Twin</h2>
            <p className="mt-1 text-sm text-purple-200">{siteAnalysis.site.location} · {siteAnalysis.site.siteType.replace("_", " ")}</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={siteAnalysis.site.id} onChange={e => onSelectSite(e.target.value)} className="min-w-44 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none">
              {analyses.map(a => <option className="text-gray-900" key={a.site.id} value={a.site.id}>{a.site.id} · {a.site.location}</option>)}
            </select>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-purple-200">Twin health</div>
              <div className="font-black" style={{ color: statusColor }}>{status} · {100 - model.riskIndex}%</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {[
          ["Predicted Demand", `${round(model.totalKw)} kW`, <Zap size={16} />, "Current modeled load"],
          ["Daily Energy", `${round(model.dailyEnergyKwh, 0)} kWh`, <Gauge size={16} />, "24-hour projection"],
          ["Diesel Demand", `${round(model.dieselLitres, 0)} L`, <CloudSun size={16} />, "Based on grid availability"],
          ["Carbon Output", `${round(model.co2Kg, 0)} kg`, <Leaf size={16} />, "Grid + generator estimate"],
          ["Power Headroom", `${round(model.powerMargin)} kW`, <BatteryCharging size={16} />, "Scenario S1 margin"],
          ["Cooling Headroom", `${round(model.coolingMargin / 1000)} kBTU/h`, <ThermometerSun size={16} />, "Temperature adjusted"],
        ].map(([label, value, icon, note]) => (
          <div key={String(label)} className="rounded-xl border border-card-border bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
            <div className="text-xl font-black text-foreground">{value}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-card-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold">24-hour energy and temperature forecast</h3>
            <p className="text-xs text-muted-foreground">Baseline engineering projection using configured climate and traffic stress</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={model.profile}>
                <defs><linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} unit=" kW" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} unit="°" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="demand" name="Energy demand (kW)" stroke="#7c3aed" fill="url(#demandFill)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="temperature" name="Ambient temperature (°C)" stroke="#f97316" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-4 shadow-sm">
          <h3 className="font-bold">What-if simulator</h3>
          <p className="mb-5 text-xs text-muted-foreground">Adjust operating conditions to recalculate the twin instantly.</p>
          {[
            ["Peak ambient temperature", ambientTemp, setAmbientTemp, 30, 55, "°C"],
            ["Telecom traffic load", traffic, setTraffic, 50, 130, "%"],
            ["Grid availability", gridHours, setGridHours, 0, 24, "h/day"],
          ].map(([label, value, setter, min, max, unit]) => (
            <label key={String(label)} className="mb-5 block">
              <div className="mb-2 flex justify-between text-xs"><span className="font-semibold">{label}</span><span className="font-black text-purple-700">{value}{unit}</span></div>
              <input className="w-full accent-purple-700" type="range" min={Number(min)} max={Number(max)} value={Number(value)} onChange={e => (setter as (n: number) => void)(Number(e.target.value))} />
            </label>
          ))}
          <div className="mt-2 rounded-xl p-4" style={{ background: `${statusColor}12`, border: `1px solid ${statusColor}55` }}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase">Predictive risk index</span><span className="text-2xl font-black" style={{ color: statusColor }}>{model.riskIndex}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full transition-all" style={{ width: `${model.riskIndex}%`, background: statusColor }} /></div>
            <p className="mt-3 text-[11px] text-muted-foreground">Index combines projected power, cooling and battery resilience. Connect live telemetry to enable anomaly detection and model calibration.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
