import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";

export const Route = createFileRoute("/psychologist/settings")({
  head: () => ({ meta: [{ title: "Settings — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("common.settings")} />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Payouts</h3>
            <div className="mt-3 text-sm text-muted-foreground">Bank account ending •••• 4421</div>
            <button className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">Update</button>
          </Card>
          <Card>
            <h3 className="font-semibold">Security</h3>
            <Link to="/auth/reset" className="mt-3 inline-block text-sm text-primary hover:underline">Change password</Link>
          </Card>
        </div>
      </div>
    );
  },
});
