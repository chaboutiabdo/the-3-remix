import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, Card, Pill } from "@/components/page-bits";
import { contentItems } from "@/data/mock";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Content — PsyConnect" }] }),
  component: () => {
    const { t } = useTranslation();
    return (
      <div>
        <PageHeader title={t("admin.content")} action={<button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">New article</button>} />
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {contentItems.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.type} · {new Date(c.updated).toLocaleDateString()}</div>
                </div>
                <Pill tone={c.published ? "success" : "warning"}>{c.published ? "Published" : "Draft"}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  },
});
