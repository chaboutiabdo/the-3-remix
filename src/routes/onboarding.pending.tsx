import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/onboarding/pending")({
  component: () => {
    const { t } = useTranslation();
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div>
        <h1 className="mt-4 text-2xl font-semibold">{t("onboarding.pendingTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.pendingSub")}</p>
        <Link to="/psychologist" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{t("onboarding.goDashboard")}</Link>
      </div>
    );
  },
});
