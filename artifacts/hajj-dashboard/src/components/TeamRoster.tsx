import { useState, useEffect } from "react";
import { Users, Shield, HardHat, Phone, MapPin, Building2, RefreshCw } from "lucide-react";
import type { LiveTechLocation } from "./LeafletMap";

interface TeamMember {
  id: number;
  name: string;
  role: "manager" | "technician";
  defaultArea: string | null;
  mcName: string | null;
  mobileNumber: string | null;
}

interface TeamStats {
  total: number;
  managers: number;
  technicians: number;
  areas: string[];
}

interface TeamRosterProps {
  compact?: boolean;
  techLocations?: LiveTechLocation[];
}

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function getTechStatus(live: LiveTechLocation | undefined): "online" | "offline" | "unknown" {
  if (!live) return "unknown";
  if (minutesAgo(live.updatedAt) < 15) return "online";
  return "offline";
}

const STATUS_STYLE = {
  online:  { icon: "#16a34a", ring: "#16a34a", bg: "rgba(22,163,74,0.12)",  border: "rgba(22,163,74,0.4)",  label: "#16a34a", dot: "#16a34a" },
  offline: { icon: "#dc2626", ring: "#dc2626", bg: "rgba(220,38,38,0.10)",   border: "rgba(220,38,38,0.4)",  label: "#dc2626", dot: "#dc2626" },
  unknown: { icon: "#475569", ring: "#475569", bg: "rgba(71,85,105,0.10)",   border: "rgba(71,85,105,0.25)", label: "#94a3b8", dot: "#475569" },
};

