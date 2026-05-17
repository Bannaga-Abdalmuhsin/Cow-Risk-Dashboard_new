import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (name: string, pin: string) => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    const base   = domain ? `https://${domain}` : "";
    const res = await fetch(`${base}/api/team/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, pin }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? "Login failed");
    }
    const data = await res.json() as { user: AuthUser; token: string };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data.user);
    setToken(data.token);
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
