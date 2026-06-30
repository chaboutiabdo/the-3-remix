import { createFileRoute, Link, notFound } from "@tanstack/react-router";

const screenMeta: Record<string, { title: string; group: string }> = {
  "1": { title: "Landing", group: "Patient" },
  "2": { title: "Find a Psychologist", group: "Patient" },
  "3": { title: "Psychologist Profile", group: "Patient" },
  "4": { title: "Patient Dashboard", group: "Patient" },
  "5": { title: "Book a Session", group: "Patient" },
  "6": { title: "Consultation Room", group: "Patient" },
  "7": { title: "Admin Dashboard", group: "Admin" },
  "8": { title: "Verification Queue", group: "Admin" },
  "9": { title: "Welcome to the Practice", group: "Onboarding" },
  "10": { title: "Document Upload", group: "Onboarding" },
  "11": { title: "Review & Submit", group: "Onboarding" },
  "12": { title: "Professional Credentials", group: "Onboarding" },
  "13": { title: "Verification in Progress", group: "Onboarding" },
  "14": { title: "Psychologist Dashboard", group: "Psychologist" },
  "15": { title: "Availability Manager", group: "Psychologist" },
};

const order = ["1", "2", "3", "4", "5", "6", "14", "15", "9", "12", "10", "13", "11", "7", "8"];

export const Route = createFileRoute("/screens/$id")({
  loader: ({ params }) => {
    const meta = screenMeta[params.id];
    if (!meta) throw notFound();
    return meta;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.title} — PsyConnect` },
            { name: "description", content: `PsyConnect ${loaderData.group} surface: ${loaderData.title}.` },
          ],
        }
      : {},
  component: ScreenViewer,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf8] text-[#181c1b]">
      <div className="text-center">
        <p className="text-sm text-[#43474f]">Screen not found.</p>
        <Link to="/" className="mt-3 inline-block text-sm font-semibold text-[#30568b]">
          ← Back to all screens
        </Link>
      </div>
    </div>
  ),
});

function ScreenViewer() {
  const { id } = Route.useParams();
  const meta = Route.useLoaderData();
  const idx = order.indexOf(id);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;

  return (
    <div className="flex h-screen flex-col bg-[#181c1b] text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="flex items-center justify-between border-b border-white/10 bg-[#1f2422] px-5 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← All screens
          </Link>
          <div className="h-5 w-px bg-white/15" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/50">
              {meta.group} · Screen {id.padStart(2, "0")}
            </div>
            <div className="text-sm font-semibold tracking-tight">{meta.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prev ? (
            <Link
              to="/screens/$id"
              params={{ id: prev }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
            >
              ← Prev
            </Link>
          ) : (
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30">← Prev</span>
          )}
          {next ? (
            <Link
              to="/screens/$id"
              params={{ id: next }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30">Next →</span>
          )}
          <a
            href={`/raw/page${id}.html`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#181c1b] hover:bg-white/90"
          >
            Open full ↗
          </a>
        </div>
      </header>
      <iframe
        title={meta.title}
        src={`/raw/page${id}.html`}
        className="flex-1 w-full bg-white"
      />
    </div>
  );
}
