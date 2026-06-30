import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Lock, MessageSquareReply, Send } from "lucide-react";

import { PageHeader, Card, Pill } from "@/components/page-bits";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  addMessage,
  updateTicket,
  useTicket,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/support/$id")({
  head: ({ params }) => ({ meta: [{ title: `Ticket ${params.id} — PsyConnect` }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    reply: s.reply === 1 || s.reply === "1" ? 1 : undefined,
  }),
  component: TicketDetail,
});


function priorityTone(p: TicketPriority): "success" | "warning" | "danger" {
  return p === "low" ? "success" : p === "medium" ? "warning" : "danger";
}
function statusTone(s: TicketStatus): "default" | "success" | "warning" | "danger" {
  if (s === "resolved" || s === "closed") return "success";
  if (s === "in_progress" || s === "waiting_patient") return "warning";
  return "default";
}

function TicketDetail() {
  const { id } = useParams({ from: "/admin/support/$id" });
  const { reply: replyFlag } = useSearch({ from: "/admin/support/$id" });
  const ticket = useTicket(id);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyFlag && replyRef.current) {
      replyRef.current.focus();
      replyRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [replyFlag]);

  if (!ticket) {

    return (
      <div>
        <PageHeader title="Ticket not found" subtitle={`No ticket with id ${id}.`} />
        <Link to="/admin/support" className="text-sm text-primary hover:underline">
          ← Back to Support Center
        </Link>
      </div>
    );
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !ticket) return;
    addMessage(ticket.id, {
      author: "admin",
      authorName: "Support",
      body: reply.trim(),
      internal,
    });
    if (!internal && ticket.status === "new") {
      updateTicket(ticket.id, { status: "in_progress" });
    }
    setReply("");
    toast.success(internal ? "Internal note added" : "Reply sent to patient");
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/admin/support"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Support Center
        </Link>
      </div>

      <PageHeader
        title={ticket.subject}
        subtitle={`${ticket.id} · opened ${new Date(ticket.createdAt).toLocaleString()}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Pill tone={priorityTone(ticket.priority)}>{PRIORITY_LABEL[ticket.priority]} priority</Pill>
            <Pill tone={statusTone(ticket.status)}>{STATUS_LABEL[ticket.status]}</Pill>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Conversation
            </h2>
            <div className="space-y-3">
              {ticket.messages.map((m) => {
                if (m.internal) {
                  return (
                    <div key={m.id} className="rounded-2xl border border-warning/40 bg-warning/10 p-3 text-sm">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-warning-foreground">
                        <Lock className="h-3 w-3" /> Internal note · {m.authorName}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">{m.body}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {new Date(m.at).toLocaleString()}
                      </div>
                    </div>
                  );
                }
                const fromAdmin = m.author === "admin";
                return (
                  <div key={m.id} className={cn("flex", fromAdmin ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                        fromAdmin
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

            <form onSubmit={send} className="mt-4 space-y-2 rounded-2xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageSquareReply className="h-4 w-4 text-primary" />
                {internal ? "Add internal note" : "Respond to patient"}
              </div>
              <textarea
                ref={replyRef}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder={internal ? "Internal note for the team…" : "Write your response to the patient…"}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={internal}
                    onChange={(e) => setInternal(e.target.checked)}
                  />
                  Internal note (only admins can see)
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      updateTicket(ticket.id, { status: "waiting_patient" });
                      toast.success("Marked as waiting for patient");
                    }}
                  >
                    Request info
                  </Button>
                  <Button type="submit" disabled={!reply.trim()} className="gap-2">
                    <Send className="h-4 w-4" /> {internal ? "Add note" : "Send reply"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {ticket.attachmentName && (
            <Card>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Attachments
              </h2>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-3 py-2 text-sm">
                <FileText className="h-4 w-4" />
                {ticket.attachmentName}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Patient
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Full name</dt>
                <dd className="font-medium">{ticket.patientName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd>{ticket.patientEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd>{ticket.patientPhone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs">{ticket.patientId}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Appointments</dt>
                <dd>12</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Consultations</dt>
                <dd>9</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Account</dt>
                <dd><Pill tone="success">Active</Pill></dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => {
                    updateTicket(ticket.id, { status: e.target.value as TicketStatus });
                    toast.success("Status updated");
                  }}
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                >
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => {
                    updateTicket(ticket.id, { priority: e.target.value as TicketPriority });
                    toast.success("Priority updated");
                  }}
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                >
                  {Object.entries(PRIORITY_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    updateTicket(ticket.id, { status: "resolved" });
                    toast.success("Marked as resolved");
                  }}
                >
                  Mark resolved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateTicket(ticket.id, { status: "closed" });
                    toast.success("Ticket closed");
                  }}
                >
                  Close ticket
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
