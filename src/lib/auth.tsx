import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "patient" | "psychologist" | "admin";
export type Session = { role: Role; name: string; email: string } | null;

type Ctx = {
  session: Session;
  signIn: (s: NonNullable<Session>) => void;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const KEY = "psy.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const signIn = (s: NonNullable<Session>) => {
    setSession(s);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
  };
  const signOut = () => {
    setSession(null);
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  };

  return <AuthCtx.Provider value={{ session, signIn, signOut }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function roleHome(role: Role): string {
  if (role === "patient") return "/patient";
  if (role === "psychologist") return "/psychologist";
  return "/admin";
}
