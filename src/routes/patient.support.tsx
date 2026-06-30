import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy, MessageCircle, Plus, Send } from "lucide-react";
import { PageHeader, Card, EmptyState, Pill } from "@/components/page-bits";
import { Button } from "@/components/ui/button";
import { SupportFormDialog } from "@/components/support-form";
import { useAuth } from "@/lib/auth";
import {
  addMessage,
  updateTicket,
  useTickets,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/support")({
  head: () => ({ meta: [{ title: "My Support Requests — PsyConnect" }] }),
  component: PatientSupport,
});

function priorityTone(p: TicketPriority): "success" | "warning" | "danger" {
  return p === "low" ? "success" : p === "medium" ? "warning" : "danger";
}

function statusTone(s: TicketStatus): "default" | "success" | "warning" | "danger" {
  if (s === "resolved" || s === "closed") return "success";
  if (s === "in_progress" || s === "waiting_patient") return "warning";
  return "default";
}

function PatientSupport() {
  const { session } = useAuth();
  const all = useTickets();
  const mine = useMemo(
    () => all.filter((t) => t.patientEmail === session?.email),
    [all, session?.email],
  );
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const active = mine.find((t) => t.id === activeId) ?? mine[0];

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !reply.trim()) return;
    addMessage(active.id, {
      author: "patient",
      authorName: session?.name ?? "Patient",
      body: reply.trim(),
    });
    if (active.status === "waiting_patient") updateTicket(active.id, { status: "in_progress" });
    setReply("");
  }

  return (
    <div>
      <PageHeader
        title="My Support Requests"
        subtitle="Track your tickets and chat with our team."
        action={
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New request
          </Button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          title="No support requests yet"
          body="If something isn't working, our team is here to help."
          action={
            <Button onClick={() => setOpen(true)} className="gap-2">
              <LifeBuoy className="h-4 w-4" /> Contact support
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {mine.map((t) => {
                const isActive = active?.id === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setActiveId(t.id)}
                      className={cn(
                        "flex w-full flex-col gap-1 px-4 py-3 text-start hover:bg-accent",
                        isActive && "bg-accent",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{t.subject}</span>
                        <Pill tone={priorityTone(t.priority)}>{PRIORITY_LABEL[t.priority]}</Pill>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{t.id}</span>
                        <Pill tone={statusTone(t.status)}>{STATUS_LABEL[t.status]}</Pill>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          {active && (
            <Card className="flex h-[70vh] flex-col">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
                <div>
                  <div className="text-base font-semibold">{active.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {active.id} · opened {new Date(active.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Pill tone={priorityTone(active.priority)}>{PRIORITY_LABEL[active.priority]} priority</Pill>
                  <Pill tone={statusTone(active.status)}>{STATUS_LABEL[active.status]}</Pill>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {active.messages
                  .filter((m) => !m.internal)
                  .map((m) => {
                    const mine = m.author === "patient";
                    return (
                      <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                            mine
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-soft text-foreground",
                          )}
                        >
                          <div className="text-[11px] font-medium opacity-70">{m.authorName}</div>
                          <div className="mt-0.5 whitespace-pre-wrap">{m.body}</div>
                          <div className="mt-1 text-[10px] opacity-60">
                            {new Date(m.at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {active.status === "closed" ? (
                <div className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
                  This ticket is closed.{" "}
                  <button
                    onClick={() => {
                      updateTicket(active.id, { status: "open" });
                      toast.success("Ticket reopened");
                    }}
                    className="text-primary hover:underline"
                  >
                    Reopen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReply} className="flex gap-2 border-t border-border pt-3">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply to support…"
                    className="flex-1 rounded-full border border-input bg-card px-4 py-2 text-sm"
                  />
                  <button
                    className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                    disabled={!reply.trim()}
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateTicket(active.id, { status: "closed" });
                      toast.success("Ticket closed");
                    }}
                    className="rounded-full border border-input bg-card px-3 py-2 text-xs hover:bg-accent"
                    title="Close ticket"
                  >
                    Close
                  </button>
                </form>
              )}
            </Card>
          )}
        </div>
      )}

      <div className="mt-6 text-xs text-muted-foreground">
        <Link to="/patient/messages" className="inline-flex items-center gap-1 hover:underline">
          <MessageCircle className="h-3 w-3" /> Back to messages
        </Link>
      </div>

      <SupportFormDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(id) => setActiveId(id)}
      />
    </div>
  );
}
