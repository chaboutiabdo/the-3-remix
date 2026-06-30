import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import i18n, { type Lang } from "@/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  dir: "ltr" | "rtl";
  mounted: boolean;
};
const LangCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "psy.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Lang)) || "en";
    if (saved !== "en") {
      setLangState(saved);
      i18n.changeLanguage(saved);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    i18n.changeLanguage(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  };

  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "en" ? "ar" : "en"),
    dir: lang === "ar" ? "rtl" : "ltr",
    mounted,
  };
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}
