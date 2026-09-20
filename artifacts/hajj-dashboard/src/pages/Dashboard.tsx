import { useMemo, useState, type ReactNode } from "react";
import { Activity, AlertCircle, BarChart3, CheckCircle2, ClipboardList, FlaskConical, Leaf, LogOut, Map, Radio, Zap } from "lucide-react";
import acesLogo from "@assets/ChatGPT_Image_Oct_14,_2025,_10_29_41_PM_1776566555155.png";
import stcLogo from "@assets/7010.SR.D-9f4e531b_(1)_1776566577166.png";
import { DigitalTwinPanel } from "../components/DigitalTwinPanel";
import { LeafletMap } from "../components/LeafletMap";
import { MetricCard } from "../components/MetricCard";
import { RiskDistributionPie, PowerSourceDonut, RiskTypeBreakdown, LocationRiskChart } from "../components/RiskCharts";
import { ScenarioMatrix } from "../components/ScenarioMatrix";
import { ScenarioRiskSites } from "../components/ScenarioRiskSites";
import { SiteDetailPanel } from "../components/SiteDetailPanel";
import { SiteTable } from "../components/SiteTable";
import { ActionSitesCard, RiskByAreaCard } from "../components/OverviewInsights";
import { analyzeSite } from "../lib/calculations";
import { ALL_SITES } from "../lib/siteData";

type Tab = "overview" | "twin" | "scenarios" | "map" | "sites" | "methodology";

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const analyses = useMemo(() => ALL_SITES.map(analyzeSite), []);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(analyses[0]?.site.id ?? null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const riskCount = analyses.filter(a => a.overallRisk === "risk").length;
  const safeCount = analyses.length - riskCount;
  const totalLoad = analyses.reduce((sum, a) => sum + a.site.telecomPowerKw, 0);
  const dailyEnergy = analyses.reduce((sum, a) => sum + (a.site.telecomPowerKw + (a.site.ac1CapacityBtu + (a.site.ac2CapacityBtu ?? 0)) / 3412 / 3.5) * 24, 0);
  const selectedAnalysis = analyses.find(a => a.site.id === selectedSiteId) ?? null;
  const selectSite = (id: string) => setSelectedSiteId(id);
  const tabs: Array<{ key: Tab; label: string; icon: ReactNode }> = [
    { key: "overview", label: "Portfolio Overview", icon: <BarChart3 size={15} /> }, { key: "twin", label: "Digital Twin", icon: <Activity size={15} /> },
    { key: "scenarios", label: "Scenario Lab", icon: <FlaskConical size={15} /> }, { key: "map", label: "Geo Risk", icon: <Map size={15} /> },
    { key: "sites", label: "Site Portfolio", icon: <ClipboardList size={15} /> }, { key: "methodology", label: "Model & Data", icon: <Zap size={15} /> },
  ];
  return <div className="min-h-screen bg-background flex flex-col">
    <header className="stc-gradient text-white shadow-lg"><div className="w-full px-4 py-3"><div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4"><img src={stcLogo} alt="stc" className="h-10 w-auto object-contain" style={{ mixBlendMode: "screen" }}/><div className="h-9 w-px bg-white/25"/><img src={acesLogo} alt="ACES" className="h-10 w-auto object-contain" style={{ mixBlendMode: "screen" }}/><div className="h-9 w-px bg-white/25"/><div><h1 className="text-base font-black tracking-tight sm:text-lg">Predictive Site Energy & Environmental Performance</h1><p className="text-[11px] font-medium text-purple-200">Digital Twin Tool · COW Network</p></div></div>
      <div className="flex items-center gap-2"><span className="hidden rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1.5 text-[11px] font-bold text-emerald-200 sm:inline-flex">● MODEL ONLINE</span>{onLogout && <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"><LogOut size={13}/> Logout</button>}</div>
    </div></div></header>
    <nav className="overflow-x-auto border-b border-border bg-card shadow-sm"><div className="flex min-w-max gap-1 px-3">{tabs.map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === tab.key ? "border-purple-600 bg-purple-50 text-purple-800" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab.icon}{tab.label}</button>)}</div></nav>
    <main className="flex-1 p-3 sm:p-4">
      {activeTab === "overview" && <div className="space-y-4"><section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-5 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">Kingdom-wide predictive operations</div><h2 className="mt-1 text-2xl font-black text-gray-900">Energy resilience before service impact</h2><p className="mt-2 max-w-3xl text-sm text-gray-600">Model each COW site under heat, traffic, charging and power-source stress. Prioritize interventions using forecast headroom rather than waiting for alarms or outages.</p></div><button onClick={() => setActiveTab("twin")} className="rounded-xl bg-purple-800 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-purple-700">Open Digital Twin</button></div></section>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6"><MetricCard title="Modeled Sites" value={analyses.length} icon={<Radio size={16}/>} color="purple" subtitle="Current validated dataset"/><MetricCard title="Healthy Sites" value={safeCount} icon={<CheckCircle2 size={16}/>} color="green" subtitle="Within modeled margins"/><MetricCard title="Attention Required" value={riskCount} icon={<AlertCircle size={16}/>} color="orange" subtitle="At least one constraint"/><MetricCard title="Telecom Load" value={`${totalLoad.toFixed(0)} kW`} icon={<Zap size={16}/>} color="blue" subtitle="Connected fleet load"/><MetricCard title="Daily Energy" value={`${(dailyEnergy / 1000).toFixed(1)} MWh`} icon={<BarChart3 size={16}/>} color="yellow" subtitle="Modeled baseline"/><MetricCard title="Daily CO₂" value={`${(dailyEnergy * 0.57 / 1000).toFixed(1)} t`} icon={<Leaf size={16}/>} color="red" subtitle="Grid-equivalent estimate"/></div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4"><RiskDistributionPie analyses={analyses}/><PowerSourceDonut analyses={analyses}/><RiskTypeBreakdown analyses={analyses}/><LocationRiskChart analyses={analyses}/></div><div className="grid grid-cols-1 gap-3 lg:grid-cols-2"><RiskByAreaCard analyses={analyses}/><ActionSitesCard analyses={analyses}/></div></div>}
      {activeTab === "twin" && <DigitalTwinPanel analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={selectSite}/>}
      {activeTab === "scenarios" && <div className="space-y-4"><ScenarioMatrix analyses={analyses} selectedScenarioId={selectedScenarioId} onSelectScenario={id => setSelectedScenarioId(v => v === id ? null : id)}/>{selectedScenarioId && <ScenarioRiskSites analyses={analyses} scenarioId={selectedScenarioId} onClose={() => setSelectedScenarioId(null)}/>}</div>}
      {activeTab === "map" && <div className="grid h-[calc(100vh-160px)] grid-cols-1 gap-4 lg:grid-cols-4"><div className="min-h-[520px] lg:col-span-3"><LeafletMap analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={selectSite}/></div><div className="overflow-auto">{selectedAnalysis ? <SiteDetailPanel analysis={selectedAnalysis} onClose={() => setSelectedSiteId(null)}/> : <EmptySelection/>}</div></div>}
      {activeTab === "sites" && <div className="grid grid-cols-1 gap-4 lg:grid-cols-3"><div className="lg:col-span-2"><SiteTable analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={selectSite}/></div><div>{selectedAnalysis ? <><button onClick={() => setActiveTab("twin")} className="mb-3 w-full rounded-lg bg-purple-800 px-4 py-2 text-xs font-bold text-white">Open selected site in Digital Twin</button><SiteDetailPanel analysis={selectedAnalysis} onClose={() => setSelectedSiteId(null)}/></> : <EmptySelection/>}</div></div>}
      {activeTab === "methodology" && <Methodology/>}
    </main>
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 text-[11px] text-muted-foreground"><span>Model outputs are engineering forecasts and must be calibrated against live telemetry before automated control decisions.</span><span className="font-bold"><span className="text-red-800">Powered by</span> <span className="text-blue-900">ACES MSD</span></span></footer>
  </div>;
}

