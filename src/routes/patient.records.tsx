import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";
import { PageHeader, Card } from "@/components/page-bits";

export const Route = createFileRoute("/patient/records")({
  head: () => ({ meta: [{ title: "Records — PsyConnect" }] }),
  component: Records,
});

const records = [
  { id: "r1", title: "Intake assessment", date: "2025-04-12", size: "212 KB" },
  { id: "r2", title: "Session summary — March", date: "2025-03-30", size: "98 KB" },
  { id: "r3", title: "Mood journal export", date: "2025-03-15", size: "44 KB" },
];

function Records() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("patient.records")} subtitle="Your private clinical records." />
      <Card>
        <ul className="divide-y divide-border">
          {records.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
