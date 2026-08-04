"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const handleSetUser = useCallback((newUser: User | null) => {
    if (newUser) {
      const normalizedRole = typeof newUser.role === "string" ? newUser.role.toUpperCase() : "CUSTOMER";
      setUser({ ...newUser, role: normalizedRole as any });
    } else {
      setUser(null);
    }
  }, []);

  const fetchProfile = useCallback(async (signal: AbortSignal) => {
    try {
      const res = await fetch("/api/auth/profile", { signal });
      const data = (await res.json()) as { success: boolean; data: User | null };
      if (data.success && data.data) {
        const rawUser = data.data;
        const normalizedRole = typeof rawUser.role === "string" ? rawUser.role.toUpperCase() : "CUSTOMER";
        setUser({ ...rawUser, role: normalizedRole as any });
      } else {
        setUser(null);
      }
    } catch {
      if (!signal.aborted) {
        setUser(null);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (initialUser) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProfile(controller.signal);
    return () => { controller.abort(); };
  }, [initialUser, fetchProfile]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
