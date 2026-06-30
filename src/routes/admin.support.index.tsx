import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  LifeBuoy,
  Loader2,
  Search,
} from "lucide-react";
import { PageHeader, Card, StatCard, Pill } from "@/components/page-bits";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  useTickets,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-store";

export const Route = createFileRoute("/admin/support/")({
  head: () => ({ meta: [{ title: "Support Center — PsyConnect" }] }),
  component: AdminSupport,
});

function priorityTone(p: TicketPriority): "success" | "warning" | "danger" {
  return p === "low" ? "success" : p === "medium" ? "warning" : "danger";
}
function statusTone(s: TicketStatus): "default" | "success" | "warning" | "danger" {
  if (s === "resolved" || s === "closed") return "success";
  if (s === "in_progress" || s === "waiting_patient") return "warning";
  return "default";
}

function AdminSupport() {
  const tickets = useTickets();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<TicketPriority | "all">("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "new" || t.status === "open").length,
      progress: tickets.filter((t) => t.status === "in_progress" || t.status === "waiting_patient")
        .length,
      closed: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
      high: tickets.filter((t) => t.priority === "high").length,
    };
  }, [tickets]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !t.patientName.toLowerCase().includes(s) &&
          !t.patientEmail.toLowerCase().includes(s) &&
          !t.subject.toLowerCase().includes(s) &&
          !t.id.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [tickets, q, status, priority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <div>
      <PageHeader
        title="Support Center"
        subtitle="Tickets submitted by patients across the platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={<Inbox className="h-4 w-4" />} />
        <StatCard label="Open" value={stats.open} icon={<LifeBuoy className="h-4 w-4" />} />
        <StatCard label="In progress" value={stats.progress} icon={<Loader2 className="h-4 w-4" />} />
        <StatCard label="Closed" value={stats.closed} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="High priority" value={stats.high} icon={<AlertCircle className="h-4 w-4" />} />
      </div>

      <Card className="mt-6 !p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search ticket, patient, subject…"
              className="w-full rounded-full border border-input bg-card ps-9 pe-4 py-2 text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as TicketStatus | "all");
              setPage(1);
            }}
            className="rounded-full border border-input bg-card px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as TicketPriority | "all");
              setPage(1);
            }}
            className="rounded-full border border-input bg-card px-3 py-2 text-sm"
          >
            <option value="all">All priorities</option>
            {Object.entries(PRIORITY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {pageRows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No tickets match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-start">Ticket</th>
                  <th className="px-4 py-3 text-start">Patient</th>
                  <th className="px-4 py-3 text-start">Subject</th>
                  <th className="px-4 py-3 text-start">Priority</th>
                  <th className="px-4 py-3 text-start">Status</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">Created</th>
                  <th className="px-4 py-3 text-start hidden lg:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-accent/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        to="/admin/support/$id"
                        params={{ id: t.id }}
                        className="text-primary hover:underline"
                      >
                        {t.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.patientName}</div>
                      <div className="text-xs text-muted-foreground">{t.patientEmail}</div>
                    </td>
                    <td className="px-4 py-3 max-w-[260px] truncate">{t.subject}</td>
                    <td className="px-4 py-3">
                      <Pill tone={priorityTone(t.priority)}>{PRIORITY_LABEL[t.priority]}</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={statusTone(t.status)}>{STATUS_LABEL[t.status]}</Pill>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(t.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > perPage && (
          <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
            <span>
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-input bg-card px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-input bg-card px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
