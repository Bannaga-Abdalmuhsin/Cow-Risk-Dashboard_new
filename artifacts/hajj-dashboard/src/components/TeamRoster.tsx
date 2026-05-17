import { useState, useEffect } from "react";
import { Users, Shield, HardHat, Phone, MapPin, Building2, RefreshCw } from "lucide-react";

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

export function TeamRoster() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTeam = () => {
    setLoading(true);
    setError(null);
    fetch("/api/team/users")
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then((data: TeamMember[]) => {
        setMembers(data);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  };

  useEffect(() => { fetchTeam(); }, []);

  const stats: TeamStats = {
    total: members.length,
    managers: members.filter(m => m.role === "manager").length,
    technicians: members.filter(m => m.role === "technician").length,
    areas: [...new Set(members.map(m => m.defaultArea).filter(Boolean) as string[])],
  };

  const managers = members.filter(m => m.role === "manager");
  const technicians = members.filter(m => m.role === "technician");

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
          {!loading && (
            <span className="text-xs font-normal text-muted-foreground">({stats.total} total)</span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
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

      {/* Two-column layout: Managers | Technicians */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Managers */}
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
              {managers.map(m => (
                <MemberRow key={m.id} member={m} />
              ))}
            </div>
          )}
        </div>

        {/* Technicians */}
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
              {technicians.map(m => (
                <MemberRow key={m.id} member={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  const isManager = member.role === "manager";
  return (
    <div className="px-4 py-3 flex flex-col gap-1.5 hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm text-foreground">{member.name}</span>
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
        {member.defaultArea && (
          <span className="flex items-center gap-1">
            <MapPin size={10} className="shrink-0" />
            {member.defaultArea}
          </span>
        )}
        {member.mcName && (
          <span className="flex items-center gap-1">
            <Building2 size={10} className="shrink-0" />
            {member.mcName}
          </span>
        )}
        {member.mobileNumber && (
          <span className="flex items-center gap-1">
            <Phone size={10} className="shrink-0" />
            {member.mobileNumber}
          </span>
        )}
      </div>
    </div>
  );
}
