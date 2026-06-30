import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — PsyConnect" }] }),
  component: Profile,
});

function Profile() {
  const { t } = useTranslation();
  const { session } = useAuth();
  return (
    <div>
      <PageHeader title={t("common.profile")} />
      <Card>
        <form className="grid gap-4 md:grid-cols-2">
          <Field label={t("auth.name")} defaultValue={session?.name ?? ""} />
          <Field label={t("auth.email")} defaultValue={session?.email ?? ""} />
          <Field label="City" defaultValue="Algiers" />
          <Field label="Phone" defaultValue="+213 555 000 000" />
          <div className="md:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">About me</span>
            <textarea rows={4} defaultValue="A few notes about myself…" className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
          </div>
          <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:col-span-2 md:w-fit">{t("common.save")}</button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
    </label>
  );
}
