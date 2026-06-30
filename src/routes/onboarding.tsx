import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/lang";

const steps = [
  { path: "/onboarding/welcome", n: 1 },
  { path: "/onboarding/credentials", n: 2 },
  { path: "/onboarding/documents", n: 3 },
  { path: "/onboarding/review", n: 4 },
];

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const { t } = useTranslation();
  const { toggle, lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = steps.find((s) => pathname === s.path)?.n ?? 1;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">P</div>
            {t("brand")}
          </Link>
          <div className="ms-auto text-xs text-muted-foreground">{t("onboarding.step", { n: current })}</div>
          <button onClick={toggle} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent">
            <Globe className="h-3.5 w-3.5" />{lang === "en" ? "العربية" : "English"}
          </button>
        </div>
        <div className="mx-auto h-1 max-w-3xl bg-border">
          <div className="h-full bg-primary transition-all" style={{ width: `${(current / 4) * 100}%` }} />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
