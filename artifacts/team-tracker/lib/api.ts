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
  // 1. EXPO_PUBLIC_API_URL — full https:// URL written by dev script to .env.local.
  //    Now set to the expo domain (https://UUID.expo.picard.replit.dev) because
  //    the dev-proxy.js intercepts /api on that port and forwards to the API server.
  //    The expo domain is publicly accessible; the picard domain requires Replit auth.
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) return apiUrl;

  // 2. Runtime: derive from Constants.linkingUri which Expo Go always sets.
  //    Format: "exp://UUID.expo.picard.replit.dev:PORT/--/"
  //    Keep the expo hostname as-is — the proxy runs there.
  try {
    const linking = Constants.linkingUri ?? "";
    if (linking) {
      const withoutScheme = linking.replace(/^exp?:\/\//, "");
      const host = withoutScheme.split(":")[0].split("/")[0];
      if (host.includes(".expo.picard.replit.dev")) {
        return `https://${host}`;
      }
    }
  } catch {}

  // 3. Web fallback: use window.location.origin (same host that served the web bundle).
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
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
  reply: string | null;
  repliedAt: string | null;
  managerName: string;
  managerId: number;
}

export interface ChatMessage {
  id: number;
  message: string;
  sentAt: string;
  readAt: string | null;
  reply: string | null;
  repliedAt: string | null;
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

export async function replyToAssignment(token: string, id: number, reply: string): Promise<void> {
  await apiFetch(`/api/team/assignments/${id}/reply`, token, {
    method: "PATCH",
    body:   JSON.stringify({ reply }),
  });
}

export async function savePushToken(token: string, pushToken: string): Promise<void> {
  await apiFetch("/api/team/push-token", token, {
    method: "POST",
    body:   JSON.stringify({ pushToken }),
  });
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
