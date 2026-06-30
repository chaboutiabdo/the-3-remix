import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader, Card } from "@/components/page-bits";

export const Route = createFileRoute("/psychologist/availability")({
  head: () => ({ meta: [{ title: "Availability — PsyConnect" }] }),
  component: Avail,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function Avail() {
  const { t } = useTranslation();
  const [grid, setGrid] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    days.forEach((d) => slots.forEach((s) => { init[`${d}-${s}`] = !["Sat", "Sun"].includes(d) && ["09:00", "10:00", "14:00", "15:00"].includes(s); }));
    return init;
  });
  return (
    <div>
      <PageHeader title={t("psy.availability")} subtitle="Toggle slots you can offer each week." />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr><th></th>{days.map((d) => <th key={d} className="px-2 py-2 text-xs uppercase text-muted-foreground">{d}</th>)}</tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s}>
                <td className="px-2 py-2 text-xs text-muted-foreground">{s}</td>
                {days.map((d) => {
                  const k = `${d}-${s}`;
                  const on = grid[k];
                  return (
                    <td key={k} className="p-1 text-center">
                      <button onClick={() => setGrid({ ...grid, [k]: !on })} className={`h-9 w-full rounded-lg border ${on ? "border-primary bg-primary/20 text-primary" : "border-border bg-card hover:bg-accent"}`}>
                        {on ? "●" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
