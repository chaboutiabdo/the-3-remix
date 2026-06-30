import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PageHeader, Card } from "@/components/page-bits";
import { messages } from "@/data/mock";
import { Send } from "lucide-react";

export const Route = createFileRoute("/patient/messages")({
  head: () => ({ meta: [{ title: "Messages — PsyConnect" }] }),
  component: Msgs,
});

function Msgs() {
  const { t } = useTranslation();
  const [active, setActive] = useState(messages[0].id);
  const [text, setText] = useState("");
  return (
    <div>
      <PageHeader title={t("patient.messages")} />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {messages.map((m) => (
              <li key={m.id}>
                <button onClick={() => setActive(m.id)} className={`flex w-full flex-col items-start px-4 py-3 text-start hover:bg-accent ${active === m.id ? "bg-accent" : ""}`}>
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{m.from}</span>
                    <span className="text-[11px] text-muted-foreground">{m.time}</span>
                  </div>
                  <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{m.preview}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="flex h-[60vh] flex-col">
          <div className="border-b border-border pb-3 text-sm font-semibold">{messages.find((m) => m.id === active)?.from}</div>
          <div className="flex-1 space-y-2 overflow-y-auto py-4 text-sm">
            <div className="max-w-[80%] rounded-2xl bg-surface-soft px-3 py-2">Hi, looking forward to our session.</div>
            <div className="ms-auto max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground">See you at 14:00 — thank you!</div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setText(""); }}
            className="mt-3 flex gap-2 border-t border-border pt-3"
          >
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-full border border-input bg-card px-4 py-2 text-sm" />
            <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
          </form>
        </Card>
      </div>
    </div>
  );
}
