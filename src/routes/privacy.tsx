import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — PsyConnect" }] }),
  component: () => (
    <PublicShell title="Privacy policy" subtitle="Last updated: January 2025">
      <div className="prose prose-slate max-w-none">
        <p>
          PsyConnect ("we", "us") is committed to protecting your privacy. This policy explains
          what information we collect, how we use it and the rights you have over your data.
        </p>
        <h3>Data we collect</h3>
        <ul>
          <li>Account information you provide (name, email, role).</li>
          <li>Clinical content you choose to share with your psychologist.</li>
          <li>Technical logs strictly necessary to keep the service running and secure.</li>
        </ul>
        <h3>How we use it</h3>
        <p>Only to provide the service, comply with law, and improve safety.</p>
        <h3>Your rights</h3>
        <p>You can export or delete your data at any time from Settings → Privacy.</p>
      </div>
    </PublicShell>
  ),
});
