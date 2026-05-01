export type Transport = "Electric Scooter" | "4x4 Hilux" | "4x4 Hilux & Electric Scooter" | "4x4 Hilux & Motor Bike";

export interface EscalationTeam {
  teamName: string;
  siteId: string;
  lat: number;
  lng: number;
  powerType: "SB" | "SG" | "DG";
  location: string;
  transport: Transport;
  etaMinutes: number;
}

const FAST_RESPONSE_ZONES = ["Arafat", "Mina", "Muzdalifah"];

function eta(location: string) {
  return FAST_RESPONSE_ZONES.includes(location) ? 15 : 30;
}

export const ESCALATION_TEAMS: EscalationTeam[] = [
  { teamName: "Team #1",  siteId: "CWN074", lat: 21.388566, lng: 39.902532, powerType: "SB", location: "Muzdalifah",    transport: "Electric Scooter",              etaMinutes: eta("Muzdalifah") },
  { teamName: "Team #2",  siteId: "CWN068", lat: 21.39217,  lng: 39.91244,  powerType: "SB", location: "Muzdalifah",    transport: "Electric Scooter",              etaMinutes: eta("Muzdalifah") },
  { teamName: "Team #3",  siteId: "CWN076", lat: 21.3692,   lng: 39.977127, powerType: "SB", location: "Arafat",        transport: "Electric Scooter",              etaMinutes: eta("Arafat") },
  { teamName: "Team #4",  siteId: "CWN096", lat: 21.67808,  lng: 39.56381,  powerType: "SG", location: "Makkah Remote", transport: "4x4 Hilux",                     etaMinutes: eta("Makkah Remote") },
  { teamName: "Team #5",  siteId: "CWN066", lat: 21.390705, lng: 39.919829, powerType: "SB", location: "Muzdalifah",    transport: "4x4 Hilux & Electric Scooter",  etaMinutes: eta("Muzdalifah") },
  { teamName: "Team #6",  siteId: "CWN002", lat: 21.42045,  lng: 39.87142,  powerType: "SG", location: "Mina",          transport: "4x4 Hilux",                     etaMinutes: eta("Mina") },
  { teamName: "Team #7",  siteId: "CWN072", lat: 21.34196,  lng: 39.97602,  powerType: "SB", location: "Arafat",        transport: "4x4 Hilux & Motor Bike",        etaMinutes: eta("Arafat") },
  { teamName: "Team #8",  siteId: "CWN105", lat: 21.356535, lng: 39.984813, powerType: "SB", location: "Arafat",        transport: "Electric Scooter",              etaMinutes: eta("Arafat") },
  { teamName: "Team #9",  siteId: "CWN998", lat: 21.647214, lng: 40.389186, powerType: "DG", location: "Makkah Remote", transport: "4x4 Hilux",                     etaMinutes: eta("Makkah Remote") },
  { teamName: "Team #10", siteId: "CWN080", lat: 21.38063,  lng: 39.989603, powerType: "SG", location: "Arafat",        transport: "4x4 Hilux & Motor Bike",        etaMinutes: eta("Arafat") },
  { teamName: "Team #11", siteId: "CWN993", lat: 21.380239, lng: 39.910942, powerType: "SB", location: "Umrah office",  transport: "4x4 Hilux",                     etaMinutes: eta("Umrah office") },
  { teamName: "Team #12", siteId: "CWN908", lat: 21.365285, lng: 39.95051,  powerType: "SB", location: "Arafat",        transport: "Electric Scooter",              etaMinutes: eta("Arafat") },
];

export const TRANSPORT_ICON: Record<Transport, string> = {
  "Electric Scooter":             "⚡🛵",
  "4x4 Hilux":                    "🛻",
  "4x4 Hilux & Electric Scooter": "🛻⚡🛵",
  "4x4 Hilux & Motor Bike":       "🛻🏍️",
};
