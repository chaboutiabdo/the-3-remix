import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CalendarDays, Star, Users, Video } from "lucide-react";
import { PageHeader, StatCard, Card, Pill } from "@/components/page-bits";
import { appointments, patients } from "@/data/mock";

export const Route = createFileRoute("/psychologist/")({
  head: () => ({ meta: [{ title: "Psychologist dashboard — PsyConnect" }] }),
  component: PsyDash,
});

function PsyDash() {
  const { t } = useTranslation();
  const todays = appointments.filter((a) => a.status === "upcoming");
  return (
    <div>
      <PageHeader
        title={t("psy.today")}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        action={
          <Link to="/psychologist/availability" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {t("psy.manageAvail")}
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("psy.stats.today")} value={todays.length} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label={t("psy.stats.week")} value="12" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label={t("psy.stats.patients")} value={patients.filter((p) => p.status === "active").length} icon={<Users className="h-4 w-4" />} />
        <StatCard label={t("psy.stats.rating")} value="4.9" icon={<Star className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">{t("psy.today")}</h2>
          <ul className="mt-4 divide-y divide-border">
            {todays.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-semibold">
                  {a.patientName?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.patientName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {a.durationMin} min</div>
                </div>
                <Pill tone="success">{t("common.upcoming")}</Pill>
                <Link to="/patient/session/$id" params={{ id: a.id }} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                  <Video className="h-3.5 w-3.5" /> {t("psy.join")}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Recent patients</h2>
          <ul className="mt-4 space-y-3">
            {patients.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.totalSessions} sessions</div>
                </div>
                <Link to="/psychologist/patients/$id" params={{ id: p.id }} className="text-xs text-primary hover:underline">View</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
