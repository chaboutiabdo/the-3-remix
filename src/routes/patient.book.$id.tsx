import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { psychologists } from "@/data/mock";

export const Route = createFileRoute("/patient/book/$id")({
  loader: ({ params }) => {
    const p = psychologists.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Book — ${loaderData?.name ?? ""}` }] }),
  component: Book,
  notFoundComponent: () => <div className="p-8 text-sm">Not found.</div>,
});

function Book() {
  const p = Route.useLoaderData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [date, setDate] = useState(0); // day offset
  const [time, setTime] = useState("14:00");

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div>
      <Link to="/patient/psychologist/$id" params={{ id: p.id }} className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
      <h1 className="mt-4 text-2xl font-semibold">{t("patient.book.title", { name: p.name })}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-2 text-sm font-medium">{t("patient.book.pickDate")}</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d, i) => (
              <button key={i} onClick={() => setDate(i)} className={`flex min-w-[72px] flex-col rounded-xl border px-3 py-2 text-center text-xs ${date === i ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"}`}>
                <span className="text-muted-foreground">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                <span className="mt-1 text-lg font-semibold">{d.getDate()}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 mb-2 text-sm font-medium">{t("patient.book.pickTime")}</div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {times.map((tm) => (
              <button key={tm} onClick={() => setTime(tm)} className={`rounded-lg border px-3 py-2 text-sm ${time === tm ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"}`}>
                {tm}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">{t("patient.book.summary")}</div>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{p.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{days[date].toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{time}</span></div>
            <div className="mt-3 flex justify-between border-t border-border pt-3"><span>{t("patient.book.fee")}</span><span className="font-semibold">{p.fee.toLocaleString()} DZD</span></div>
          </div>
          <button
            onClick={() => navigate({ to: "/patient/appointments" })}
            className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("patient.book.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
