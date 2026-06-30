import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Video } from "lucide-react";
import { PageHeader, Pill } from "@/components/page-bits";
import { appointments, psychologists } from "@/data/mock";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({ meta: [{ title: "Appointments — PsyConnect" }] }),
  component: Appts,
});

function Appts() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("patient.appointments")} />
      <div className="space-y-3">
        {appointments.map((a) => {
          const psy = psychologists.find((p) => p.id === a.withId);
          return (
            <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              {psy && <img src={psy.avatar} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />}
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{a.with}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} · {a.durationMin} min</div>
              </div>
              <Pill tone={a.status === "upcoming" ? "success" : a.status === "completed" ? "default" : "danger"}>{t(`common.${a.status === "upcoming" ? "upcoming" : "past"}`)}</Pill>
              {a.status === "upcoming" && (
                <Link to="/patient/session/$id" params={{ id: a.id }} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                  <Video className="h-3.5 w-3.5" /> {t("patient.joinVideo")}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
