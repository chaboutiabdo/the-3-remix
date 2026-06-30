import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/account-created")({
  head: () => ({ meta: [{ title: "Account created — PsyConnect" }] }),
  component: () => (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Account created</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome to PsyConnect. Take a minute to complete your initial assessment so we can match you with the right clinician.
      </p>
      <div className="mt-6 grid gap-2">
        <Link to="/patient/assessment" className="rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Start assessment</Link>
        <Link to="/patient" className="rounded-lg border border-border bg-card py-2.5 text-sm font-semibold">Skip for now</Link>
      </div>
    </div>
  ),
});
