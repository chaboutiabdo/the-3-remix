import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";

export const Route = createFileRoute("/patient/settings")({
  head: () => ({ meta: [{ title: "Settings — PsyConnect" }] }),
  component: Settings,
});

function Settings() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("common.settings")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Notifications</h3>
          {["Email reminders", "SMS reminders", "Marketing updates"].map((l) => (
            <label key={l} className="mt-3 flex items-center gap-3 text-sm">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" /> {l}
            </label>
          ))}
        </Card>
        <Card>
          <h3 className="font-semibold">Security</h3>
          <Link to="/auth/reset" className="mt-3 inline-block text-sm text-primary hover:underline">Change password</Link>
          <div className="mt-3 text-sm text-muted-foreground">Two-factor authentication: off</div>
        </Card>
      </div>
    </div>
  );
}
