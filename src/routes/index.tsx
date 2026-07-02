import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarCheck,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  FileLock2,
  FileText,
  Globe,
  HeartPulse,
  Lock,
  MessageCircle,
  Mic,
  Minus,
  MonitorSmartphone,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
  type TargetAndTransition,
} from "framer-motion";
import therapyHero from "@/assets/therapy-hero.jpg";

/** Cinematic word-by-word headline reveal (blur → sharp, scale 0.8 → 1, from below). */
function AnimatedHeadline({
  lines,
  className = "",
}: {
  lines: Array<Array<{ text: string; gradient?: boolean }>>;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <h1 className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.map((seg, si) => (
              <span
                key={si}
                className={
                  seg.gradient
                    ? "bg-gradient-to-r from-primary via-primary-glow to-coral bg-clip-text text-transparent"
                    : ""
                }
              >
                {seg.text}
              </span>
            ))}
          </span>
        ))}
      </h1>
    );
  }

  let wordIndex = 0;
  return (
    <h1 className={className} aria-label={lines.map((l) => l.map((s) => s.text).join("")).join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-1">
          {line.map((seg, si) => {
            const words = seg.text.split(/(\s+)/); // keep spaces
            return (
              <span
                key={si}
                className={
                  seg.gradient
                    ? "bg-gradient-to-r from-primary via-primary-glow to-coral bg-clip-text text-transparent"
                    : ""
                }
              >
                {words.map((w, wi) => {
                  if (!w.trim()) return <span key={wi}>{w}</span>;
                  const idx = wordIndex++;
                  return (
                    <motion.span
                      key={wi}
                      className="inline-block will-change-transform"
                      initial={{ opacity: 0, y: "0.6em", scale: 0.8, filter: "blur(12px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.9,
                        delay: 0.15 + idx * 0.07 + li * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      aria-hidden
                    >
                      {w}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Re-triggers its child animation on every mouseenter by bumping a key. */
function HoverReplay({
  children,
  animation = "bounce",
  className,
}: {
  children: React.ReactNode;
  animation?: "bounce" | "wobble" | "pop" | "spin";
  className?: string;
}) {
  const [k, setK] = useState(0);
  const reduced = useReducedMotion();
  const variants: Record<string, TargetAndTransition> = {
    bounce: { y: [0, -10, 0, -5, 0], transition: { duration: 0.7, ease: "easeOut" } },
    wobble: { rotate: [0, -12, 10, -6, 4, 0], transition: { duration: 0.7 } },
    pop: { scale: [1, 1.25, 0.95, 1.1, 1], transition: { duration: 0.6 } },
    spin: { rotate: [0, 360], transition: { duration: 0.8, ease: "easeInOut" } },
  };
  if (reduced) return <span className={className}>{children}</span>;
  return (
    <motion.span
      className={`inline-flex ${className ?? ""}`}
      onMouseEnter={() => setK((v) => v + 1)}
      onTouchStart={() => setK((v) => v + 1)}
    >
      <motion.span key={k} animate={variants[animation]} className="inline-flex">
        {children}
      </motion.span>
    </motion.span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PsyConnect — Your Mental Wellbeing Starts Here" },
      {
        name: "description",
        content:
          "Connect with verified psychologists through a secure, confidential platform. Book online or in-person sessions in minutes.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <main>
        <Hero />
        <TrustIndicators />
        <WhyChoose />
        <HowItWorks />
        <ForPsychologists />
        <Features />
        <Security />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ----------------------------- NAV ----------------------------- */

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/patient/find", label: "Find a Psychologist" },
  { to: "/#how", label: "How It Works", hash: true },
  { to: "/onboarding/welcome", label: "For Psychologists" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo />
          <span className="text-base font-semibold tracking-tight text-primary">PsyConnect</span>
        </Link>
        <nav className="ms-auto hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {navLinks.map((l) =>
            l.hash ? (
              <a key={l.label} href={l.to} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.to} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <Link
            to="/auth/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors sm:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-accent transition-colors sm:inline-flex"
          >
            Register
          </Link>
          <Link
            to="/patient/find"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
          >
            Book an Appointment
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const visualScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.06]);
  const visualRotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -3]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-hero" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      {/* floating shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-20 -z-10 h-80 w-80 rounded-full bg-coral/15 blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-success/15 blur-3xl animate-blob" style={{ animationDelay: "-8s" }} />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-xs font-medium text-primary shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-coral animate-pulse" /> A calmer way to find care
          </motion.span>

          <AnimatedHeadline
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
            lines={[
              [{ text: "Your Mental Wellbeing" }],
              [{ text: "Starts Here.", gradient: true }],
            ]}
          />

          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Connect with verified psychologists through a secure and confidential platform designed to support
            your mental health journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>
              <Link
                to="/patient/find"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-shadow hover:shadow-glow"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Book an Appointment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>
              <Link
                to="/patient/find"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
              >
                Find a Psychologist
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-success" /> Licensed clinicians</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary" /> End-to-end encrypted</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4 text-coral" /> AR · FR · EN</span>
          </motion.div>
        </div>

        <motion.div
          style={{ y: visualY, scale: visualScale, rotate: visualRotate }}
          initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 120, damping: 14 });
  const rotateX = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 14 });
  const tx = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 120, damping: 16 });
  const ty = useSpring(useTransform(my, [-1, 1], [-10, 10]), { stiffness: 120, damping: 16 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-lg [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateY, rotateX }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-accent p-3 shadow-elegant animate-floaty [transform-style:preserve-3d]"
      >
        <motion.img
          src={therapyHero}
          alt="Online therapy session with a verified psychologist"
          width={1280}
          height={1024}
          className="block w-full rounded-[1.5rem] object-cover"
          initial={{ scale: 1.08, opacity: 0, filter: "blur(14px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
        />
        <span className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/30" />
        {/* subtle sheen tracking the cursor */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_var(--px,50%)_var(--py,50%),rgba(255,255,255,0.18),transparent_55%)]"
          style={{
            // @ts-expect-error CSS vars via motion values
            "--px": useTransform(mx, [-1, 1], ["10%", "90%"]),
            // @ts-expect-error CSS vars via motion values
            "--py": useTransform(my, [-1, 1], ["10%", "90%"]),
          }}
        />
      </motion.div>

      {/* floating cards — subtle mouse parallax */}
      <motion.div style={{ x: tx, y: ty }} className="absolute inset-0 pointer-events-none">
        <FloatCard className="-left-4 top-8 sm:-left-10" delay={0}>
          <HoverReplay animation="pop"><BadgeCheck className="h-4 w-4 text-success" /></HoverReplay> Verified Psychologists
        </FloatCard>
        <FloatCard className="-right-2 top-32 sm:-right-8" delay={0.6}>
          <HoverReplay animation="wobble"><ShieldCheck className="h-4 w-4 text-primary" /></HoverReplay> Secure Consultations
        </FloatCard>
        <FloatCard className="-left-2 bottom-24 sm:-left-12" delay={1.2}>
          <HoverReplay animation="bounce"><FileLock2 className="h-4 w-4 text-coral" /></HoverReplay> Confidential Data
        </FloatCard>
        <FloatCard className="-right-2 -bottom-2 sm:-right-10" delay={1.8}>
          <HoverReplay animation="spin"><MonitorSmartphone className="h-4 w-4 text-primary" /></HoverReplay> Online & In-Person
        </FloatCard>
      </motion.div>
    </div>
  );
}

function FloatCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6 + delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute hidden items-center gap-2 rounded-2xl border border-border bg-card/90 px-3 py-2 text-xs font-medium shadow-elegant backdrop-blur md:inline-flex animate-floaty ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------- TRUST INDICATORS ----------------------- */

function TrustIndicators() {
  const trust = [
    { icon: BadgeCheck, label: "Verified Professionals" },
    { icon: ShieldCheck, label: "Secure Platform" },
    { icon: Lock, label: "Confidential Consultations" },
    { icon: CalendarCheck, label: "Fast Appointment Booking" },
    { icon: HeartPulse, label: "Responsive Support" },
  ];
  const stats = [
    { v: 500, suffix: "+", label: "Psychologists" },
    { v: 5000, suffix: "+", label: "Patients" },
    { v: 20000, suffix: "+", label: "Consultations" },
    { v: 98, suffix: "%", label: "Patient Satisfaction" },
  ];
  return (
    <section className="border-y border-border bg-surface-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trust.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="bg-gradient-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                <Counter to={s.v} />{s.suffix}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const dur = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

/* --------------------------- WHY CHOOSE --------------------------- */

function WhyChoose() {
  const items = [
    { icon: BadgeCheck, title: "Verified Psychologists", body: "Every clinician is license-checked and personally vetted by our medical team.", tone: "primary" },
    { icon: ShieldCheck, title: "Private & Secure", body: "End-to-end encrypted video, messaging and records — your story stays yours.", tone: "coral" },
    { icon: CalendarClock, title: "Book in Minutes", body: "Browse availability and confirm an appointment in under two minutes.", tone: "success" },
    { icon: MonitorSmartphone, title: "Flexible Consultations", body: "Online or in-person, on any device — pick the format that fits your life.", tone: "primary" },
    { icon: HeartPulse, title: "Personalized Care", body: "Get matched to clinicians who specialize in what you're going through.", tone: "coral" },
    { icon: Stethoscope, title: "Professional Support", body: "Licensed psychologists across Algeria, ready to walk with you.", tone: "success" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Why PsyConnect" title="Care that feels human, built like premium software." sub="A calm, modern space designed around how mental health support actually works." />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {items.map(({ icon: Icon, title, body, tone }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
            <HoverReplay animation="bounce">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${toneBg(tone)}`}>
                <Icon className="h-5 w-5" />
              </div>
            </HoverReplay>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function toneBg(tone: string) {
  if (tone === "coral") return "bg-coral/15 text-coral";
  if (tone === "success") return "bg-success/15 text-success";
  return "bg-primary/10 text-primary";
}

/* --------------------------- HOW IT WORKS --------------------------- */

function HowItWorks() {
  const steps = [
    { t: "Create Your Account", b: "Sign up in under a minute with email or phone." },
    { t: "Complete Your Profile", b: "Tell us a little about what you're looking for." },
    { t: "Find a Psychologist", b: "Browse verified profiles, specialties and languages." },
    { t: "Book an Appointment", b: "Pick a time that fits your schedule — online or in-person." },
    { t: "Attend Your Consultation", b: "Join a secure video call or meet at the clinic." },
    { t: "Continue Your Journey", b: "Message, follow up, and book recurring sessions easily." },
  ];
  return (
    <section id="how" className="border-y border-border bg-surface-soft">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="How it works" title="Your patient journey." sub="Six small steps from sign-up to ongoing care." />
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((s, i) => (
            <motion.li
              key={s.t}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant"
            >
              <div className="flex items-center gap-4">
                <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground shadow-soft">
                  {String(i + 1).padStart(2, "0")}
                  <span className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 transition group-hover:ring-primary/30" />
                </div>
                <h3 className="text-base font-semibold">{s.t}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -bottom-4 left-10 hidden h-4 w-px bg-gradient-to-b from-primary/40 to-transparent lg:block" />
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ----------------------- FOR PSYCHOLOGISTS ----------------------- */

function ForPsychologists() {
  const benefits = [
    "Professional profile",
    "Appointment management",
    "Secure messaging",
    "Online consultations",
    "Availability calendar",
    "Patient management",
    "Verification system",
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
            <Stethoscope className="h-3.5 w-3.5" /> For Clinicians
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            Run your practice from anywhere.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Manage availability, patient records and secure consultations in one calm workspace. PsyConnect
            handles the admin so you can focus on care.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-primary" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/onboarding/welcome"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-shadow"
            >
              <Stethoscope className="h-4 w-4" /> Join as a Psychologist
            </Link>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-accent to-card p-6 shadow-elegant">
      <div className="rounded-2xl bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Today</div>
            <div className="text-lg font-semibold">3 sessions · 1 new patient</div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm">
          {[
            { n: "Yacine M.", t: "14:00", tag: "Video" },
            { n: "Nour B.", t: "16:30", tag: "Video" },
            { n: "Karim & Sara", t: "Tomorrow", tag: "In-person" },
          ].map((x) => (
            <div key={x.n} className="flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-primary" />
                <span className="font-medium">{x.n}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{x.tag}</span>
                <span>{x.t}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { k: "Sessions", v: "128" },
            { k: "Rating", v: "4.9" },
            { k: "Payouts", v: "DZD" },
          ].map((m) => (
            <div key={m.k} className="rounded-xl border border-border p-3">
              <div className="text-base font-semibold">{m.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- FEATURES ----------------------------- */

function Features() {
  const items = [
    { icon: MessageCircle, t: "Secure Messaging" },
    { icon: Video, t: "Video Consultations" },
    { icon: Phone, t: "Audio Consultations" },
    { icon: CalendarClock, t: "Appointment Scheduling" },
    { icon: ClipboardList, t: "Patient Dashboard" },
    { icon: Stethoscope, t: "Psychologist Dashboard" },
    { icon: FileText, t: "Digital Patient File" },
    { icon: CalendarCheck, t: "Availability Management" },
    { icon: UserCheck, t: "Professional Verification" },
    { icon: Bell, t: "Notifications" },
    { icon: MonitorSmartphone, t: "Responsive Design" },
    { icon: FileLock2, t: "Medical Document Sharing" },
  ];
  return (
    <section className="border-y border-border bg-surface-soft">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Platform" title="Everything you need, nothing you don't." sub="A complete toolkit for patients and clinicians — designed to stay out of the way." />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {items.map(({ icon: Icon, t }, i) => {
            const anims = ["bounce", "wobble", "pop", "spin"] as const;
            return (
              <motion.div
                key={t}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elegant"
              >
                <HoverReplay animation={anims[i % anims.length]}>
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${["bg-primary/10 text-primary","bg-coral/15 text-coral","bg-success/15 text-success"][i % 3]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </HoverReplay>
                <h3 className="mt-4 text-sm font-semibold">{t}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Thoughtfully designed and tested with real clinicians and patients.
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ SECURITY ------------------------------ */

function Security() {
  const points = [
    { icon: Lock, t: "Encrypted communications" },
    { icon: ShieldCheck, t: "Confidential consultations" },
    { icon: BadgeCheck, t: "Verified psychologists" },
    { icon: UserCheck, t: "Secure authentication" },
    { icon: FileLock2, t: "Protected medical information" },
    { icon: HeartPulse, t: "Privacy-first design" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="relative rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-accent p-8 shadow-elegant">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Private by default</div>
                  <div className="text-xs text-muted-foreground">Your details are shared only with your assigned psychologist after an appointment is confirmed.</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {["Identity verified", "Session encrypted", "Records sealed"].map((x) => (
                  <div key={x} className="flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2 text-sm">
                    <span>{x}</span>
                    <BadgeCheck className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Security & Privacy
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            Built to protect what matters most.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            PsyConnect treats your mental health information with the same care a clinician would. Every layer
            of the platform is built around privacy.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-soft">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                <span className="text-sm font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TESTIMONIALS ---------------------------- */

function Testimonials() {
  const t = [
    { n: "Amel K.", r: "Patient", q: "I felt heard from the very first session. Booking was effortless and the video was crystal clear.", a: "AK" },
    { n: "Dr. Hicham R.", r: "Psychologist", q: "The dashboard is calm and well thought out. I finally spend my time with patients, not on admin.", a: "HR" },
    { n: "Sofiane M.", r: "Patient", q: "Knowing my data is private made it so much easier to open up. Highly recommended.", a: "SM" },
  ];
  return (
    <section className="border-y border-border bg-surface-soft">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Stories" title="Loved by patients and clinicians." />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {t.map((x) => (
            <motion.figure
              key={x.n}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant"
            >
              <div className="flex items-center gap-1 text-coral">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{x.q}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">{x.a}</div>
                <div>
                  <div className="text-sm font-semibold">{x.n}</div>
                  <div className="text-xs text-muted-foreground">{x.r}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- FAQ -------------------------------- */

function FAQ() {
  const faqs = [
    { q: "How do I book an appointment?", a: "Create your account, browse verified psychologists, pick a time slot and confirm — it takes less than two minutes." },
    { q: "How are psychologists verified?", a: "Every clinician's license and credentials are personally reviewed by our medical team before they appear on the platform." },
    { q: "Are consultations confidential?", a: "Yes. All sessions are end-to-end encrypted and your records are only shared with your assigned psychologist." },
    { q: "Can I cancel an appointment?", a: "You can reschedule or cancel from your dashboard up to 24 hours before the session at no cost." },
    { q: "Can I use my phone?", a: "PsyConnect works beautifully on mobile, tablet and desktop — including video and audio sessions." },
    { q: "How do online consultations work?", a: "At your scheduled time, join a secure video room from your dashboard — no downloads required." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="FAQ" title="Frequently asked questions." center />
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold sm:text-base">{f.q}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------- FINAL CTA ----------------------------- */

function FinalCTA() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-primary p-10 text-primary-foreground shadow-elegant md:p-16"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-coral/30 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Take the first step toward better mental health.
          </h2>
          <p className="mt-4 text-base text-primary-foreground/85 md:text-lg">
            Join thousands of people in Algeria getting confidential, professional support — on their terms.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/patient/find"
              className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-semibold text-primary shadow-elegant hover:shadow-glow transition-shadow"
            >
              Book an Appointment <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              to="/onboarding/welcome"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-white/20 transition-colors"
            >
              Join as a Psychologist
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <BrandLogo />
            <span className="font-semibold text-primary">PsyConnect</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Mental wellbeing, made accessible. Verified psychologists, secure consultations, calm software.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-border bg-card p-1 pl-4 shadow-soft"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:shadow-glow transition-shadow">
              Subscribe
            </button>
          </form>
        </div>

        <FooterCol title="Platform" links={[
          { to: "/patient/find", label: "Find a Psychologist" },
          { to: "/onboarding/welcome", label: "Become a Psychologist" },
          { to: "/faq", label: "FAQ" },
        ]} />
        <FooterCol title="Company" links={[
          { to: "/about", label: "About" },
          { to: "/mission", label: "Mission" },
          { to: "/contact", label: "Contact" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/privacy", label: "Privacy Policy" },
          { to: "/terms", label: "Terms of Service" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <div>© {new Date().getFullYear()} PsyConnect. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 hover:bg-accent transition-colors">
              <Globe className="h-3.5 w-3.5" /> English
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1">
              {[Users, Bell, MessageCircle].map((I, i) => (
                <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card hover:bg-accent transition-colors">
                  <I className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}><Link to={l.to} className="text-foreground/80 hover:text-primary transition-colors">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------ HELPERS ------------------------------ */

function SectionHead({ eyebrow, title, sub, center }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      {eyebrow && (
        <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</motion.h2>
      {sub && <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">{sub}</motion.p>}
    </motion.div>
  );
}
