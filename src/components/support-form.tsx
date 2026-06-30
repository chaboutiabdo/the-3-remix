import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Paperclip, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  SUBJECT_OPTIONS,
  createTicket,
  type TicketPriority,
} from "@/lib/support-store";

export function SupportFormDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (id: string) => void;
}) {
  const { session } = useAuth();
  const [subject, setSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [customSubject, setCustomSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [email, setEmail] = useState(session?.email ?? "");
  const [phone, setPhone] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setEmail(session?.email ?? "");
  }, [open, session?.email]);

  function reset() {
    setSubject(SUBJECT_OPTIONS[0]);
    setCustomSubject("");
    setDescription("");
    setPriority("medium");
    setPhone("");
    setAttachment(null);
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!subject) e.subject = "Please choose a subject.";
    if (subject === "Other" && !customSubject.trim())
      e.customSubject = "Please specify your subject.";
    if (description.trim().length < 10)
      e.description = "Please describe your issue (10+ characters).";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
    if (attachment) {
      const ok =
        attachment.type.startsWith("image/") || attachment.type === "application/pdf";
      if (!ok) e.attachment = "Only images or PDF are allowed.";
      if (attachment.size > 10 * 1024 * 1024) e.attachment = "Max 10 MB.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const ticket = createTicket({
        patientId: session?.email ?? "guest",
        patientName: session?.name ?? "Guest",
        patientEmail: email,
        patientPhone: phone || undefined,
        subject: subject === "Other" ? customSubject.trim() : subject,
        customSubject: subject === "Other" ? customSubject.trim() : undefined,
        description: description.trim(),
        priority,
        attachmentName: attachment?.name,
      });
      setSubmitting(false);
      toast.success("Support request received", {
        description: `Ticket ${ticket.id} — our team will reply shortly.`,
      });
      reset();
      onOpenChange(false);
      onCreated?.(ticket.id);
    }, 400);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Tell us what's going on. Our team typically replies within a few hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Subject *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
          </div>

          {subject === "Other" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Specify subject *</label>
              <input
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                placeholder="Briefly describe the topic"
              />
              {errors.customSubject && (
                <p className="mt-1 text-xs text-destructive">{errors.customSubject}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              placeholder="Share the details — when it happened, what you tried, any error messages…"
            />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Priority *</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as TicketPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                    priority === p
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-input bg-card hover:bg-accent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contact email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                placeholder="+213…"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Attachment (optional)</label>
            <div className="mt-1 flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-card px-3 py-2 text-sm hover:bg-accent">
                <Paperclip className="h-4 w-4" />
                <span>{attachment ? "Replace file" : "Choose image or PDF"}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                />
              </label>
              {attachment && (
                <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                  <span className="max-w-[160px] truncate">{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)} aria-label="Remove">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {errors.attachment && <p className="mt-1 text-xs text-destructive">{errors.attachment}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
