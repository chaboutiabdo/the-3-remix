import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/logout")({
  head: () => ({ meta: [{ title: "Logged out — PsyConnect" }] }),
  component: Logout,
});

function Logout() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    signOut();
    const id = setTimeout(() => navigate({ to: "/" }), 1500);
    return () => clearTimeout(id);
  }, [signOut, navigate]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.logoutTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("auth.logoutSub")}</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        {t("nav.home")}
      </Link>
    </div>
  );
}
