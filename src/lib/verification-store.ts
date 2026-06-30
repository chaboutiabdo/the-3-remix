// Lightweight client-only store to sync admin-scheduled verification meetings
// with the psychologist's pending-verification dashboard. Frontend mock only.

export type VerificationMeeting = {
  kind: "review" | "face_to_face";
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  mode: "online" | "physical";
  location: string;
  instructions: string;
  scheduledAt: string; // ISO
  scheduledBy: string; // admin display name
  candidateId: string;
  candidateName: string;
};

const KEY = "psyconnect.verificationMeetings.v1";
const EVT = "psyconnect:verification-updated";

type Store = Record<string, VerificationMeeting[]>; // by candidateId

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getMeetings(candidateId: string): VerificationMeeting[] {
  return read()[candidateId] ?? [];
}

export function getLatestMeeting(): VerificationMeeting | null {
  const all = Object.values(read()).flat();
  if (!all.length) return null;
  return all.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))[0];
}

export function setMeeting(candidateId: string, m: VerificationMeeting) {
  const s = read();
  const list = (s[candidateId] ?? []).filter((x) => x.kind !== m.kind);
  list.push(m);
  s[candidateId] = list;
  write(s);
}

export function cancelMeeting(candidateId: string, kind: VerificationMeeting["kind"]) {
  const s = read();
  s[candidateId] = (s[candidateId] ?? []).filter((x) => x.kind !== kind);
  write(s);
}

export function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}
