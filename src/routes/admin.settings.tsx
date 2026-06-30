import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("common.settings")} />
        <div className="grid gap-4 md:grid-cols-2">
          <Card><h3 className="font-semibold">Platform</h3><p className="mt-2 text-sm text-muted-foreground">Manage platform-wide configuration and branding.</p></Card>
          <Card><h3 className="font-semibold">Compliance</h3><p className="mt-2 text-sm text-muted-foreground">Data retention, audit logs and export.</p></Card>
        </div>
      </div>
    );
  },
});
