import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/credentials")({
  component: () => {
    const { t } = useTranslation();
    return (
      <form className="rounded-2xl border border-border bg-card p-8" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-2xl font-semibold">{t("onboarding.credentialsTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.credentialsSub")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[t("onboarding.license"), t("onboarding.specialty"), t("onboarding.years"), "City"].map((l) => (
            <label key={l} className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">{l}</span>
              <input className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Link to="/onboarding/welcome" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
          <Link to="/onboarding/documents" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{t("common.continue")}</Link>
        </div>
      </form>
    );
  },
});
