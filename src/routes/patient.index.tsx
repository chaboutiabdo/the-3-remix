import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CalendarDays, HeartPulse, Smile, Video } from "lucide-react";
import { PageHeader, StatCard, Card, Pill } from "@/components/page-bits";
import { appointments, psychologists } from "@/data/mock";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Patient dashboard — PsyConnect" }] }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const next = upcoming[0];
  const psy = next && psychologists.find((p) => p.id === next.withId);

  return (
    <div>
      <PageHeader
        title={t("patient.welcome", { name: session?.name ?? "friend" })}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        action={
          <Link to="/patient/find" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {t("patient.bookNew")}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={t("patient.stats.sessions")} value="14" delta="+2 this month" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label={t("patient.stats.streak")} value="7 days" delta="Keep going" icon={<HeartPulse className="h-4 w-4" />} />
        <StatCard label={t("patient.stats.mood")} value="7.2 / 10" icon={<Smile className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("patient.nextSession")}</h2>
            <Pill tone="success">{t("common.upcoming")}</Pill>
          </div>
          {next && psy ? (
            <div className="flex flex-wrap items-center gap-4">
              <img src={psy.avatar} alt={psy.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold">{psy.name}</div>
                <div className="text-sm text-muted-foreground">{psy.specialty}</div>
                <div className="mt-1 text-sm">
                  {new Date(next.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </div>
              </div>
              <Link
                to="/patient/session/$id"
                params={{ id: next.id }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Video className="h-4 w-4" /> {t("patient.joinVideo")}
              </Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No upcoming sessions.</div>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">{t("patient.moodLog")}</h2>
          <div className="mt-4 flex gap-2">
            {["😞", "😐", "🙂", "😊", "🥰"].map((e) => (
              <button key={e} className="grid h-12 flex-1 place-items-center rounded-xl border border-border bg-card text-xl hover:bg-accent">
                {e}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("patient.favorites")}</h2>
          <Link to="/patient/find" className="text-sm text-primary hover:underline">{t("common.view")} {t("common.all").toLowerCase()}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {psychologists.slice(0, 3).map((p) => (
            <Link key={p.id} to="/patient/psychologist/$id" params={{ id: p.id }} className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
              <div className="flex gap-3">
                <img src={p.avatar} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.specialty}</div>
                  <div className="mt-1 text-xs">★ {p.rating} · {p.reviews}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