function EmptySelection() { return <div className="rounded-xl border border-card-border bg-card p-8 text-center text-sm text-muted-foreground">Select a COW site to inspect its digital model.</div>; }
function Methodology() { const blocks = [["1. Asset baseline", "Generator, SEC, rectifier, battery, cooling and telecom nameplate data establish each site's physical model."],["2. Environmental stress", "Ambient temperature applies T3 cooling derating and changes projected HVAC demand."],["3. Operational simulation", "Traffic load, battery charging and power-source availability recalculate energy balance and equipment headroom."],["4. Predictive index", "Power margin, cooling margin and battery autonomy are combined into a transparent 0–100 risk index."],["5. Carbon model", "Electricity and generator runtime are translated into estimated energy, diesel and CO₂ impact."],["6. Calibration path", "Supabase telemetry, weather, alarms and fuel transactions will replace assumptions and support anomaly detection."]]; return <div className="mx-auto max-w-5xl space-y-4"><div className="rounded-2xl bg-purple-950 p-6 text-white"><h2 className="text-2xl font-black">Digital Twin Model & Data Contract</h2><p className="mt-2 text-sm text-purple-200">Transparent, auditable engineering logic today; telemetry-calibrated prediction as data sources are connected.</p></div><div className="grid gap-3 md:grid-cols-2">{blocks.map(([title, body]) => <div key={title} className="rounded-xl border border-card-border bg-card p-5 shadow-sm"><h3 className="font-black text-purple-800">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div><div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-bold text-amber-900">Required live-data tables</h3><p className="mt-2 text-sm text-amber-800">site_assets · telemetry_readings · weather_observations · generator_runtime · fuel_transactions · alarm_events · maintenance_actions · model_predictions</p></div></div>; }
