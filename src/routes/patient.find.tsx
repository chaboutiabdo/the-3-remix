import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Star } from "lucide-react";
import { PageHeader } from "@/components/page-bits";
import { psychologists } from "@/data/mock";

export const Route = createFileRoute("/patient/find")({
  head: () => ({ meta: [{ title: "Find a psychologist — PsyConnect" }] }),
  component: Find,
});

function Find() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const cities = Array.from(new Set(psychologists.map((p) => p.city)));
  const list = psychologists.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.specialty.toLowerCase().includes(q.toLowerCase())) &&
      (!city || p.city === city)
  );
  return (
    <div>
      <PageHeader title={t("patient.find")} subtitle={`${list.length} ${t("nav.psychologists").toLowerCase()}`} />
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.search")}
            className="w-full rounded-full border border-input bg-card py-2.5 ps-9 pe-4 text-sm"
          />
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-full border border-input bg-card px-4 py-2.5 text-sm">
          <option value="">{t("common.all")} cities</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} to="/patient/psychologist/$id" params={{ id: p.id }} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md">
            <div className="flex gap-3">
              <img src={p.avatar} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.specialty} · {p.city}</div>
                <div className="mt-1 flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-warning text-warning" /> {p.rating} <span className="text-muted-foreground">({p.reviews})</span></div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.languages.join(" · ")}</span>
              <span className="text-sm font-semibold">{p.fee.toLocaleString()} DZD</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
