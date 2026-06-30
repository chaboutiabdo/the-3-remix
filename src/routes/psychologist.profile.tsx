import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/psychologist/profile")({
  head: () => ({ meta: [{ title: "Profile — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    const { session } = useAuth();
    return (
      <div>
        <PageHeader title={t("common.profile")} />
        <Card>
          <form className="grid gap-4 md:grid-cols-2">
            <Field label={t("auth.name")} defaultValue={session?.name ?? ""} />
            <Field label={t("auth.email")} defaultValue={session?.email ?? ""} />
            <Field label={t("onboarding.license")} defaultValue="PSY-2019-1834" />
            <Field label={t("onboarding.specialty")} defaultValue="CBT, Anxiety" />
            <Field label="City" defaultValue="Algiers" />
            <Field label={t("onboarding.years")} defaultValue="11" />
            <div className="md:col-span-2">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Bio</span>
              <textarea rows={4} defaultValue="Clinical psychologist working with adults on anxiety, burnout and relationship stress." className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
            </div>
            <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:col-span-2 md:w-fit">{t("common.save")}</button>
          </form>
        </Card>
      </div>
    );
  },
});

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
    </label>
  );
}
