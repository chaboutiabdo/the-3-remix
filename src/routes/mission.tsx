import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/public-shell";
import { HeartPulse, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/mission")({
  head: () => ({ meta: [{ title: "Our mission — PsyConnect" }] }),
  component: Mission,
});

function Mission() {
  const { t } = useTranslation();
  const items = [
    { icon: HeartPulse, title: "Accessible care", body: "Remove geographic and social barriers to therapy." },
    { icon: ShieldCheck, title: "Trust & safety", body: "Every clinician is personally verified by our team." },
    { icon: Users, title: "Cultural fit", body: "Care that respects Algerian families, languages and faith." },
  ];
  return (
    <PublicShell title={t("public.missionTitle")} subtitle={t("public.missionSub")}>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </PublicShell>
  );
}
