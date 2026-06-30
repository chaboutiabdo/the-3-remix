export type Psychologist = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  fee: number;
  avatar: string;
  bio: string;
};

export const psychologists: Psychologist[] = [
  {
    id: "sarah-rahmani",
    name: "Dr. Sarah Rahmani",
    specialty: "Anxiety & depression",
    city: "Algiers",
    languages: ["Arabic", "French", "English"],
    rating: 4.9,
    reviews: 128,
    fee: 4500,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&h=240&fit=crop",
    bio: "CBT-trained clinician with 10+ years helping young adults navigate anxiety, burnout and relationship stress.",
  },
  {
    id: "youcef-benhamida",
    name: "Dr. Youcef Benhamida",
    specialty: "Couples therapy",
    city: "Oran",
    languages: ["Arabic", "French"],
    rating: 4.8,
    reviews: 94,
    fee: 5000,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=240&h=240&fit=crop",
    bio: "Helping couples rebuild trust, communicate clearly and reconnect after life's hardest seasons.",
  },
  {
    id: "amina-khelifi",
    name: "Dr. Amina Khelifi",
    specialty: "Trauma & PTSD",
    city: "Constantine",
    languages: ["Arabic", "English"],
    rating: 4.9,
    reviews: 211,
    fee: 5500,
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=240&h=240&fit=crop",
    bio: "EMDR-certified trauma therapist working with first responders, survivors and grieving families.",
  },
  {
    id: "karim-haddad",
    name: "Dr. Karim Haddad",
    specialty: "Adolescents",
    city: "Algiers",
    languages: ["Arabic", "French"],
    rating: 4.7,
    reviews: 76,
    fee: 4000,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&h=240&fit=crop",
    bio: "School counsellor turned psychologist, specialising in teen anxiety, identity and family conflict.",
  },
  {
    id: "lina-saidi",
    name: "Dr. Lina Saidi",
    specialty: "Women's health",
    city: "Annaba",
    languages: ["Arabic", "French", "English"],
    rating: 4.9,
    reviews: 154,
    fee: 5000,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=240&h=240&fit=crop",
    bio: "Perinatal mental health, fertility journeys, postpartum care and women's identity work.",
  },
  {
    id: "ahmed-tlemcani",
    name: "Dr. Ahmed Tlemcani",
    specialty: "Addiction",
    city: "Tlemcen",
    languages: ["Arabic", "French"],
    rating: 4.6,
    reviews: 62,
    fee: 4500,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&h=240&fit=crop",
    bio: "Compassionate, evidence-based addiction recovery — alcohol, gambling, screens and beyond.",
  },
];

export type Appointment = {
  id: string;
  with: string;
  withId: string;
  patientName?: string;
  date: string; // ISO
  durationMin: number;
  status: "upcoming" | "completed" | "cancelled";
};

