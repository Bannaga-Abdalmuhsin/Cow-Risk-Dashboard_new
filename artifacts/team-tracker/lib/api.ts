import Constants from "expo-constants";

/** Strip the `.expo` subdomain to get the main proxy domain */
function expoHostToApiHost(raw: string): string {
  const host = raw.split(":")[0].replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return host.replace(".expo.picard.replit.dev", ".picard.replit.dev");
}

/** Lazy — called on every fetch so Constants is fully initialised */
export function getBaseUrl(): string {
  // 1. Explicit EXPO_PUBLIC_* env var baked in by Metro
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;

  // 2. Web: derive from window.location (expo.picard → picard)
  if (typeof window !== "undefined" && window.location?.hostname) {
    const apiHost = expoHostToApiHost(window.location.hostname);
    if (!apiHost.includes(".expo.picard")) return `https://${apiHost}`;
  }

  // 3. Native: derive from Constants.linkingUri
  //    e.g. "exp://uuid.expo.picard.replit.dev:PORT/--/"
  const linkingUri: string = (Constants as { linkingUri?: string }).linkingUri ?? "";
  if (linkingUri) {
    const apiHost = expoHostToApiHost(linkingUri);
    if (!apiHost.includes(".expo.picard") && apiHost.includes("picard.replit.dev")) {
      return `https://${apiHost}`;
    }
  }

  // 4. Native: Constants.expoConfig.hostUri (dev server injects this)
  const hostUri: string = (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ?? "";
  if (hostUri) {
    const apiHost = expoHostToApiHost(hostUri);
    if (apiHost.includes("picard.replit.dev")) return `https://${apiHost}`;
  }

  return "";
}

/** Kept for backwards-compat; evaluates lazily so Constants is ready */
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
