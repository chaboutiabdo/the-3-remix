import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useState } from "react";
import { appointments, psychologists } from "@/data/mock";

export const Route = createFileRoute("/patient/session/$id")({
  head: () => ({ meta: [{ title: "Session — PsyConnect" }] }),
  component: SessionRoom,
});

function SessionRoom() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const a = appointments.find((x) => x.id === id);
  const psy = a && psychologists.find((p) => p.id === a.withId);
  const [muted, setMuted] = useState(false);
  const [cam, setCam] = useState(true);

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-4rem)] flex-col bg-slate-950 text-white md:-mx-8 md:-my-8">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-xs text-white/60">{t("patient.session.title", { name: psy?.name ?? "Session" })}</div>
        </div>
        <Link to="/patient/appointments" className="text-xs text-white/70 hover:text-white">{t("common.back")}</Link>
      </div>
      <div className="relative flex-1">
        <div className="grid h-full place-items-center">
          {psy ? (
            <img src={psy.avatar} alt="" className="h-40 w-40 rounded-full object-cover ring-4 ring-white/20" />
          ) : (
            <div className="text-white/50">No active call</div>
          )}
        </div>
        <div className="absolute end-4 top-4 grid h-24 w-32 place-items-center rounded-xl bg-white/10 text-xs">
          {cam ? "You" : <VideoOff className="h-5 w-5" />}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-white/10 py-4">
        <button onClick={() => setMuted(!muted)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <button onClick={() => setCam(!cam)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          {cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <Link to="/patient/appointments" className="grid h-12 w-12 place-items-center rounded-full bg-destructive text-destructive-foreground hover:opacity-90">
          <PhoneOff className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
