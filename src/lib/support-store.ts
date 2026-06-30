// Lightweight client-side support ticket store backed by localStorage.
// Front-end only — no server calls.
import { useSyncExternalStore } from "react";

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus =
  | "new"
  | "open"
  | "in_progress"
  | "waiting_patient"
  | "resolved"
  | "closed";

export type TicketMessage = {
  id: string;
  author: "patient" | "admin";
  authorName: string;
  body: string;
  at: string;
  internal?: boolean;
};

export type Ticket = {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientId: string;
  subject: string;
  customSubject?: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachmentName?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
};

const KEY = "psy.support.tickets";

function seed(): Ticket[] {
  const now = Date.now();
  return [
    {
      id: "TCK-1042",
      patientId: "u-anissa",
      patientName: "Anissa Ould-Hammou",
      patientEmail: "anissa.oh@example.com",
      patientPhone: "+213 550 12 34 56",
      subject: "I cannot join my consultation",
      description:
        "The 'Join video' button does nothing when I click it 5 minutes before the session.",
      priority: "high",
      status: "in_progress",
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      messages: [
        {
          id: "m1",
          author: "patient",
          authorName: "Anissa Ould-Hammou",
          body: "Hi, I cannot join the video call. The button does not respond.",
          at: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
        },
        {
          id: "m2",
          author: "admin",
          authorName: "Support",
          body: "Hello Anissa — could you tell us which browser you are using?",
          at: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
        },
      ],
    },
    {
      id: "TCK-1041",
      patientId: "u-karim",
      patientName: "Karim Belkacem",
      patientEmail: "karim.b@example.com",
      subject: "Appointment issue",
      description: "I booked Tuesday 10:00 but received a confirmation for 11:00.",
      priority: "medium",
      status: "open",
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      messages: [
        {
          id: "m1",
          author: "patient",
          authorName: "Karim Belkacem",
          body: "Please correct my appointment time.",
          at: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
        },
      ],
    },
    {
      id: "TCK-1038",
      patientId: "u-leila",
      patientName: "Leila Cherif",
      patientEmail: "leila.c@example.com",
      subject: "General question",
      description: "Do you support sessions in Kabyle?",
      priority: "low",
      status: "resolved",
      createdAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 70).toISOString(),
      messages: [
        {
          id: "m1",
          author: "patient",
          authorName: "Leila Cherif",
          body: "Do any of your psychologists speak Kabyle?",
          at: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
        },
        {
          id: "m2",
          author: "admin",
          authorName: "Support",
          body: "Yes — Dr. Yacine Aït speaks Kabyle. You can filter by language on Find.",
          at: new Date(now - 1000 * 60 * 60 * 70).toISOString(),
        },
      ],
    },
  ];
}

let state: Ticket[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load(): Ticket[] {
  if (loaded) return state;
  loaded = true;
  if (typeof window === "undefined") return (state = seed());
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? (JSON.parse(raw) as Ticket[]) : seed();
  } catch {
    state = seed();
  }
  if (!state.length) state = seed();
  persist();
  return state;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useTickets(): Ticket[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => load(),
  );
}

export function useTicket(id: string | undefined): Ticket | undefined {
  const all = useTickets();
  return all.find((t) => t.id === id);
}

function nextId(): string {
  const max = state.reduce((m, t) => {
    const n = parseInt(t.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 1000);
  return `TCK-${max + 1}`;
}

export type CreateTicketInput = {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientId: string;
  subject: string;
  customSubject?: string;
  description: string;
  priority: TicketPriority;
  attachmentName?: string;
};

export function createTicket(input: CreateTicketInput): Ticket {
  load();
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: nextId(),
    ...input,
    status: "new",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: "m1",
        author: "patient",
        authorName: input.patientName,
        body: input.description,
        at: now,
      },
    ],
  };
  state = [ticket, ...state];
  persist();
  emit();
  return ticket;
}

export function updateTicket(id: string, patch: Partial<Pick<Ticket, "status" | "priority">>) {
  load();
  state = state.map((t) =>
    t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
  );
  persist();
  emit();
}

export function addMessage(
  id: string,
  msg: Omit<TicketMessage, "id" | "at"> & { at?: string },
) {
  load();
  const now = msg.at ?? new Date().toISOString();
  state = state.map((t) =>
    t.id === id
      ? {
          ...t,
          messages: [
            ...t.messages,
            { ...msg, id: `m${t.messages.length + 1}`, at: now },
          ],
          updatedAt: now,
        }
      : t,
  );
  persist();
  emit();
}

export const SUBJECT_OPTIONS = [
  "I cannot join my consultation",
  "My psychologist is not responding",
  "Appointment issue",
  "Booking problem",
  "Payment question",
  "Technical issue",
  "Account problem",
  "Login issue",
  "File upload problem",
  "Video or audio issue",
  "Report inappropriate behavior",
  "General question",
  "Other",
] as const;

export const STATUS_LABEL: Record<TicketStatus, string> = {
  new: "New",
  open: "Open",
  in_progress: "In Progress",
  waiting_patient: "Waiting for Patient",
  resolved: "Resolved",
  closed: "Closed",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
