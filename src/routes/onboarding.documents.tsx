import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/onboarding/documents")({
  component: () => {
    const { t } = useTranslation();
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">{t("onboarding.documentsTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.documentsSub")}</p>
        <div className="mt-6 grid gap-3">
          {[t("onboarding.uploadId"), t("onboarding.uploadLicense"), t("onboarding.uploadDiploma")].map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface-soft p-4 text-sm hover:border-primary/40">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Upload className="h-4 w-4" /></div>
              <div className="flex-1">{l}</div>
              <input type="file" className="hidden" />
              <span className="text-xs text-primary">Browse</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Link to="/onboarding/credentials" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
          <Link to="/onboarding/review" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{t("common.continue")}</Link>
        </div>
      </div>
    );
  },
});
