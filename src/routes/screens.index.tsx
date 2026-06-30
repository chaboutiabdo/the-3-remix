import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/screens/")({
  head: () => ({ meta: [{ title: "Design gallery — PsyConnect" }] }),
  component: Gallery,
});

type Item = { id: number; title: string; group: string };
const screens: Item[] = [
  { id: 1, title: "Landing", group: "Patient" },
  { id: 2, title: "Find a Psychologist", group: "Patient" },
  { id: 3, title: "Psychologist Profile", group: "Patient" },
  { id: 4, title: "Patient Dashboard", group: "Patient" },
  { id: 5, title: "Book a Session", group: "Patient" },
  { id: 6, title: "Consultation Room", group: "Patient" },
  { id: 14, title: "Psychologist Dashboard", group: "Psychologist" },
  { id: 15, title: "Availability Manager", group: "Psychologist" },
  { id: 9, title: "Welcome to the Practice", group: "Onboarding" },
  { id: 12, title: "Professional Credentials", group: "Onboarding" },
  { id: 10, title: "Document Upload", group: "Onboarding" },
  { id: 13, title: "Verification in Progress", group: "Onboarding" },
  { id: 11, title: "Review & Submit", group: "Onboarding" },
  { id: 7, title: "Admin Dashboard", group: "Admin" },
  { id: 8, title: "Verification Queue", group: "Admin" },
];

function Gallery() {
  const groups = ["Patient", "Psychologist", "Onboarding", "Admin"];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">P</div>
            PsyConnect · Gallery
          </Link>
          <Link to="/" className="text-sm text-primary hover:underline">← Back to app</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Design reference</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Original design mockups</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The 15 source screens used to build PsyConnect. The live application above is the real implementation.
        </p>
        {groups.map((g) => {
          const list = screens.filter((s) => s.group === g);
          return (
            <section key={g} className="mt-10">
              <h2 className="mb-3 border-b border-border pb-2 text-base font-semibold">{g}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((s) => (
                  <Link key={s.id} to="/screens/$id" params={{ id: String(s.id) }} className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Screen {String(s.id).padStart(2, "0")}</div>
                    <div className="mt-1 font-semibold">{s.title}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
