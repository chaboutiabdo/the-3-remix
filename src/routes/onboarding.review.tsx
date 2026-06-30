import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/review")({
  component: () => {
    const { t } = useTranslation();
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">{t("onboarding.reviewTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.reviewSub")}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">{t("onboarding.license")}</dt><dd>PSY-2019-1834</dd></div>
          <div><dt className="text-muted-foreground">{t("onboarding.specialty")}</dt><dd>Anxiety & depression</dd></div>
          <div><dt className="text-muted-foreground">{t("onboarding.years")}</dt><dd>11</dd></div>
          <div><dt className="text-muted-foreground">City</dt><dd>Algiers</dd></div>
        </dl>
        <div className="mt-6 flex justify-between">
          <Link to="/onboarding/documents" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
          <Link to="/onboarding/pending" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{t("common.submit")}</Link>
        </div>
      </div>
    );
  },
});
