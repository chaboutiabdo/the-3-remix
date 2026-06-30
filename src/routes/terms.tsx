import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — PsyConnect" }] }),
  component: () => (
    <PublicShell title="Terms & conditions" subtitle="Last updated: January 2025">
      <div className="prose prose-slate max-w-none">
        <p>By using PsyConnect you agree to these terms.</p>
        <h3>Service</h3>
        <p>PsyConnect is a software platform that facilitates telehealth sessions between patients and licensed clinicians. We are not a medical provider.</p>
        <h3>User obligations</h3>
        <p>Provide accurate information and use the service only for lawful, personal purposes.</p>
        <h3>Liability</h3>
        <p>To the maximum extent permitted by Algerian law, PsyConnect's liability is limited to fees paid in the prior 12 months.</p>
      </div>
    </PublicShell>
  ),
});
