import Constants from "expo-constants";

/**
 * Derives the picard API base URL using multiple strategies in priority order.
 *
 * Strategy 3 is the most reliable for native iOS/Android in Expo Go because
 * Constants.linkingUri is set at runtime by Expo Go itself — it never depends
 * on Metro env-var baking succeeding.
 *
 * expo domain  →  *.expo.picard.replit.dev  (Metro, returns HTML for /api)
 * picard domain → *.picard.replit.dev        (API server, returns JSON)
 */
export function getBaseUrl(): string {
  // 1. EXPO_PUBLIC_API_URL — full https:// URL written by dev script to .env.local
  //    and injected as a process-env prefix. Most explicit source.
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) return apiUrl;

  // 2. EXPO_PUBLIC_DOMAIN — just the hostname, baked by Metro.
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;

  // 3. Runtime: derive from Constants.linkingUri which Expo Go always sets.
  //    Format: "exp://UUID.expo.picard.replit.dev:PORT/--/"
  //    Strip exp://, remove port, replace ".expo.picard." → ".picard."
  try {
    const linking = Constants.linkingUri ?? "";
    if (linking) {
      const withoutScheme = linking.replace(/^exp?:\/\//, "");
      const host = withoutScheme.split(":")[0].split("/")[0];
      if (host.includes(".expo.picard.replit.dev")) {
        return `https://${host.replace(".expo.picard.replit.dev", ".picard.replit.dev")}`;
      }
    }
  } catch {}

  // 4. Web fallback: strip ".expo." from window.location.hostname.
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    const apiHost = host.replace(".expo.picard.replit.dev", ".picard.replit.dev");
    if (apiHost !== host) return `https://${apiHost}`;
  }

  return "";
}

/** Debug helper — returns what getBaseUrl() resolves to (never empty in prod). */
export function debugBaseUrl(): string {
  const url = getBaseUrl();
  const linking = (() => { try { return Constants.linkingUri ?? ""; } catch { return ""; } })();
  return url
    ? `API: ${url}`
    : `(empty) linkingUri=${linking} API_URL=${process.env.EXPO_PUBLIC_API_URL ?? "–"} DOMAIN=${process.env.EXPO_PUBLIC_DOMAIN ?? "–"}`;
}

/** Kept for backwards-compat */
export const BASE_URL = "";

export const LOCATIONS = ["Arafat", "Mina", "Muzdalifa", "Makkah", "Makkah Remote"] as const;
export type HajjLocation = typeof LOCATIONS[number];

export interface TechLocationWithUser {
  id: number;
  userId: number;
  userName: string;
  role: string;
  defaultArea: string | null;
  lat: number;
  lng: number;
  area: string | null;
  isOnDuty: boolean;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  message: string;
  sentAt: string;
  readAt: string | null;
  managerName: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  sentAt: string;
  readAt: string | null;
}

export interface TeamUser {
  id: number;
  name: string;
  role: string;
  defaultArea:  string | null;
  mcName:       string | null;
  mobileNumber: string | null;
}

export class UnauthorizedError extends Error {
  constructor() { super("Session expired. Please log in again."); }
}

export async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${getBaseUrl()}${path}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) throw new UnauthorizedError();
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getTeamLocations(token: string | null): Promise<TechLocationWithUser[]> {
  return apiFetch<TechLocationWithUser[]>("/api/team/locations", token);
}

export async function updateLocation(
  token: string,
  lat: number,
  lng: number,
  area: string | null,
  isOnDuty: boolean,
): Promise<void> {
  await apiFetch("/api/team/location", token, {
    method: "PUT",
    body:   JSON.stringify({ lat, lng, area, isOnDuty }),
  });
}

export async function getMyAssignment(token: string): Promise<Assignment | null> {
  return apiFetch<Assignment | null>("/api/team/assignments/my", token);
}

export async function sendAssignment(token: string, techId: number, message: string): Promise<void> {
  await apiFetch("/api/team/assignments", token, {
    method: "POST",
    body:   JSON.stringify({ techId, message }),
  });
}

export async function broadcastMessage(token: string, message: string): Promise<{ sent: number }> {
  return apiFetch("/api/team/broadcast", token, {
    method: "POST",
    body:   JSON.stringify({ message }),
  });
}

export async function getChatHistory(token: string, techId: number): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>(`/api/team/assignments/${techId}/history`, token);
}

export async function markAssignmentRead(token: string, id: number): Promise<void> {
  await apiFetch(`/api/team/assignments/${id}/read`, token, { method: "PATCH" });
}

export async function getTeamUsers(token: string | null): Promise<TeamUser[]> {
  return apiFetch<TeamUser[]>("/api/team/users", token);
}

export async function createTeamUser(
  token: string,
  name: string,
  pin: string,
  role: string,
  defaultArea: string | null,
  mcName?: string,
  mobileNumber?: string,
): Promise<TeamUser> {
  return apiFetch<TeamUser>("/api/team/users", token, {
    method: "POST",
    body:   JSON.stringify({ name, pin, role, defaultArea, mcName, mobileNumber }),
  });
}

export async function updateTeamUser(
  token: string,
  id: number,
  fields: { name?: string; pin?: string; defaultArea?: string; mcName?: string; mobileNumber?: string },
): Promise<TeamUser> {
  return apiFetch<TeamUser>(`/api/team/users/${id}`, token, {
    method: "PATCH",
    body:   JSON.stringify(fields),
  });
}

export async function deleteTeamUser(token: string, id: number): Promise<void> {
  await apiFetch(`/api/team/users/${id}`, token, { method: "DELETE" });
}

export function detectArea(lat: number, lng: number): string {
  if (lat > 21.20 && lat < 21.45 && lng > 39.80 && lng < 39.95) {
    if (lat > 21.37 && lat < 21.43 && lng > 39.86 && lng < 39.92) return "Mina";
    if (lat > 21.34 && lat < 21.38 && lng > 39.93 && lng < 39.99) return "Muzdalifa";
    if (lat > 21.36 && lat < 21.41 && lng > 39.96 && lng < 40.05) return "Arafat";
    return "Makkah";
  }
  return "Holy Sites";
}
