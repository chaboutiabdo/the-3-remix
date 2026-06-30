import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CalendarDays, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, StatCard, Card } from "@/components/page-bits";
import { adminUsers, reportSeries, verifications } from "@/data/mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin dashboard — PsyConnect" }] }),
  component: AdminDash,
});

function AdminDash() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("admin.dashboard")} subtitle="Platform overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.stats.users")} value={adminUsers.length.toLocaleString()} delta="+12% MoM" icon={<Users className="h-4 w-4" />} />
        <StatCard label={t("admin.stats.psy")} value="48" delta="+3 this week" icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label={t("admin.stats.sessions")} value="940" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label={t("admin.stats.revenue")} value="4.2M" delta="+18%" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Sessions per month</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportSeries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="sessions" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.verification")}</h2>
            <Link to="/admin/verification" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {verifications.slice(0, 4).map((v) => (
              <li key={v.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.specialty}</div>
                </div>
                <Link to="/admin/verification/$id" params={{ id: v.id }} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{t("admin.review")}</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
