import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/auth/reset")({
  head: () => ({ meta: [{ title: "New password — PsyConnect" }] }),
  component: Reset,
});

function Reset() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/auth/login" }); }}>
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.resetTitle")}</h1>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.newPassword")}</span>
          <input type="password" required className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.confirmPassword")}</span>
          <input type="password" required className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
        </label>
      </div>
      <button type="submit" className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        {t("auth.savePassword")}
      </button>
      <div className="mt-4 text-center text-xs">
        <Link to="/auth/login" className="text-primary hover:underline">{t("common.back")}</Link>
      </div>
    </form>
  );
}
