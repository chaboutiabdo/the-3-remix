import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth, roleHome, type Role } from "@/lib/auth";
import { FormPageSkeleton } from "@/components/page-states";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — PsyConnect" }] }),
  component: Login,
  pendingComponent: FormPageSkeleton,
});

function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("demo@psyconnect.dz");
  const [name, setName] = useState("Yacine M.");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signIn({ role, email, name });
        navigate({ to: roleHome(role) });
      }}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.loginTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSub")}</p>

      <div className="mt-6 space-y-4">
        <Field label={t("auth.role")}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          >
            <option value="patient">{t("auth.rolePatient")}</option>
            <option value="psychologist">{t("auth.rolePsychologist")}</option>
            <option value="admin">{t("auth.roleAdmin")}</option>
          </select>
        </Field>
        <Field label={t("auth.name")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </Field>
        <Field label={t("auth.email")}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </Field>
        <Field label={t("auth.password")}>
          <input
            type="password"
            defaultValue="demo1234"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {t("auth.signin")}
      </button>

      <div className="mt-4 flex items-center justify-between text-xs">
        <Link to="/auth/forgot" className="text-primary hover:underline">{t("auth.forgot")}</Link>
        <span className="text-muted-foreground">
          {t("auth.noAccount")} <Link to="/auth/signup" className="text-primary hover:underline">{t("auth.create")}</Link>
        </span>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
