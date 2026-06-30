import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { adminUsers } from "@/data/mock";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — PsyConnect" }] }),
  component: Users,
});

function Users() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const filtered = adminUsers.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q));
  return (
    <div>
      <PageHeader title={t("admin.users")} action={
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="rounded-full border border-input bg-card px-4 py-2 text-sm" />
      } />
      <Card className="!p-0">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-start">Name</th>
              <th className="px-4 py-3 text-start hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-start">Role</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-start hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3"><Pill tone={u.status === "active" ? "success" : "danger"}>{u.status}</Pill></td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{new Date(u.joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
