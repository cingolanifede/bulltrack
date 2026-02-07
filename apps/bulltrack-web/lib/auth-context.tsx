"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getBaseUrl } from "@/lib/api-client";
import { isMockDataEnabled } from "@/lib/mock-data";

const MOCK_USER = { id: "mock-user", email: "demo@bulltrack.com" };

export type AuthUser = { id: string; email: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const useMock = isMockDataEnabled();

  const checkAuth = useCallback(async () => {
    if (useMock) {
      setUser(MOCK_USER);
      setIsReady(true);
      return;
    }
    try {
      const res = await fetch(`${getBaseUrl()}/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsReady(true);
    }
  }, [useMock]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("bulltrack-unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("bulltrack-unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (useMock) {
        setUser({ ...MOCK_USER, email: email || MOCK_USER.email });
        return;
      }
      const res = await fetch(`${getBaseUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Invalid credentials");
      }
      const data = await res.json();
      setUser(data.user ?? null);
    },
    [useMock]
  );

  const logout = useCallback(async () => {
    if (!useMock) {
      try {
        await fetch(`${getBaseUrl()}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch {}
    }
    setUser(null);
  }, [useMock]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      login,
      logout,
    }),
    [user, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
