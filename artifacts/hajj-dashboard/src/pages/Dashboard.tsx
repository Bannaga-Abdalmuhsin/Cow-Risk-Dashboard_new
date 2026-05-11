import { useState, useMemo, type ReactNode } from "react";
import acesLogo from "@assets/ChatGPT_Image_Oct_14,_2025,_10_29_41_PM_1776566555155.png";
import stcLogo from "@assets/7010.SR.D-9f4e531b_(1)_1776566577166.png";
import { LayoutDashboard, ClipboardList, HardHat, Radio, CheckCircle2, AlertCircle, Users, Thermometer } from "lucide-react";
import { analyzeSite } from "../lib/calculations";
import { ALL_SITES } from "../lib/siteData";
import { MetricCard } from "../components/MetricCard";
import { LeafletMap } from "../components/LeafletMap";
import { SiteDetailPanel } from "../components/SiteDetailPanel";
import { SiteTable } from "../components/SiteTable";
import { TechnicianRecommendation } from "../components/TechnicianRecommendation";
import { RiskDistributionPie, PowerSourceDonut, RiskTypeBreakdown, LocationRiskChart } from "../components/RiskCharts";
import { ScenarioMatrix } from "../components/ScenarioMatrix";
import { ScenarioRiskSites } from "../components/ScenarioRiskSites";
import { ActionSitesCard } from "../components/OverviewInsights";
import { EscalationTable } from "../components/EscalationTable";

type Tab = "overview" | "scenarios" | "sites" | "technicians";

