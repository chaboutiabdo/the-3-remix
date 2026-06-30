import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — PsyConnect" }] }),
  component: About,
});

function About() {
  const { t } = useTranslation();
  return (
    <PublicShell title={t("public.aboutTitle")} subtitle={t("public.aboutSub")}>
      <div className="prose prose-slate max-w-none">
        <p>
          PsyConnect is an Algerian telehealth platform that connects patients with
          licensed psychologists for secure online consultations. We were founded
          to make mental healthcare accessible, private and culturally relevant.
        </p>
        <h3>What we do</h3>
        <ul>
          <li>Vet and verify every clinician on the platform.</li>
          <li>Provide secure video, audio and chat consultations.</li>
          <li>Offer care in Arabic, Darija, French and English.</li>
          <li>Keep medical records private and patient-owned.</li>
        </ul>
        <h3>Our team</h3>
        <p>
          A small, multidisciplinary team of clinicians, designers and engineers
          based across Algiers and Oran.
        </p>
        <div className="mt-8 flex gap-3 not-prose">
          <Link to="/auth/signup" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{t("nav.signup")}</Link>
          <Link to="/contact" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">{t("nav.contact")}</Link>
        </div>
      </div>
    </PublicShell>
  );
}
