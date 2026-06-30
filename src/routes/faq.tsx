import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — PsyConnect" }] }),
  component: Faq,
});

const faqs = [
  { q: "Is PsyConnect confidential?", a: "Yes. Sessions are end-to-end encrypted and your records are private to you and your treating clinician." },
  { q: "How much does a session cost?", a: "Fees are set by each clinician and listed on their profile, typically 3,500–6,000 DZD." },
  { q: "Are psychologists licensed?", a: "All clinicians submit license documents which we verify in a video interview before activation." },
  { q: "Can I cancel an appointment?", a: "Yes, free of charge up to 12 hours before your session." },
  { q: "Do you offer care in Arabic?", a: "Yes — Arabic, Darija, French and English depending on the clinician." },
  { q: "Is my insurance accepted?", a: "We're partnering with national insurers — coverage rolling out in 2025." },
];

function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PublicShell title={t("public.faqTitle")} subtitle={t("public.faqSub")}>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="block w-full px-5 py-4 text-start"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </div>
            {open === i && <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>}
          </button>
        ))}
      </div>
    </PublicShell>
  );
}
