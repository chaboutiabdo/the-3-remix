import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { appointments } from "@/data/mock";

export const Route = createFileRoute("/admin/appointments")({
  head: () => ({ meta: [{ title: "Appointments — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("admin.appointments")} />
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {appointments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.patientName} → {a.with}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</div>
                </div>
                <Pill tone={a.status === "upcoming" ? "success" : a.status === "completed" ? "default" : "danger"}>{a.status}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  },
});
