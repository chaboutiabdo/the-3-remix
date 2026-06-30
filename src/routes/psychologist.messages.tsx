import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";
import { messages } from "@/data/mock";

export const Route = createFileRoute("/psychologist/messages")({
  head: () => ({ meta: [{ title: "Messages — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("psy.messages")} />
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {messages.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary font-semibold">{m.from.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{m.from}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.preview}</div>
                </div>
                <div className="text-xs text-muted-foreground">{m.time}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  },
});
