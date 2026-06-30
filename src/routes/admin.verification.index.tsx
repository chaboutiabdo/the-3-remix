import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { verifications } from "@/data/mock";

export const Route = createFileRoute("/admin/verification/")({
  head: () => ({ meta: [{ title: "Verification queue — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("admin.verification")} subtitle={`${verifications.length} pending`} />
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {verifications.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <img src={v.avatar} alt={v.name} className="h-10 w-10 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.specialty} · {v.documents} docs · submitted {new Date(v.submitted).toLocaleDateString()}</div>
                </div>
                <Pill tone={v.status === "pending" ? "warning" : "default"}>{v.status.replace("_", " ")}</Pill>
                <Link to="/admin/verification/$id" params={{ id: v.id }} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">{t("admin.review")}</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  },
});
