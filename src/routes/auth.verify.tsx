import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/auth/verify")({
  head: () => ({ meta: [{ title: "Verify your email — PsyConnect" }] }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const onChange = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate({ to: "/auth/account-created" }); }}
      className="text-center"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MailCheck className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Verify your email</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code we sent to your inbox.</p>
      <div className="mt-6 flex justify-center gap-2">
        {code.map((c, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={c}
            onChange={(e) => onChange(i, e.target.value)}
            inputMode="numeric"
            className="h-12 w-10 rounded-lg border border-input bg-card text-center text-lg font-semibold"
          />
        ))}
      </div>
      <button type="submit" className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Verify</button>
      <div className="mt-4 text-xs text-muted-foreground">
        Didn't get a code? <Link to="/auth/verify" className="text-primary hover:underline">Resend</Link>
      </div>
    </form>
  );
}
