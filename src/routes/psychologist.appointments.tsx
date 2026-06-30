import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { appointments } from "@/data/mock";
import { Video } from "lucide-react";

export const Route = createFileRoute("/psychologist/appointments")({
  head: () => ({ meta: [{ title: "Appointments — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("psy.appointments")} />
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {appointments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-semibold">{a.patientName?.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.patientName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>
                </div>
                <Pill tone={a.status === "upcoming" ? "success" : "default"}>{a.status}</Pill>
                {a.status === "upcoming" && (
                  <Link to="/patient/session/$id" params={{ id: a.id }} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Video className="h-3.5 w-3.5" /> {t("psy.join")}</Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  },
});