interface DashboardProps {
  onLogout?: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);

  const TOTAL_FLEET    = 79;   // full Hajj 1447 COW deployment (1 additional site pending verification)
  const PLANNED_TECHS  = 16;   // technicians allocated for operations

  const analyses = useMemo(() => ALL_SITES.map(analyzeSite), []);

  const safeCount    = analyses.filter(a => a.overallRisk === "safe").length;
  const riskCount    = analyses.filter(a => a.overallRisk === "risk").length;
  const surveyedCount = Math.min(analyses.length, TOTAL_FLEET);
  const pendingCount  = Math.max(0, TOTAL_FLEET - analyses.length);
  const totalRiskFlags = analyses.reduce((sum, a) =>
    sum + a.scenarios.reduce((s2, sc) =>
      s2 +
      (sc.powerRisk     === "risk" ? 1 : 0) +
      (sc.coolingRisk   === "risk" && sc.scenarioId !== 9 ? 1 : 0) +
      (sc.batteryRisk   === "risk" ? 1 : 0) +
      (sc.rectifierRisk === "risk" ? 1 : 0)
    , 0)
  , 0);

  const selectedAnalysis = selectedSiteId ? analyses.find(a => a.site.id === selectedSiteId) ?? null : null;

  const handleSelectSite = (id: string) => {
    setSelectedSiteId(prev => prev === id ? null : id);
    if (activeTab !== "overview" && activeTab !== "sites") setActiveTab("overview");
  };

  const tabs: Array<{ key: Tab; label: string; icon: ReactNode }> = [
    { key: "overview",    label: "Overview",  icon: <LayoutDashboard size={14} /> },
    { key: "scenarios",   label: "Scenarios", icon: <span className="font-bold text-sm leading-none">!</span> },
    { key: "sites",       label: "Site List", icon: <ClipboardList   size={14} /> },
    { key: "technicians", label: "Field Ops", icon: <HardHat         size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="stc-gradient text-white shadow-lg">
        <div className="w-full px-2 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <img
                src={stcLogo}
                alt="stc"
                className="h-10 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
              <div className="w-px h-8 bg-white/30" />
              <img
                src={acesLogo}
                alt="ACES Managed Services"
                className="h-10 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
              <div className="w-px h-8 bg-white/30" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">Hajj 1447 COW Risk Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">

              <div className="flex gap-2">
                <div className="bg-red-500/30 border border-red-400/30 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-lg font-bold text-red-200">{riskCount}</div>
                  <div className="text-[10px] text-red-300 uppercase">Risk</div>
                </div>
                <div className="bg-emerald-500/30 border border-emerald-400/30 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-lg font-bold text-emerald-200">{safeCount}</div>
                  <div className="text-[10px] text-emerald-300 uppercase">Safe</div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: "rgba(220,38,38,0.18)",
                    border: "1px solid rgba(220,38,38,0.35)",
                    color: "#fca5a5",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.35)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
                  }}
                  title="Sign out"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b border-border shadow-sm">
        <div className="w-full px-2 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="px-4 py-2.5 text-xs font-medium transition-all flex items-center gap-1.5 border-b-2 -mb-px rounded-t"
              style={
                activeTab === t.key
                  ? {
                      borderBottomColor: "#9333ea",
                      color: "#ffffff",
                      background: "linear-gradient(180deg, rgba(107,33,200,0.22) 0%, rgba(147,51,234,0.10) 100%)",
                      boxShadow: "inset 0 1px 0 rgba(192,132,252,0.25), 0 0 12px rgba(147,51,234,0.15)",
                    }
                  : {
                      borderBottomColor: "transparent",
                      color: "var(--muted-foreground)",
                      background: "transparent",
                    }
              }
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full px-2 py-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <MetricCard title="Total COW Sites" value={TOTAL_FLEET} icon={<Radio size={16} />} color="blue" subtitle="Full Hajj 1447 deployment" />
              <MetricCard title="Safe Sites" value={safeCount} icon={<CheckCircle2 size={16} />} color="green" subtitle={`Of ${surveyedCount} deployed sites`} />
              <MetricCard title="Risk Sites" value={riskCount} icon={<AlertCircle size={16} />} color="red" subtitle={`Of ${surveyedCount} deployed sites`} />
              <MetricCard title="Field Technicians" value={PLANNED_TECHS} icon={<Users size={16} />} color="blue" subtitle={`Planned · ${TOTAL_FLEET} total sites`} />
              <MetricCard title="Operating Temp" value="46°C" icon={<Thermometer size={16} />} color="red" subtitle="Extreme Hajj conditions" />
              <MetricCard title="Total Risk Flags" value={totalRiskFlags} icon={<AlertCircle size={16} />} color="red" subtitle="Across all sites & scenarios" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <RiskDistributionPie analyses={analyses} />
              <PowerSourceDonut analyses={analyses} />
              <RiskTypeBreakdown analyses={analyses} />
              <LocationRiskChart analyses={analyses} />
            </div>

            {/* Heat Map — center of overview */}
            <div className="rounded-xl overflow-hidden border border-card-border" style={{ height: 380 }}>
              <LeafletMap analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={handleSelectSite} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <TechnicianRecommendation analyses={analyses} plannedTechs={PLANNED_TECHS} totalFleet={TOTAL_FLEET} />
              <ActionSitesCard analyses={analyses} />
            </div>

          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-4">
            <ScenarioMatrix
              analyses={analyses}
              selectedScenarioId={selectedScenarioId}
              onSelectScenario={id => setSelectedScenarioId(prev => prev === id ? null : id)}
            />
            {selectedScenarioId !== null && (
              <ScenarioRiskSites
                analyses={analyses}
                scenarioId={selectedScenarioId}
                onClose={() => setSelectedScenarioId(null)}
              />
            )}
          </div>
        )}


        {activeTab === "sites" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <SiteTable analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={handleSelectSite} />
              <RiskTypeBreakdown analyses={analyses} />
            </div>
            <div className="space-y-3">
              {selectedAnalysis ? (
                <SiteDetailPanel analysis={selectedAnalysis} onClose={() => setSelectedSiteId(null)} />
              ) : (
                <div className="bg-card border border-card-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                  <div className="text-4xl opacity-30 mb-2">🗼</div>
                  <p>Select a site from the table to view detailed analysis</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "technicians" && (
          <div className="space-y-4">
            {/* Top row: summary stats + map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <TechnicianRecommendation analyses={analyses} plannedTechs={PLANNED_TECHS} totalFleet={TOTAL_FLEET} />
              </div>
              <div className="lg:col-span-2" style={{ minHeight: 340 }}>
                <LeafletMap
                  analyses={analyses}
                  selectedSiteId={selectedSiteId}
                  onSelectSite={handleSelectSite}
                  showTeamMarkers={true}
                />
              </div>
            </div>

            {/* Escalation table */}
            <EscalationTable
              analyses={analyses}
              onSelectSite={handleSelectSite}
              selectedSiteId={selectedSiteId}
            />

            {/* Site detail panel */}
            {selectedAnalysis && (
              <SiteDetailPanel analysis={selectedAnalysis} onClose={() => setSelectedSiteId(null)} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-muted/30 py-3 px-2 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
        <span>Hajj 1447 · stc COW Power & Cooling Risk Dashboard · {analyses.length} Sites · 46°C Extreme Conditions Analysis</span>
        {activeTab === "overview" && (
          <span className="font-semibold tracking-wide">
            <span style={{ color: "#7f1d1d" }}>Powered by</span>{" "}
            <span style={{ color: "#1e3a8a" }}>ACES MSD</span>
          </span>
        )}
      </footer>
    </div>
  );
}
