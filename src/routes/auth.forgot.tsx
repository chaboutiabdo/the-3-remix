import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Reset password — PsyConnect" }] }),
  component: Forgot,
});

function Forgot() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.forgotTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("auth.forgotSub")}</p>
      {sent ? (
        <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          Check your inbox for a reset link.
        </div>
      ) : (
        <label className="mt-6 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.email")}</span>
          <input type="email" required className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
        </label>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {t("auth.sendLink")}
      </button>
      <div className="mt-4 text-center text-xs">
        <Link to="/auth/login" className="text-primary hover:underline">{t("common.back")}</Link>
      </div>
    </form>
  );
}
