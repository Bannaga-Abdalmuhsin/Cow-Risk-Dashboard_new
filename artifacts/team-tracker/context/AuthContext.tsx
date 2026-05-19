import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { getBaseUrl } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  role: "manager" | "technician";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (name: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null, token: null, loading: true,
  login: async () => {}, logout: async () => {},
});

const STORAGE_KEY = "aces_team_auth";

async function registerPushToken(authToken: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    const finalStatus = existing === "granted"
      ? existing
      : (await Notifications.requestPermissionsAsync()).status;
    if (finalStatus !== "granted") return;

    const { data: pushToken } = await Notifications.getExpoPushTokenAsync();
    if (!pushToken) return;

    await fetch(`${getBaseUrl()}/api/team/push-token`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({ pushToken }),
    });
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as { user: AuthUser; token: string };
          setUser(saved.user);
          setToken(saved.token);
          registerPushToken(saved.token);
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (name: string, pin: string) => {
    const url = `${getBaseUrl()}/api/team/login`;
    let res: Response;
    try {
      res = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, pin }),
      });
    } catch (networkErr) {
      throw new Error(`Network error reaching ${url}: ${String(networkErr)}`);
    }
    const raw = await res.text();
    let body: { user?: AuthUser; token?: string; error?: string };
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      const preview = raw.slice(0, 120).replace(/\s+/g, " ");
      throw new Error(`Non-JSON from ${url} (HTTP ${res.status}): ${preview}`);
    }
    if (!res.ok) {
      throw new Error(body.error ?? `Login failed (HTTP ${res.status})`);
    }
    if (!body.user || !body.token) {
      throw new Error("Login response missing user/token");
    }
    const data = { user: body.user, token: body.token };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data.user);
    setToken(data.token);
    registerPushToken(data.token);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
