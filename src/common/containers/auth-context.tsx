"use client";

import { createContext, useSyncExternalStore, type ReactNode } from "react";
import type { AuthUser } from "../types/user";
import {
  getServerSnapshot,
  getSnapshot,
  login,
  logout,
  registerStudent,
  subscribe,
  type AuthResult,
  type AuthStatus,
} from "./auth-store";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  registerStudent: (name: string, email: string, password: string) => AuthResult;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value: AuthContextValue = {
    user: snapshot.user,
    status: snapshot.status,
    login,
    logout,
    registerStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
