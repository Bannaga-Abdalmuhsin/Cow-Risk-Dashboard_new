import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import type { LiveTechLocation } from "../components/LeafletMap";
import { TeamGoogleMap } from "../components/TeamGoogleMap";
import acesLogo from "@assets/ChatGPT_Image_Oct_14,_2025,_10_29_41_PM_1776566555155.png";
import stcLogo from "@assets/7010.SR.D-9f4e531b_(1)_1776566577166.png";
import { LayoutDashboard, Map, ClipboardList, HardHat, Radio, CheckCircle2, AlertCircle, Users, Thermometer, UsersRound, Siren, CalendarDays } from "lucide-react";
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
import { RiskByAreaCard, ActionSitesCard } from "../components/OverviewInsights";
import { EscalationTable } from "../components/EscalationTable";
import { TeamRoster } from "../components/TeamRoster";
import { FaultManagement } from "../components/FaultManagement";
import { DeploymentTimeline } from "../components/DeploymentTimeline";

type Tab = "overview" | "scenarios" | "map" | "sites" | "timeline" | "technicians" | "teams" | "faults";

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

  const riskCount = useMemo(() => analyses.filter(a => a.overallRisk === "risk").length, [analyses]);
  const safeCount = useMemo(() => analyses.filter(a => a.overallRisk === "safe").length, [analyses]);
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

  const [techLocations, setTechLocations] = useState<LiveTechLocation[]>([]);
  const wsRef   = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeTab !== "technicians" && activeTab !== "teams") {
      wsRef.current?.close();
      wsRef.current = null;
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }

    /* initial snapshot via REST */
    fetch("/api/team/locations")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: LiveTechLocation[]) => setTechLocations(data))
      .catch(() => {});

    /* WebSocket real-time subscribe */
    let dead = false;
    const wsUrl = window.location.origin.replace(/^http/, "ws") + "/api/team/ws";

    const connect = () => {
      if (dead) return;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen  = () => ws.send(JSON.stringify({ type: "subscribe" }));

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as Record<string, unknown>;
          if (msg.type === "locations_snapshot") {
            const locs = (msg.locations as Array<{
              userId: number; userName: string; lat: number; lng: number;
              area: string | null; isOnDuty: boolean; updatedAt: string;
            }>).map(l => ({
              userId:    l.userId,
              userName:  l.userName,
              lat:       l.lat,
              lng:       l.lng,
              area:      l.area,
              isOnDuty:  l.isOnDuty,
              updatedAt: l.updatedAt,
            }));
            setTechLocations(locs);
          } else if (msg.type === "location") {
            const loc = msg as {
              userId: number; userName: string; lat: number; lng: number;
              area: string | null; isOnDuty: boolean; updatedAt: string;
            };
            setTechLocations(prev => {
              const next = prev.filter(t => t.userId !== loc.userId);
              next.push({
                userId:    loc.userId,
                userName:  loc.userName,
                lat:       loc.lat,
                lng:       loc.lng,
                area:      loc.area,
                isOnDuty:  loc.isOnDuty,
                updatedAt: loc.updatedAt,
              });
              return next;
            });
          } else if (msg.type === "pong") {
            /* keepalive ok */
          }
        } catch {}
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!dead) {
          /* fallback poll at 5 s while WS reconnects */
          if (!pollRef.current) {
            const fetchTechs = () => {
              fetch("/api/team/locations")
                .then(r => r.ok ? r.json() : Promise.reject())
                .then((data: LiveTechLocation[]) => setTechLocations(data))
                .catch(() => {});
            };
            pollRef.current = setInterval(fetchTechs, 5_000);
          }
          /* try to reconnect in 3 s */
          setTimeout(connect, 3_000);
        }
      };

      ws.onerror = () => ws.close();
    };

    connect();

    /* keepalive ping every 20 s */
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 20_000);

    return () => {
      dead = true;
      wsRef.current?.close();
      wsRef.current = null;
      clearInterval(pingInterval);
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [activeTab]);

  const handleSelectSite = (id: string) => {
    setSelectedSiteId(prev => prev === id ? null : id);
    if (activeTab !== "map" && activeTab !== "sites") setActiveTab("map");
  };

  const tabs: Array<{ key: Tab; label: string; icon: ReactNode }> = [
    { key: "overview",     label: "Overview",   icon: <LayoutDashboard size={14} /> },
    { key: "scenarios",    label: "Scenarios",  icon: <span className="font-bold text-sm leading-none">!</span> },
    { key: "map",          label: "Heat Map",   icon: <Map             size={14} /> },
    { key: "sites",        label: "Site List",      icon: <ClipboardList   size={14} /> },
    { key: "timeline",     label: "Deployment",     icon: <CalendarDays    size={14} /> },
    { key: "technicians",  label: "Field Ops",      icon: <HardHat         size={14} /> },
    { key: "teams",        label: "Teams",        icon: <UsersRound      size={14} /> },
    { key: "faults",       label: "Fault Mgmt",   icon: <Siren           size={14} /> },
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

      <main className="flex-1 w-full px-2 py-3 flex flex-col">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-3 flex-1 min-h-0" style={{ height: "calc(100vh - 130px)" }}>
            {/* Row 1 — Metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
              <MetricCard title="Total COW Sites"    value={TOTAL_FLEET}     icon={<Radio       size={16} />} color="purple" subtitle="Full Hajj 1447 deployment" />
              <MetricCard title="Safe Sites"         value={safeCount}       icon={<CheckCircle2 size={16} />} color="green"  subtitle={`Of ${surveyedCount} deployed sites`} />
              <MetricCard title="Risk Sites"         value={riskCount}       icon={<AlertCircle  size={16} />} color="orange" subtitle={`Of ${surveyedCount} deployed sites`} />
              <MetricCard title="Field Technicians"  value={PLANNED_TECHS}   icon={<Users        size={16} />} color="blue"   subtitle={`Planned · ${TOTAL_FLEET} total sites`} />
              <MetricCard title="Operating Temp"     value="46°C"            icon={<Thermometer  size={16} />} color="red"    subtitle="Extreme Hajj conditions" />
              <MetricCard title="Total Risk Flags"   value={totalRiskFlags}  icon={<AlertCircle  size={16} />} color="yellow" subtitle="Across all sites & scenarios" />
            </div>

            {/* Row 2 — Chart cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 min-h-0">
              <RiskDistributionPie analyses={analyses} />
              <PowerSourceDonut    analyses={analyses} />
              <RiskTypeBreakdown   analyses={analyses} />
              <LocationRiskChart   analyses={analyses} />
            </div>

            {/* Row 3 — Insight cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0">
              <TechnicianRecommendation analyses={analyses} plannedTechs={PLANNED_TECHS} totalFleet={TOTAL_FLEET} />
              <RiskByAreaCard  analyses={analyses} />
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

        {activeTab === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-148px)]">
            <div className="lg:col-span-3 flex flex-col gap-3 h-full min-h-0">
              <div className="flex-1 min-h-0">
                <LeafletMap analyses={analyses} selectedSiteId={selectedSiteId} onSelectSite={handleSelectSite} />
              </div>
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <RiskDistributionPie analyses={analyses} />
                <LocationRiskChart analyses={analyses} />
              </div>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-3">
              {selectedAnalysis ? (
                <div className="flex-1 overflow-auto">
                  <SiteDetailPanel analysis={selectedAnalysis} onClose={() => setSelectedSiteId(null)} />
                </div>
              ) : (
                <div className="bg-card border border-card-border rounded-xl p-4 text-center text-sm text-muted-foreground flex-1 flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl opacity-30">📍</div>
                  <p>Click a site marker on the map to view detailed risk analysis</p>
                  <p className="text-xs">
                    <span className="text-red-500 font-semibold">{riskCount} risk</span> ·{" "}
                    <span className="text-emerald-500 font-semibold">{safeCount} safe</span>
                  </p>
                </div>
              )}
            </div>
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

        {activeTab === "timeline" && (
          <DeploymentTimeline />
        )}

        {activeTab === "teams" && (
          <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 148px)", overflow: "hidden" }}>
            {/* Branded header + live status bar */}
            <div className="flex flex-col gap-2 shrink-0 rounded-xl px-4 py-3"
              style={{ background: "linear-gradient(135deg, rgba(74,14,143,0.18) 0%, rgba(0,191,179,0.10) 100%)", border: "1px solid rgba(147,51,234,0.22)" }}>
              {/* Title row */}
              <div className="flex items-center gap-3">
                <img src="/aces-logo-nobg.png" alt="ACES MSD" style={{ height: 36, width: "auto", filter: "drop-shadow(0 2px 6px rgba(74,14,143,0.4))" }} />
                <div>
                  <div className="text-base font-black tracking-tight leading-tight" style={{ color: "#c4b5fd" }}>
                    HAJJ ACES MSD Team Coverage
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">Hajj 1447 · Live Field Operations · Nokia COW Deployment</div>
                </div>
                {/* Live pulse badge */}
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)" }}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-400">LIVE</span>
                </div>
              </div>
              {/* Stats row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  {techLocations.length > 0 ? (
                    <>
                      <span className="text-emerald-400 font-semibold">
                        {techLocations.filter(t => t.isOnDuty).length} on duty
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {techLocations.filter(t => !t.isOnDuty).length} off duty
                      </span>
                      <span className="text-muted-foreground">· {techLocations.length} total · refreshes every 2s</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No live locations yet — waiting for field check-ins</span>
                  )}
                </div>
                {/* Zone breakdown pills */}
                {techLocations.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap ml-auto">
                    {["Arafat","Mina","Muzdalifa","Makkah","Makkah Remote"].map(zone => {
                      const inZone = techLocations.filter(t => t.area?.toLowerCase().includes(zone.toLowerCase()));
                      const on = inZone.filter(t => t.isOnDuty).length;
                      const off = inZone.filter(t => !t.isOnDuty).length;
                      if (inZone.length === 0) return null;
                      return (
                        <span key={zone} className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                          style={{ background: "rgba(147,51,234,0.10)", borderColor: "rgba(147,51,234,0.25)", color: "#c4b5fd" }}>
                          {zone}: <span style={{ color: "#34d399" }}>{on}✓</span>{off > 0 && <span style={{ color: "#9ca3af" }}> {off}✗</span>}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Main content: map + roster */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 min-h-0" style={{ flex: 1 }}>
              {/* Full-height Google Map */}
              <div className="lg:col-span-3 min-h-0" style={{ height: "100%" }}>
                <TeamGoogleMap
                  analyses={analyses}
                  techLocations={techLocations}
                  selectedSiteId={selectedSiteId}
                  onSelectSite={handleSelectSite}
                />
              </div>

              {/* Right sidebar: roster — scrolls independently */}
              <div className="lg:col-span-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
                <TeamRoster compact techLocations={techLocations} />
              </div>
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
              <div className="lg:col-span-2" style={{ height: 420 }}>
                {techLocations.length > 0 && (
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span className="text-emerald-400 font-semibold">
                      {techLocations.filter(t => t.isOnDuty).length} technician{techLocations.filter(t => t.isOnDuty).length !== 1 ? "s" : ""} live on map
                    </span>
                    <span className="text-muted-foreground">· refreshes every 2s</span>
                  </div>
                )}
                <TeamGoogleMap
                  analyses={analyses}
                  techLocations={techLocations}
                  selectedSiteId={selectedSiteId}
                  onSelectSite={handleSelectSite}
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

        {activeTab === "faults" && (
          <FaultManagement />
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
