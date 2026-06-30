import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/patient/assessment")({
  head: () => ({ meta: [{ title: "Initial assessment — PsyConnect" }] }),
  component: Assessment,
});

type Q =
  | { id: string; section: string; label: string; type: "scale"; min: number; max: number }
  | { id: string; section: string; label: string; type: "choice"; options: string[] }
  | { id: string; section: string; label: string; type: "text"; placeholder?: string };

const QUESTIONS: Q[] = [
  { id: "reason", section: "Reason for consultation", label: "What brings you to therapy today?", type: "text", placeholder: "Briefly describe…" },
  { id: "goal", section: "Reason for consultation", label: "What would success look like for you?", type: "text" },

  { id: "mood", section: "Current state", label: "How would you rate your overall mood this week?", type: "scale", min: 1, max: 10 },
  { id: "stress", section: "Current state", label: "How would you rate your stress level?", type: "scale", min: 1, max: 10 },
  { id: "anxiety", section: "Current state", label: "How would you rate your anxiety?", type: "scale", min: 1, max: 10 },
  { id: "sleep", section: "Current state", label: "How is your sleep quality?", type: "choice", options: ["Excellent", "Good", "Fair", "Poor"] },

  { id: "work", section: "Life context", label: "Professional situation", type: "choice", options: ["Employed", "Student", "Self-employed", "Unemployed", "Other"] },
  { id: "family", section: "Life context", label: "Family situation", type: "choice", options: ["Single", "In a relationship", "Married", "Parent", "Other"] },
  { id: "habits", section: "Life context", label: "Substance use (alcohol, tobacco, other)?", type: "choice", options: ["None", "Occasional", "Regular", "Prefer not to say"] },

  { id: "prior", section: "Background", label: "Have you seen a psychologist before?", type: "choice", options: ["No", "Yes — briefly", "Yes — long term"] },
  { id: "diagnosis", section: "Background", label: "Any prior diagnosis you'd like to share?", type: "text" },
  { id: "meds", section: "Background", label: "Current medication", type: "text", placeholder: "Optional" },

  { id: "goals", section: "Goals", label: "What goals do you have for therapy?", type: "text" },
  { id: "extra", section: "Goals", label: "Anything else you'd like us to know?", type: "text" },
];

function Assessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sections = useMemo(() => Array.from(new Set(QUESTIONS.map((q) => q.section))), []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [done, setDone] = useState(false);

  const sectionName = sections[step];
  const sectionQs = QUESTIONS.filter((q) => q.section === sectionName);
  const progress = Math.round(((step + (done ? 1 : 0)) / sections.length) * 100);

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Assessment saved</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your responses are private. They will be shared with a clinician only after you confirm an appointment.
        </p>
        <div className="mt-6 grid gap-2">
          <Link to="/patient/find" className="rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Find a psychologist</Link>
          <Link to="/patient" className="rounded-lg border border-border bg-card py-2.5 text-sm font-semibold">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Section {step + 1} of {sections.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{sectionName}</h2>
        <div className="mt-5 space-y-5">
          {sectionQs.map((q) => (
            <div key={q.id}>
              <label className="mb-2 block text-sm font-medium">{q.label}</label>
              {q.type === "text" && (
                <textarea
                  rows={3}
                  placeholder={q.placeholder}
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                />
              )}
              {q.type === "choice" && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => {
                    const active = answers[q.id] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.id]: o })}
                        className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              )}
              {q.type === "scale" && (
                <div>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={Number(answers[q.id] ?? Math.round((q.min + q.max) / 2))}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{q.min}</span>
                    <span className="font-medium text-foreground">{answers[q.id] ?? "—"}</span>
                    <span>{q.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
          className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold disabled:opacity-40"
        >
          {t("common.back")}
        </button>
        {step < sections.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            {t("common.next")}
          </button>
        ) : (
          <button
            onClick={() => { setDone(true); setTimeout(() => navigate({ to: "/patient" }), 2500); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            {t("common.submit")}
          </button>
        )}
      </div>
    </div>
  );
}