export function TeamRoster({ compact = false, techLocations = [] }: TeamRosterProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  /* Re-evaluate freshness every 30 s so stale cards turn red automatically */
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const fetchTeam = () => {
    setLoading(true);
    setError(null);
    fetch("/api/team/users")
      .then(r => r.ok ? r.json() as Promise<TeamMember[]> : Promise.reject(r.status))
      .then((data) => { setMembers(data); setLastUpdated(new Date()); setLoading(false); })
      .catch(() => {
        fetch("/team-data.json")
          .then(r => r.ok ? r.json() as Promise<TeamMember[]> : Promise.reject("static-404"))
          .then((data) => { setMembers(data); setLastUpdated(new Date()); setLoading(false); })
          .catch(() => { setError("Team data unavailable"); setLoading(false); });
      });
  };

  useEffect(() => { fetchTeam(); }, []);

  const stats: TeamStats = {
    total: members.length,
    managers: members.filter(m => m.role === "manager").length,
    technicians: members.filter(m => m.role === "technician").length,
    areas: [...new Set(members.map(m => m.defaultArea).filter(Boolean) as string[])],
  };

  const onlineCount  = techLocations.filter(t => getTechStatus(t) === "online").length;
  const offlineCount = techLocations.filter(t => getTechStatus(t) === "offline").length;

  const managers    = members.filter(m => m.role === "manager");
  const technicians = members.filter(m => m.role === "technician");

  if (compact) {
    return (
      <div className="flex flex-col gap-3">

        {/* ── Live duty summary ──────────────────────────────────────────── */}
        <div className="bg-card border border-card-border rounded-xl p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live Status · 15 min window
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(22,163,74,0.10)", border: "1px solid rgba(22,163,74,0.25)" }}>
              <div className="text-xl font-bold" style={{ color: "#16a34a" }}>{onlineCount}</div>
              <div className="text-[10px]" style={{ color: "#16a34a" }}>● Online</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.25)" }}>
              <div className="text-xl font-bold" style={{ color: "#dc2626" }}>{offlineCount}</div>
              <div className="text-[10px]" style={{ color: "#dc2626" }}>● Offline</div>
            </div>
          </div>
          {techLocations.length === 0 && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">Waiting for field check-ins…</p>
          )}
        </div>

        {/* ── Registered counts ───────────────────────────────────────────── */}
        <div className="bg-card border border-card-border rounded-xl p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Registered</div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Shield size={12} style={{ color: "#a78bfa" }} /> Managers</span>
            <span className="font-bold" style={{ color: "#a78bfa" }}>{loading ? "—" : stats.managers}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground"><HardHat size={12} style={{ color: "#34d399" }} /> Technicians</span>
            <span className="font-bold" style={{ color: "#34d399" }}>{loading ? "—" : stats.technicians}</span>
          </div>
        </div>

        {/* ── Controls ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Field Team</span>
          <button
            onClick={fetchTeam}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border border-border hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-xs text-red-400">{error}</div>
        )}

        {/* ── Managers row (list) ───────────────────────────────────────── */}
        {managers.length > 0 && (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-border flex items-center gap-1.5">
              <Shield size={12} style={{ color: "#a78bfa" }} />
              <span className="text-xs font-semibold text-foreground">Managers</span>
              <span className="ml-auto text-[10px] text-muted-foreground">{managers.length}</span>
            </div>
            {loading ? (
              <div className="p-3 text-center text-xs text-muted-foreground">Loading...</div>
            ) : (
              <div className="divide-y divide-border">
                {managers.map(m => {
                  const live = techLocations.find(t => t.userName === m.name);
                  return <MemberRow key={m.id} member={m} liveStatus={live} compact />;
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Technicians helmet grid ───────────────────────────────────── */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center gap-1.5">
            <HardHat size={12} style={{ color: "#34d399" }} />
            <span className="text-xs font-semibold text-foreground">Technicians</span>
            <span className="ml-auto text-[10px] text-muted-foreground">{technicians.length}</span>
          </div>
          {loading ? (
            <div className="p-3 text-center text-xs text-muted-foreground">Loading...</div>
          ) : technicians.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">No technicians registered</div>
          ) : (
            <div className="p-2 grid grid-cols-3 gap-2">
              {technicians.map(m => {
                const live     = techLocations.find(t => t.userName === m.name);
                const status   = getTechStatus(live);
                const s        = STATUS_STYLE[status];
                const mins     = live ? minutesAgo(live.updatedAt) : null;
                const areaText = live?.area ?? m.defaultArea ?? null;

                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-center gap-1 rounded-xl p-2 border transition-all"
                    style={{ background: s.bg, borderColor: s.border }}
                    title={areaText ? `${m.name} · ${areaText}${mins !== null ? ` · ${mins}m ago` : ""}` : m.name}
                  >
                    {/* Helmet icon */}
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: 40, height: 40,
                        background: `${s.icon}22`,
                        border: `2px solid ${s.ring}55`,
                        boxShadow: status === "online" ? `0 0 8px ${s.ring}55` : undefined,
                      }}
                    >
                      <HardHat size={22} style={{ color: s.icon }} />
                    </div>

                    {/* Name */}
                    <span
                      className="text-center font-semibold leading-tight"
                      style={{ fontSize: 9.5, color: "#000000", maxWidth: "100%", wordBreak: "break-word" }}
                    >
                      {m.name.split(" ")[0]}
                    </span>

                    {/* Status indicator */}
                    <div className="flex items-center gap-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full inline-block ${status === "online" ? "animate-pulse" : ""}`}
                        style={{ background: s.dot }}
                      />
                      <span style={{ fontSize: 8.5, color: s.label, fontWeight: 700 }}>
                        {status === "online"  ? `${mins}m` :
                         status === "offline" ? (mins !== null ? `${mins}m` : "off") :
                         "—"}
                      </span>
                    </div>

                    {/* Area */}
                    {areaText && (
                      <span
                        className="text-center leading-tight truncate w-full"
                        style={{ fontSize: 8, color: "#64748b" }}
                      >
                        {areaText.replace("Makkah", "Mka").replace("Muzdalifa","Muz").replace("Arafat","Arf")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {lastUpdated && (
          <p className="text-[10px] text-muted-foreground text-center">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  /* ── Full (non-compact) view ─────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
            <Users size={14} /> Total Registered
          </div>
          <div className="text-3xl font-bold text-foreground">{loading ? "—" : stats.total}</div>
          <div className="text-xs text-muted-foreground">Team members</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
            <Shield size={14} /> Managers
          </div>
          <div className="text-3xl font-bold" style={{ color: "#a78bfa" }}>{loading ? "—" : stats.managers}</div>
          <div className="text-xs text-muted-foreground">Operations leads</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
            <HardHat size={14} /> Technicians
          </div>
          <div className="text-3xl font-bold" style={{ color: "#34d399" }}>{loading ? "—" : stats.technicians}</div>
          <div className="text-xs text-muted-foreground">Field engineers</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
            <MapPin size={14} /> Areas Covered
          </div>
          <div className="text-3xl font-bold" style={{ color: "#f59e0b" }}>{loading ? "—" : stats.areas.length}</div>
          <div className="text-xs text-muted-foreground">Hajj zones assigned</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users size={15} className="text-purple-400" />
          Registered Team Members
          {!loading && <span className="text-xs font-normal text-muted-foreground">({stats.total} total)</span>}
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdated && <span className="text-xs text-muted-foreground">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <button
            onClick={fetchTeam}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          Failed to load team data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Shield size={14} style={{ color: "#a78bfa" }} />
            <span className="text-sm font-semibold text-foreground">Managers</span>
            <span className="ml-auto text-xs text-muted-foreground">{managers.length}</span>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : managers.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No managers registered</div>
          ) : (
            <div className="divide-y divide-border">
              {managers.map(m => <MemberRow key={m.id} member={m} />)}
            </div>
          )}
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <HardHat size={14} style={{ color: "#34d399" }} />
            <span className="text-sm font-semibold text-foreground">Technicians</span>
            <span className="ml-auto text-xs text-muted-foreground">{technicians.length}</span>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : technicians.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No technicians registered</div>
          ) : (
            <div className="divide-y divide-border">
              {technicians.map(m => <MemberRow key={m.id} member={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberRow({ member, liveStatus, compact = false }: {
  member: TeamMember;
  liveStatus?: LiveTechLocation;
  compact?: boolean;
}) {
  const isManager = member.role === "manager";
  const status    = getTechStatus(liveStatus);
  const s         = STATUS_STYLE[status];
  const hasLive   = liveStatus !== undefined;

  if (compact) {
    return (
      <div className="px-3 py-2 flex items-center gap-2 hover:bg-muted/20 transition-colors">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-foreground truncate" style={!isManager ? { color: "#000000" } : undefined}>{member.name}</span>
            {hasLive && (
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === "online" ? "animate-pulse" : ""}`}
                style={{ background: s.dot }}
              />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground truncate">
            {liveStatus?.area ?? member.defaultArea ?? "—"}
          </span>
        </div>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0"
          style={
            isManager
              ? { background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }
              : hasLive
                ? { background: s.bg, color: s.label, border: `1px solid ${s.border}` }
                : { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }
          }
        >
          {hasLive ? (status === "online" ? "on" : "off") : (isManager ? "mgr" : "tech")}
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex flex-col gap-1.5 hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm text-foreground" style={!isManager ? { color: "#000000" } : undefined}>{member.name}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
          style={
            isManager
              ? { background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }
              : { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }
          }
        >
          {member.role}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {member.defaultArea && <span className="flex items-center gap-1"><MapPin size={10} className="shrink-0" />{member.defaultArea}</span>}
        {member.mcName      && <span className="flex items-center gap-1"><Building2 size={10} className="shrink-0" />{member.mcName}</span>}
        {member.mobileNumber && <span className="flex items-center gap-1"><Phone size={10} className="shrink-0" />{member.mobileNumber}</span>}
      </div>
    </div>
  );
}
