import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/welcome")({
  component: () => {
    const { t } = useTranslation();
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">{t("onboarding.welcomeTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.welcomeSub")}</p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>✓ Complete your credentials</li>
          <li>✓ Upload identification & license</li>
          <li>✓ Review & submit</li>
        </ul>
        <Link to="/onboarding/credentials" className="mt-8 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{t("onboarding.begin")}</Link>
      </div>
    );
  },
});
