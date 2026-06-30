import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/page-bits";
import { patients, sessionNotes } from "@/data/mock";

export const Route = createFileRoute("/psychologist/patients/$id")({
  loader: ({ params }) => {
    const p = patients.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Patient"} — PsyConnect` }] }),
  component: PatientDetail,
  notFoundComponent: () => <div className="p-8 text-sm">Not found.</div>,
});

function PatientDetail() {
  const p = Route.useLoaderData();
  const { t } = useTranslation();
  const notes = sessionNotes.filter((n) => n.patient.toLowerCase().includes(p.name.split(" ")[0].toLowerCase()));
  return (
    <div>
      <Link to="/psychologist/patients" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <img src={p.avatar} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.age} · {p.city}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-muted-foreground">Sessions</div>{p.totalSessions}</div>
            <div><div className="text-xs text-muted-foreground">Status</div>{p.status}</div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("psy.notes")}</h2>
            <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Add note</button>
          </div>
          <ul className="mt-4 space-y-3">
            {notes.length === 0 ? (
              <li className="text-sm text-muted-foreground">No notes yet.</li>
            ) : notes.map((n) => (
              <li key={n.id} className="rounded-xl border border-border p-3">
                <div className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</div>
                <div className="mt-1 text-sm">{n.summary}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
