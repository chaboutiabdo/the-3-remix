import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, FileText, MapPin, Mail, Video } from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/page-bits";
import { getLatestMeeting, subscribe, type VerificationMeeting } from "@/lib/verification-store";

export const Route = createFileRoute("/psychologist/pending")({
  head: () => ({ meta: [{ title: "Verification in progress — PsyConnect" }] }),
  component: Pending,
});

function Pending() {
  const [meeting, setMeetingState] = useState<VerificationMeeting | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const [notified, setNotified] = useState<string | null>(null);

  useEffect(() => {
    setMeetingState(getLatestMeeting());
    const unsub = subscribe(() => {
      const next = getLatestMeeting();
      setMeetingState((prev) => {
        if (next && (!prev || next.scheduledAt !== prev.scheduledAt || next.kind !== prev.kind)) {
          setNotified(
            next.kind === "face_to_face"
              ? "Admin scheduled your face-to-face verification meeting."
              : "Admin scheduled your verification review."
          );
          setTimeout(() => setNotified(null), 5000);
        }
        if (!next && prev) {
          setNotified("Your verification meeting was cancelled by the admin.");
          setTimeout(() => setNotified(null), 5000);
        }
        return next;
      });
    });
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => {
      unsub();
      clearInterval(id);
    };
  }, []);

  const when = meeting ? new Date(`${meeting.date}T${meeting.time}`) : null;
  const diff = when ? when.getTime() - now.getTime() : 0;
  const days = Math.max(0, Math.floor(diff / 86_400_000));
  const hours = Math.max(0, Math.floor((diff % 86_400_000) / 3_600_000));
  const minutes = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));

  const scheduled = !!meeting;
  const isFace = meeting?.kind === "face_to_face";

  return (
    <div>
      <PageHeader
        title="Your account is under verification"
        subtitle="Every feature unlocks the moment our clinical team approves your file."
        action={
          <Pill tone={scheduled ? "success" : "warning"}>
            {scheduled
              ? isFace
                ? "Face-to-face meeting scheduled"
                : "Review meeting scheduled"
              : "Awaiting admin scheduling"}
          </Pill>
        }
      />

      {notified && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" /> {notified}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {scheduled && when ? (
            <>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {isFace ? "Face-to-face verification meeting" : "Verification review meeting"}
                  </div>
                  <div className="text-lg font-semibold">
                    {when.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} ·{" "}
                    {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: days, l: "days" },
                  { v: hours, l: "hours" },
                  { v: minutes, l: "minutes" },
                ].map((c) => (
                  <div key={c.l} className="rounded-xl border border-border bg-surface-soft p-4">
                    <div className="text-2xl font-semibold tabular-nums">{c.v}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-sm">
                <div className="flex items-center gap-2 font-medium capitalize">
                  {meeting!.mode === "online" ? <Video className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                  {meeting!.mode} meeting
                </div>
                <div className="text-muted-foreground">{meeting!.location}</div>
                {meeting!.instructions && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">Instructions: </span>
                    {meeting!.instructions}
                  </div>
                )}
                <div className="pt-1 text-xs text-muted-foreground">Scheduled by {meeting!.scheduledBy}</div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-warning/15 text-warning-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <div className="mt-3 text-lg font-semibold">Waiting for admin to schedule your verification</div>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Our clinical team is reviewing your file. You'll be notified here as soon as a meeting date is set.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold">Verification status</h3>
          <ol className="mt-4 space-y-3 text-sm">
            <Step label="Application submitted" done />
            <Step label="Documents received" done />
            <Step label="Review meeting scheduled" done={scheduled} />
            <Step label="Face-to-face meeting scheduled" done={isFace} />
            <Step label="Account approved" />
          </ol>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Documents received</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <DocRow label="National ID" />
            <DocRow label="State diploma" />
            <DocRow label="Authorization to practice" />
            <DocRow label="Profile picture" />
          </ul>
          <div className="mt-3 text-xs text-muted-foreground">Estimated processing time: 48–72 hours after the meeting.</div>
        </Card>

        <Card>
          <h3 className="font-semibold">Available actions</h3>
          <p className="mt-2 text-sm text-muted-foreground">Most features are disabled until verification is complete.</p>
          <ul className="mt-3 space-y-2 text-sm">
            <DisabledItem label="Accept patient bookings" />
            <DisabledItem label="Publish public profile" />
            <DisabledItem label="Receive payouts" />
            <li className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Contact support</span>
              <Link to="/contact" className="text-xs font-semibold text-primary hover:underline">Open</Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
      <span className={done ? "" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}
function DocRow({ label }: { label: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
      <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {label}</span>
      <span className="text-xs text-success">Received</span>
    </li>
  );
}
function DisabledItem({ label }: { label: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-dashed border-border bg-surface-soft px-3 py-2 opacity-70">
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">Locked</span>
    </li>
  );
}