const today = new Date();
const d = (offset: number, h: number, m = 0) => {
  const x = new Date(today);
  x.setDate(x.getDate() + offset);
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

export const appointments: Appointment[] = [
  { id: "a1", with: "Dr. Sarah Rahmani", withId: "sarah-rahmani", patientName: "Yacine M.", date: d(0, 14), durationMin: 50, status: "upcoming" },
  { id: "a2", with: "Dr. Amina Khelifi", withId: "amina-khelifi", patientName: "Nour B.", date: d(0, 16, 30), durationMin: 50, status: "upcoming" },
  { id: "a3", with: "Dr. Youcef Benhamida", withId: "youcef-benhamida", patientName: "Karim & Sara", date: d(1, 10), durationMin: 60, status: "upcoming" },
  { id: "a4", with: "Dr. Sarah Rahmani", withId: "sarah-rahmani", patientName: "Yacine M.", date: d(-7, 14), durationMin: 50, status: "completed" },
  { id: "a5", with: "Dr. Lina Saidi", withId: "lina-saidi", patientName: "Hadjer K.", date: d(-14, 11), durationMin: 50, status: "completed" },
];

export type Patient = {
  id: string;
  name: string;
  age: number;
  city: string;
  nextSession: string | null;
  totalSessions: number;
  status: "active" | "paused";
  avatar: string;
};

export const patients: Patient[] = [
  { id: "p1", name: "Yacine Meziane", age: 28, city: "Algiers", nextSession: d(0, 14), totalSessions: 12, status: "active", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" },
  { id: "p2", name: "Nour Brahimi", age: 34, city: "Oran", nextSession: d(0, 16, 30), totalSessions: 6, status: "active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop" },
  { id: "p3", name: "Hadjer Khelil", age: 41, city: "Annaba", nextSession: d(3, 10), totalSessions: 22, status: "active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop" },
  { id: "p4", name: "Walid Bouzid", age: 22, city: "Algiers", nextSession: null, totalSessions: 3, status: "paused", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop" },
];

export type VerificationDoc = {
  name: string;
  type: string;
  size: string;
  uploaded: string;
  status: "verified" | "pending" | "rejected";
  url: string;
};

export type VerificationItem = {
  id: string;
  name: string;
  specialty: string;
  submitted: string;
  status: "pending" | "in_review";
  documents: number;
  avatar: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  dob: string;
  gender: string;
  licenseNumber: string;
  yearsExperience: number;
  languages: string[];
  university: string;
  graduationYear: number;
  currentWorkplace: string;
  sessionRate: number;
  bio: string;
  references: { name: string; role: string; contact: string }[];
  docs: VerificationDoc[];
};

const baseDocs = (sub: string): VerificationDoc[] => [
  { name: "National ID card.pdf", type: "Identity", size: "1.2 MB", uploaded: sub, status: "verified", url: "#" },
  { name: "State diploma — Psychology MSc.pdf", type: "Diploma", size: "3.4 MB", uploaded: sub, status: "verified", url: "#" },
  { name: "License to practice.pdf", type: "License", size: "0.9 MB", uploaded: sub, status: "pending", url: "#" },
  { name: "Authorization — Ministry of Health.pdf", type: "Authorization", size: "1.8 MB", uploaded: sub, status: "verified", url: "#" },
  { name: "Background check.pdf", type: "Background", size: "0.6 MB", uploaded: sub, status: "pending", url: "#" },
  { name: "Professional liability insurance.pdf", type: "Insurance", size: "2.1 MB", uploaded: sub, status: "verified", url: "#" },
];

export const verifications: VerificationItem[] = [
  {
    id: "v1", name: "Dr. Riad Mansouri", specialty: "Anxiety & depression", submitted: d(-1, 9), status: "pending", documents: 6,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop",
    email: "riad.mansouri@example.dz", phone: "+213 555 12 34 56", city: "Algiers", address: "12 Rue Didouche Mourad, Algiers",
    dob: "1986-03-14", gender: "Male", licenseNumber: "DZ-PSY-2014-08821", yearsExperience: 9,
    languages: ["Arabic", "French", "English"], university: "University of Algiers 1", graduationYear: 2012,
    currentWorkplace: "Clinique El Azhar — Algiers", sessionRate: 4500,
    bio: "CBT-focused clinician with 9 years treating adult anxiety, OCD and depressive disorders. Trained in EMDR (level 1).",
    references: [
      { name: "Pr. Karim Belhadj", role: "Head of Psychiatry, CHU Mustapha", contact: "k.belhadj@chu-alger.dz" },
      { name: "Dr. Lila Saidi", role: "Supervising clinician", contact: "+213 555 88 22 11" },
    ],
    docs: baseDocs(d(-1, 9)),
  },
  {
    id: "v2", name: "Dr. Selma Belkacem", specialty: "Trauma & PTSD", submitted: d(-2, 14), status: "in_review", documents: 6,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop",
    email: "selma.belkacem@example.dz", phone: "+213 661 44 21 09", city: "Oran", address: "47 Bd Emir Abdelkader, Oran",
    dob: "1983-09-02", gender: "Female", licenseNumber: "DZ-PSY-2011-04412", yearsExperience: 12,
    languages: ["Arabic", "French"], university: "University of Oran 2", graduationYear: 2009,
    currentWorkplace: "Centre Avicenne — Oran", sessionRate: 5000,
    bio: "Trauma specialist (EMDR, somatic experiencing). Works with first responders and survivors of intimate-partner violence.",
    references: [
      { name: "Dr. Mohamed Tahar", role: "Director, Centre Avicenne", contact: "m.tahar@avicenne.dz" },
    ],
    docs: baseDocs(d(-2, 14)),
  },
  {
    id: "v3", name: "Dr. Hocine Drif", specialty: "Couples therapy", submitted: d(-3, 11), status: "pending", documents: 5,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&h=160&fit=crop",
    email: "hocine.drif@example.dz", phone: "+213 770 19 55 02", city: "Constantine", address: "8 Rue Larbi Ben M'hidi, Constantine",
    dob: "1979-12-21", gender: "Male", licenseNumber: "DZ-PSY-2008-00219", yearsExperience: 15,
    languages: ["Arabic", "French", "Berber"], university: "University Mentouri Constantine", graduationYear: 2005,
    currentWorkplace: "Private practice", sessionRate: 5500,
    bio: "Systemic and Gottman-method couples therapist. 15 years working with bilingual Arabic/French couples.",
    references: [{ name: "Dr. Yasmina Cherif", role: "Colleague", contact: "y.cherif@example.dz" }],
    docs: baseDocs(d(-3, 11)).slice(0, 5),
  },
  {
    id: "v4", name: "Dr. Meriem Zerrouki", specialty: "Adolescents", submitted: d(-4, 16), status: "pending", documents: 6,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop",
    email: "meriem.zerrouki@example.dz", phone: "+213 540 73 88 14", city: "Annaba", address: "23 Cours de la Révolution, Annaba",
    dob: "1989-06-30", gender: "Female", licenseNumber: "DZ-PSY-2016-11034", yearsExperience: 7,
    languages: ["Arabic", "French", "English"], university: "Badji Mokhtar University", graduationYear: 2014,
    currentWorkplace: "School counsellor — Lycée Pierre & Marie Curie", sessionRate: 3800,
    bio: "Child and adolescent psychologist, art-therapy certified. Focus on school refusal, anxiety and identity issues.",
    references: [
      { name: "Mme. Fatima Boudjelal", role: "School principal", contact: "f.boudjelal@academie.dz" },
      { name: "Dr. Samir Haddad", role: "Clinical supervisor", contact: "s.haddad@example.dz" },
    ],
    docs: baseDocs(d(-4, 16)),
  },
];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "psychologist" | "admin";
  joined: string;
  status: "active" | "suspended";
};

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Yacine Meziane", email: "yacine@example.dz", role: "patient", joined: d(-30, 9), status: "active" },
  { id: "u2", name: "Dr. Sarah Rahmani", email: "sarah@example.dz", role: "psychologist", joined: d(-90, 9), status: "active" },
  { id: "u3", name: "Nour Brahimi", email: "nour@example.dz", role: "patient", joined: d(-12, 9), status: "active" },
  { id: "u4", name: "Dr. Amina Khelifi", email: "amina@example.dz", role: "psychologist", joined: d(-180, 9), status: "active" },
  { id: "u5", name: "Walid Bouzid", email: "walid@example.dz", role: "patient", joined: d(-6, 9), status: "suspended" },
];

export const messages = [
  { id: "m1", from: "Dr. Sarah Rahmani", preview: "Looking forward to our session today.", time: "10:24", unread: true },
  { id: "m2", from: "PsyConnect Support", preview: "Your payment method was updated.", time: "Yesterday", unread: false },
  { id: "m3", from: "Dr. Amina Khelifi", preview: "Sharing a breathing exercise we discussed.", time: "Mon", unread: false },
];

export const sessionNotes = [
  { id: "n1", patient: "Yacine Meziane", date: d(-7, 14), summary: "Continued CBT for work-related anxiety. Homework: thought log." },
  { id: "n2", patient: "Nour Brahimi", date: d(-10, 16), summary: "Discussed boundaries with family. Plan to revisit next week." },
  { id: "n3", patient: "Hadjer Khelil", date: d(-14, 11), summary: "EMDR session 6. Reduced SUDS from 7 to 3." },
];

export const reportSeries = [
  { month: "Jan", sessions: 420, revenue: 1890000 },
  { month: "Feb", sessions: 510, revenue: 2295000 },
  { month: "Mar", sessions: 640, revenue: 2880000 },
  { month: "Apr", sessions: 720, revenue: 3240000 },
  { month: "May", sessions: 810, revenue: 3645000 },
  { month: "Jun", sessions: 940, revenue: 4230000 },
];

export const contentItems = [
  { id: "c1", title: "How to prepare for your first session", type: "Article", updated: d(-3, 9), published: true },
  { id: "c2", title: "Understanding panic attacks", type: "Guide", updated: d(-10, 9), published: true },
  { id: "c3", title: "Crisis hotlines in Algeria", type: "Resource", updated: d(-20, 9), published: false },
];
