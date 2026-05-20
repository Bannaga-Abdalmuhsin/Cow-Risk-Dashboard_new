export type Transport =
  | "Electric Scooter"
  | "4x4 Hilux"
  | "4x4 Hilux & Electric Scooter"
  | "4x4 Hilux & Motor Bike";

export interface McCluster {
  teamName:   string;      // real escalation team member name
  mcId:       string;      // Hajj MC / accommodation centre name
  mcLat:      number;
  mcLng:      number;
  location:   string;      // primary deployment area
  transport:  Transport;
  etaMinutes: number;
  siteIds:    string[];    // all sites under this MC
}

const FAST = ["Arafat", "Mina", "Muzdalifah"];
const eta  = (loc: string) => (FAST.includes(loc) ? 15 : 30);

export const MC_CLUSTERS: McCluster[] = [
  {
    teamName: "Arif",
    mcId: "CWN108", mcLat: 21.34916, mcLng: 39.98367,
    location: "Arafat", transport: "Electric Scooter", etaMinutes: eta("Arafat"),
    siteIds: ["CWN960","CWN008","CWN203","CWN105","CWN984","CWN020","CWN087","CWN108"],
  },
  {
    teamName: "Muath",
    mcId: "CWN072", mcLat: 21.34196, mcLng: 39.97602,
    location: "Arafat", transport: "Electric Scooter", etaMinutes: eta("Arafat"),
    siteIds: ["CWN072","CWN084","CWN078","CWN075"],
  },
  {
    teamName: "Akhttar",
    mcId: "CWN062", mcLat: 21.3818, mcLng: 39.89885,
    location: "Muzdalifah", transport: "Electric Scooter", etaMinutes: eta("Muzdalifah"),
    siteIds: ["CWN997","CWN074","CWN300","CWN004","CWN301","CWN955","CWN062"],
  },
  {
    teamName: "Nasser",
    mcId: "CWN066", mcLat: 21.3905912, mcLng: 39.9199632,
    location: "Muzdalifah", transport: "4x4 Hilux & Electric Scooter", etaMinutes: eta("Muzdalifah"),
    siteIds: ["CWN922","CWN970","CWN021","CWN066","CWN208","CWN036","CWN915","CWN101","CWN205","CWN907","CWN206"],
  },
  {
    teamName: "Younis",
    mcId: "CWN089", mcLat: 21.384184, mcLng: 39.910808,
    location: "Muzdalifah", transport: "Electric Scooter", etaMinutes: eta("Muzdalifah"),
    siteIds: ["CWN992","CWN068","CWN214","CWN777","CWN211","CWN089","CWN202","CWN104","CWN903","CWN976"],
  },
  {
    teamName: "Mohammed Emad",
    mcId: "CWN073", mcLat: 21.3738433, mcLng: 39.9865483,
    location: "Arafat", transport: "4x4 Hilux & Motor Bike", etaMinutes: eta("Arafat"),
    siteIds: ["CWN906","CWN073","CWN996","CWN956","CWN980","CWN015"],
  },
  {
    teamName: "Abid",
    mcId: "CWN076", mcLat: 21.3692, mcLng: 39.977127,
    location: "Arafat", transport: "Electric Scooter", etaMinutes: eta("Arafat"),
    siteIds: ["CWN212","CWN923","CWN085","CWN076","CWN951","CWN914"],
  },
  {
    teamName: "Umair",
    mcId: "Makkah MC", mcLat: 20.99354, mcLng: 39.58815,
    location: "Makkah Remote", transport: "4x4 Hilux", etaMinutes: eta("Makkah Remote"),
    siteIds: ["CWN213","CWN002","CWN961","CWN081","CWN093","CWN959","CWN972","CWN032","CWN079","CWN099"],
  },
  {
    teamName: "Tasleem",
    mcId: "Taif MC", mcLat: 21.647214, mcLng: 40.389186,
    location: "Makkah Remote", transport: "4x4 Hilux", etaMinutes: eta("Makkah Remote"),
    siteIds: ["CWN998","CWN967"],
  },
  {
    teamName: "Nadeem",
    mcId: "CWN092", mcLat: 21.333244, mcLng: 39.971526,
    location: "Arafat", transport: "4x4 Hilux & Motor Bike", etaMinutes: eta("Arafat"),
    siteIds: ["CWN050","CWN001","CWN080","CWN083","CWN022","CWN038","CWN092","CWN901"],
  },
  {
    teamName: "Faroq",
    mcId: "CWN978", mcLat: 21.421776, mcLng: 39.891894,
    location: "Mina", transport: "4x4 Hilux", etaMinutes: eta("Mina"),
    siteIds: ["CWN201","CWN994","CWN953","CWN978"],
  },
  {
    teamName: "Ali Nasser",
    mcId: "CWN991", mcLat: 21.37224, mcLng: 39.93826,
    location: "Arafat", transport: "Electric Scooter", etaMinutes: eta("Arafat"),
    siteIds: ["CWN991","CWN102"],
  },
];

/** Backwards-compatible flat list — shape expected by LeafletMap & EscalationTable */
export interface EscalationTeam {
  teamName:   string;
  siteId:     string;
  lat:        number;
  lng:        number;
  powerType:  "SB" | "SG" | "DG";
  location:   string;
  transport:  Transport;
  etaMinutes: number;
}

export const ESCALATION_TEAMS: EscalationTeam[] = MC_CLUSTERS.map(c => ({
  teamName:   c.teamName,
  siteId:     c.siteIds[0] ?? c.mcId,
  lat:        c.mcLat,
  lng:        c.mcLng,
  powerType:  "SB",
  location:   c.location,
  transport:  c.transport,
  etaMinutes: c.etaMinutes,
}));

export const TRANSPORT_ICON: Record<Transport, string> = {
  "Electric Scooter":             "⚡🛵",
  "4x4 Hilux":                    "🛻",
  "4x4 Hilux & Electric Scooter": "🛻⚡🛵",
  "4x4 Hilux & Motor Bike":       "🛻🏍️",
};
