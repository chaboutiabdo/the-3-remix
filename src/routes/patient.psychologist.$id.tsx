import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { psychologists } from "@/data/mock";

export const Route = createFileRoute("/patient/psychologist/$id")({
  loader: ({ params }) => {
    const p = psychologists.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Psychologist"} — PsyConnect` }] }),
  component: Profile,
  notFoundComponent: () => <div className="p-8 text-sm">Not found.</div>,
});

function Profile() {
  const p = Route.useLoaderData();
  const { t } = useTranslation();
  return (
    <div>
      <Link to="/patient/find" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap gap-5">
            <img src={p.avatar} alt={p.name} className="h-24 w-24 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold">{p.name}</h1>
              <div className="text-sm text-muted-foreground">{p.specialty} · {p.city}</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {p.rating} <span className="text-muted-foreground">({p.reviews} reviews)</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{p.languages.join(" · ")}</div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("patient.book.fee")}</div>
          <div className="mt-1 text-2xl font-semibold">{p.fee.toLocaleString()} DZD</div>
          <Link to="/patient/book/$id" params={{ id: p.id }} className="mt-5 block rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {t("patient.bookNew")}
          </Link>
          <Link to="/patient/messages" className="mt-2 block rounded-lg border border-border py-2.5 text-center text-sm font-semibold hover:bg-accent">
            {t("patient.messages")}
          </Link>
        </div>
      </div>
    </div>
  );
}
