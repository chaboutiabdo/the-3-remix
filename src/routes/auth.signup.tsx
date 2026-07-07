import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth, roleHome, type Role } from "@/lib/auth";
import { FormPageSkeleton } from "@/components/page-states";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — PsyConnect" }] }),
  component: Signup,
  pendingComponent: FormPageSkeleton,
});

function Signup() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signIn({ role, email, name: name || "Friend" });
        if (role === "psychologist") {
          navigate({ to: "/onboarding/welcome" });
        } else {
          navigate({ to: "/auth/verify" });
        }
      }}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.signupTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("auth.signupSub")}</p>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {(["patient", "psychologist"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                role === r ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"
              }`}
            >
              {t(r === "patient" ? "auth.rolePatient" : "auth.rolePsychologist")}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.name")}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("auth.password")}</span>
          <input
            type="password"
            required
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {t("auth.create")}
      </button>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        {t("auth.haveAccount")} <Link to="/auth/login" className="text-primary hover:underline">{t("auth.signin")}</Link>
      </div>
    </form>
  );
}
