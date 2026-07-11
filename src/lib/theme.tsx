import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "psyconnect-theme";

function readStored(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "dark";
}

function systemPref(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const resolved = t === "system" ? systemPref() : t;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // hydrate from storage
  useEffect(() => {
    const t = readStored();
    setThemeState(t);
    applyTheme(t);
    setResolved(t === "system" ? systemPref() : t);
  }, []);

  // react to system changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      applyTheme("system");
      setResolved(systemPref());
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { window.localStorage.setItem(STORAGE_KEY, t); } catch {}
    applyTheme(t);
    setResolved(t === "system" ? systemPref() : t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  const value = useMemo(() => ({ theme, resolvedTheme: resolved, setTheme, toggle }), [theme, resolved, setTheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Inline blocking script content: runs before React hydrates to set the
// correct theme class and body background, preventing a wrong-theme flash.
export const themeInitScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark'||s==='system')?s:'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';r.style.backgroundColor=d?'#0B0F14':'#F8FAFC';}catch(e){}})();`;
