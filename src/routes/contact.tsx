import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/public-shell";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — PsyConnect" }] }),
  component: Contact,
});

function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  return (
    <PublicShell title={t("public.contactTitle")} subtitle={t("public.contactSub")}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@psyconnect.dz</div>
          <div className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +213 555 12 34 56</div>
          <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> 14 Rue Didouche Mourad, Algiers</div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="md:col-span-2 rounded-2xl border border-border bg-card p-6"
        >
          {sent ? (
            <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
              Thanks! We'll get back to you within one business day.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Your name" className="rounded-lg border border-input bg-card px-3 py-2 text-sm" />
              <input required type="email" placeholder="Email" className="rounded-lg border border-input bg-card px-3 py-2 text-sm" />
              <input placeholder="Subject" className="sm:col-span-2 rounded-lg border border-input bg-card px-3 py-2 text-sm" />
              <textarea required rows={5} placeholder="How can we help?" className="sm:col-span-2 rounded-lg border border-input bg-card px-3 py-2 text-sm" />
              <button className="sm:col-span-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Send message</button>
            </div>
          )}
        </form>
      </div>
    </PublicShell>
  );
}
