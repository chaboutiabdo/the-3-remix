import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";
import { sessionNotes } from "@/data/mock";

export const Route = createFileRoute("/psychologist/notes")({
  head: () => ({ meta: [{ title: "Session notes — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("psy.notes")} />
        <div className="space-y-3">
          {sessionNotes.map((n) => (
            <Card key={n.id}>
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">{n.patient}</div>
                <div className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{n.summary}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  },
});
