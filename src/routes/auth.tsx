import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLang } from "@/lib/lang";
import { Globe } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { t } = useTranslation();
  const { toggle, lang } = useLang();
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-primary via-primary/80 to-accent p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">P</div>
          {t("brand")}
        </Link>
        <div>
          <div className="text-3xl font-semibold leading-tight">
            {t("landing.heroTitle")}
          </div>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/80">{t("landing.heroSub")}</p>
        </div>
        <div className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} {t("brand")}</div>
      </div>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold md:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">P</div>
            {t("brand")}
          </Link>
          <button
            onClick={toggle}
            className="ms-auto flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "العربية" : "English"}
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
