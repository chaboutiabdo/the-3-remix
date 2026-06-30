import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarClock, CheckCircle2, FileText, X, Mail, Phone, MapPin, GraduationCap,
  BadgeCheck, Languages, Briefcase, Download, Eye, User, Building2, Banknote, ShieldCheck,
} from "lucide-react";
import { Card, Pill } from "@/components/page-bits";
import { verifications, type VerificationDoc, type VerificationItem } from "@/data/mock";
import { cancelMeeting, getMeetings, setMeeting, type VerificationMeeting } from "@/lib/verification-store";

export const Route = createFileRoute("/admin/verification/$id")({
  loader: ({ params }) => {
    const v = verifications.find((x) => x.id === params.id);
    if (!v) throw notFound();
    return v;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Verify ${loaderData?.name ?? ""}` }] }),
  component: Review,
  notFoundComponent: () => <div className="p-8 text-sm">Not found.</div>,
});

type Meeting = { date: string; time: string; mode: "online" | "physical"; location: string; instructions: string };

function Review() {
  const v = Route.useLoaderData() as VerificationItem;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const stored = getMeetings(v.id);
  const [review, setReview] = useState<Meeting | null>(stored.find((m) => m.kind === "review") ?? null);
  const [faceToFaceOpen, setFaceToFaceOpen] = useState(false);
  const [faceToFace, setFaceToFace] = useState<Meeting | null>(stored.find((m) => m.kind === "face_to_face") ?? null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VerificationDoc | null>(null);

  const persist = (kind: VerificationMeeting["kind"], m: Meeting) =>
    setMeeting(v.id, { kind, ...m, scheduledAt: new Date().toISOString(), scheduledBy: "Admin team", candidateId: v.id, candidateName: v.name });

  const flash = (msg: string, after?: () => void) => {
    setToast(msg);
    setTimeout(() => { setToast(null); after?.(); }, 1400);
  };

  const scheduled = !!review;
  const approved = !!faceToFace;

  return (
    <div>
      <Link to="/admin/verification" className="text-sm text-muted-foreground hover:text-foreground">← {t("common.back")}</Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Identity header */}
          <Card>
            <div className="flex flex-wrap items-start gap-4">
              <img src={v.avatar} alt={v.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold">{v.name}</h1>
                  <Pill tone={approved ? "success" : scheduled ? "success" : "warning"}>
                    {approved ? "Approved — face-to-face scheduled" : scheduled ? "Review meeting scheduled" : "Pending review"}
                  </Pill>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{v.specialty} · {v.yearsExperience} yrs experience</div>
                <div className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
                  <InfoLine icon={<Mail className="h-4 w-4" />}>{v.email}</InfoLine>
                  <InfoLine icon={<Phone className="h-4 w-4" />}>{v.phone}</InfoLine>
                  <InfoLine icon={<MapPin className="h-4 w-4" />}>{v.address}</InfoLine>
                  <InfoLine icon={<BadgeCheck className="h-4 w-4" />}>License {v.licenseNumber}</InfoLine>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Submitted {new Date(v.submitted).toLocaleString()}</div>
              </div>
            </div>
          </Card>

          {/* Personal & professional info */}
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal information</h3>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <KV icon={<User className="h-4 w-4" />} k="Date of birth" v={new Date(v.dob).toLocaleDateString()} />
              <KV icon={<User className="h-4 w-4" />} k="Gender" v={v.gender} />
              <KV icon={<MapPin className="h-4 w-4" />} k="City" v={v.city} />
              <KV icon={<Languages className="h-4 w-4" />} k="Languages" v={v.languages.join(", ")} />
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Professional information</h3>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <KV icon={<GraduationCap className="h-4 w-4" />} k="University" v={`${v.university} (${v.graduationYear})`} />
              <KV icon={<Briefcase className="h-4 w-4" />} k="Years of experience" v={`${v.yearsExperience} years`} />
              <KV icon={<Building2 className="h-4 w-4" />} k="Current workplace" v={v.currentWorkplace} />
              <KV icon={<Banknote className="h-4 w-4" />} k="Session rate" v={`${v.sessionRate.toLocaleString()} DZD`} />
              <KV icon={<ShieldCheck className="h-4 w-4" />} k="License number" v={v.licenseNumber} />
              <KV icon={<BadgeCheck className="h-4 w-4" />} k="Specialty" v={v.specialty} />
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bio</h3>
            <p className="mt-2 text-sm leading-relaxed">{v.bio}</p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">References</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {v.references.map((r) => (
                <li key={r.name} className="rounded-lg border border-border p-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role} · {r.contact}</div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Documents */}
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Documents ({v.docs.length})</h3>
              <span className="text-xs text-muted-foreground">
                {v.docs.filter((d) => d.status === "verified").length} verified · {v.docs.filter((d) => d.status === "pending").length} pending
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {v.docs.map((doc) => (
                <li key={doc.name} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">{doc.type} · {doc.size} · uploaded {new Date(doc.uploaded).toLocaleDateString()}</div>
                  </div>
                  <Pill tone={doc.status === "verified" ? "success" : doc.status === "rejected" ? "danger" : "warning"}>
                    {doc.status}
                  </Pill>
                  <button onClick={() => setPreviewDoc(doc)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <a href={doc.url} download className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Actions */}
        <Card className="h-fit lg:sticky lg:top-6">
          <h3 className="font-semibold">Actions</h3>

          {(review || faceToFace) && (
            <div className="mt-3 space-y-2">
              {review && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                  <div className="font-semibold uppercase tracking-wider text-muted-foreground">Review meeting</div>
                  <MeetingSummary m={review} />
                </div>
              )}
              {faceToFace && (
                <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-xs">
                  <div className="font-semibold uppercase tracking-wider text-primary">Face-to-face meeting</div>
                  <MeetingSummary m={faceToFace} />
                </div>
              )}
            </div>
          )}

          <div className="mt-3 space-y-2">
            {!scheduled && (
              <button onClick={() => setScheduleOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2 text-sm font-semibold text-background hover:opacity-90">
                <CalendarClock className="h-4 w-4" /> Schedule appointment with Dr.
              </button>
            )}

            {scheduled && !approved && (
              <>
                <button onClick={() => setScheduleOpen(true)} className="w-full rounded-lg border border-border py-2 text-sm font-semibold hover:bg-accent">Reschedule review</button>
                <button onClick={() => setFaceToFaceOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <CheckCircle2 className="h-4 w-4" /> Accept — schedule face-to-face
                </button>
                <button onClick={() => { setReview(null); cancelMeeting(v.id, "review"); flash("Review meeting cancelled — psychologist notified."); }} className="w-full rounded-lg border border-destructive/50 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">Cancel review meeting</button>
                <button onClick={() => flash("Application rejected", () => navigate({ to: "/admin/verification" }))} className="w-full rounded-lg border border-destructive/50 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">{t("admin.reject")}</button>
              </>
            )}

            {approved && (
              <>
                <button onClick={() => setFaceToFaceOpen(true)} className="w-full rounded-lg border border-border py-2 text-sm font-semibold hover:bg-accent">Reschedule face-to-face</button>
                <button onClick={() => { setFaceToFace(null); cancelMeeting(v.id, "face_to_face"); flash("Face-to-face cancelled — psychologist notified."); }} className="w-full rounded-lg border border-destructive/50 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">Cancel face-to-face</button>
                <button onClick={() => flash("Clinician fully approved", () => navigate({ to: "/admin/verification" }))} className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Finalize approval</button>
              </>
            )}
          </div>

          <h4 className="mt-5 text-sm font-semibold">Reviewer notes</h4>
          <textarea rows={4} placeholder="Internal notes…" className="mt-2 w-full rounded-lg border border-input bg-card p-3 text-sm" />
        </Card>
      </div>

      {scheduleOpen && (
        <ScheduleModal title="Schedule appointment with Dr." name={v.name} initial={review} onClose={() => setScheduleOpen(false)}
          onSend={(m) => { setReview(m); persist("review", m); setScheduleOpen(false); flash("Appointment scheduled — psychologist notified."); }} />
      )}
      {faceToFaceOpen && (
        <ScheduleModal title="Schedule face-to-face meeting" name={v.name} initial={faceToFace} defaultMode="physical" onClose={() => setFaceToFaceOpen(false)}
          onSend={(m) => { setFaceToFace(m); persist("face_to_face", m); setFaceToFaceOpen(false); flash("Face-to-face meeting scheduled — psychologist notified."); }} />
      )}

      {previewDoc && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setPreviewDoc(null)}>
          <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-2xl flex-col rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{previewDoc.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{previewDoc.type} · {previewDoc.size}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="rounded-md p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid h-72 place-items-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              <div className="text-center">
                <FileText className="mx-auto h-10 w-10 text-primary" />
                <div className="mt-2">Document preview (mock)</div>
                <div className="text-xs">In production this would show the uploaded PDF/image.</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a href={previewDoc.url} download className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">
                <Download className="h-4 w-4" /> Download
              </a>
              <button onClick={() => setPreviewDoc(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
          <CheckCircle2 className="me-2 inline h-4 w-4" />{toast}
        </div>
      )}
    </div>
  );
}

function InfoLine({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-muted-foreground"><span className="text-primary">{icon}</span><span className="truncate text-foreground">{children}</span></div>;
}

function KV({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground"><span className="text-primary">{icon}</span>{k}</div>
      <div className="mt-1 font-medium">{v}</div>
    </div>
  );
}

function MeetingSummary({ m }: { m: Meeting }) {
  return (
    <div className="mt-1 space-y-0.5">
      <div className="font-medium text-foreground">{new Date(`${m.date}T${m.time}`).toLocaleString()}</div>
      <div className="capitalize text-muted-foreground">{m.mode} · {m.location}</div>
      {m.instructions && <div className="text-muted-foreground">{m.instructions}</div>}
    </div>
  );
}

function ScheduleModal({
  title, name, initial, defaultMode = "online", onClose, onSend,
}: {
  title: string; name: string; initial: Meeting | null; defaultMode?: "online" | "physical";
  onClose: () => void; onSend: (m: Meeting) => void;
}) {
  const [date, setDate] = useState(() => {
    if (initial) return initial.date;
    const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState(initial?.time ?? "14:30");
  const [mode, setMode] = useState<"online" | "physical">(initial?.mode ?? defaultMode);
  const [location, setLocation] = useState(initial?.location ?? (defaultMode === "physical" ? "Clinic — main office" : "Secure video link"));
  const [instructions, setInstructions] = useState(initial?.instructions ?? "Please have your original license document ready.");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSend({ date, time, mode, location, instructions }); }} className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">With {name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Time</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Meeting type</span>
            <div className="flex gap-2">
              {(["online", "physical"] as const).map((opt) => (
                <button type="button" key={opt} onClick={() => setMode(opt)} className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${mode === opt ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"}`}>{opt}</button>
              ))}
            </div>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">{mode === "online" ? "Video link / room" : "Address"}</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Instructions / notes</span>
            <textarea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold">Cancel</button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save & send invitation</button>
        </div>
      </form>
    </div>
  );
}
