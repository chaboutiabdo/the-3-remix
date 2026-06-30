import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { patients } from "@/data/mock";

export const Route = createFileRoute("/psychologist/patients")({
  head: () => ({ meta: [{ title: "Patients — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("psy.patients")} subtitle={`${patients.length} active`} />
        <Card className="!p-0">
          <table className="w-full text-sm">
            <thead className="text-start text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start hidden md:table-cell">City</th>
                <th className="px-4 py-3 text-start hidden md:table-cell">Sessions</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.city}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{p.totalSessions}</td>
                  <td className="px-4 py-3"><Pill tone={p.status === "active" ? "success" : "warning"}>{p.status}</Pill></td>
                  <td className="px-4 py-3 text-end"><Link to="/psychologist/patients/$id" params={{ id: p.id }} className="text-primary hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  },
});
