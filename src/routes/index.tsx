import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingPageSkeleton } from "@/components/page-states";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  FileLock2,
  Globe,
  HeartPulse,
  Lock,
  MessageCircle,
  Minus,
  MonitorSmartphone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserCheck,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PsyConnect — Mental wellbeing, in motion." },
      {
        name: "description",
        content:
          "An immersive space to find verified psychologists in Algeria. Secure video, audio and messaging — designed with the calm of a clinician's office and the craft of great software.",
      },
    ],
  }),
  component: Landing,
  pendingComponent: LandingPageSkeleton,
});

/* ============================================================
   ROOT
   ============================================================ */

function Landing() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground">
      <ScrollProgressBar />
      <Nav />
      <main className="relative">
        <Hero />
        <Manifesto />
        <Journey />
        <Capabilities />
        <ForClinicians />
        <TrustBand />
        <Voices />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}


/* ============================================================
   AMBIENT: cursor + scroll progress
   ============================================================ */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-primary-glow to-coral"
    />
  );
}

function AmbientCursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.4 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[55] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 mix-blend-plus-lighter"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, oklch(0.62 0.18 255 / 0.18) 0%, oklch(0.74 0.15 35 / 0.10) 35%, transparent 65%)",
        filter: "blur(20px)",
      }}
    />
  );
}

/* ============================================================
   NAV — transparent → glass, magnetic CTA
   ============================================================ */

const navLinks = [
  { to: "/patient/find", label: "Find care" },
  { to: "/#journey", label: "The journey", hash: true },
  { to: "/onboarding/welcome", label: "For clinicians" },
  { to: "/faq", label: "FAQ" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow] duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/60 shadow-[0_1px_20px_-12px_oklch(0.3_0.05_250/0.35)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <BrandLogo className="transition-transform duration-500 group-hover:rotate-[8deg]" />
          <span className="text-base font-semibold tracking-tight text-primary">PsyConnect</span>
        </Link>
        <nav className="ms-auto hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          {navLinks.map((l) =>
            l.hash ? (
              <a key={l.label} href={l.to} className="group relative">
                <span className="transition-colors group-hover:text-foreground">{l.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ) : (
              <Link key={l.label} to={l.to} className="group relative">
                <span className="transition-colors group-hover:text-foreground">{l.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ),
          )}
        </nav>
        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <Link
            to="/auth/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline-flex"
          >
            Login
          </Link>
          <MagneticButton
            to="/patient/find"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-shadow hover:shadow-glow"
          >
            Book a session
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

function MagneticButton({
  to,
  className,
  children,
  strength = 18,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set(((e.clientX - cx) / r.width) * strength * 2);
    y.set(((e.clientY - cy) / r.height) * strength * 2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span style={{ x: sx, y: sy }} className="inline-block">
      <Link ref={ref} to={to} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}

/* ============================================================
   HERO — full-viewport cinematic video intro
   ============================================================ */

const HERO_VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
const HERO_POSTER =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80";


function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 140]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.06, 1.18]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) {
      setVideoReady(true);
      tryPlay();
    } else {
      v.addEventListener("loadeddata", () => {
        setVideoReady(true);
        tryPlay();
      }, { once: true });
    }
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* Cinematic background */}
      <motion.div
        aria-hidden
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0 -z-20"
      >
        <img
          src={HERO_POSTER}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
        />
        {!reduced && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            src={HERO_VIDEO_SRC}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
      </motion.div>

      {/* Cinematic overlays for text legibility (tuned for both light + dark) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,14,22,0.55)_55%,rgba(6,10,16,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/80"
      />
      {/* Brand tint keeps hero premium in both themes */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.22_0.06_255/0.35)_0%,transparent_35%,oklch(0.18_0.05_255/0.45)_100%)]"
      />
      {/* Smooth blend into the next section — kills the hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-background"
      />


      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 shadow-[0_4px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Verified psychologists across Algeria
        </motion.span>

        <KineticHeadline
          className="mt-8 max-w-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white text-[clamp(2.75rem,8vw,7rem)] [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]"
          lines={[
            { text: "Mental wellbeing," },
            { text: "in motion.", gradient: true },
          ]}
        />

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl [text-shadow:0_1px_20px_rgba(0,0,0,0.35)]"
        >
          An immersive space to meet the right psychologist — secure video, audio and messaging,
          designed with the calm of a clinician's office and the craft of great software.
        </motion.p>
      </motion.div>

      {/* Bottom-center floating CTA + scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-6 px-4 sm:bottom-14"
      >
        <MagneticButton
          to="/patient/find"
          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/40 transition-shadow hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)] sm:text-base"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            Begin your journey
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
        </MagneticButton>

        <ScrollHint />
      </motion.div>
    </section>
  );
}

function KineticHeadline({
  lines,
  className = "",
}: {
  lines: { text: string; gradient?: boolean }[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  let wordIndex = 0;
  return (
    <h1 className={className} aria-label={lines.map((l) => l.text).join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.12em]">
          <span
            className={
              line.gradient
                ? "bg-gradient-to-br from-white via-primary-glow to-coral bg-clip-text text-transparent"
                : ""
            }
          >
            {line.text.split(/(\s+)/).map((w, wi) => {
              if (!w.trim()) return <span key={wi}>{w}</span>;
              const idx = wordIndex++;
              if (reduced) return <span key={wi} className="inline-block">{w}</span>;
              return (
                <motion.span
                  key={wi}
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, y: "0.9em", scale: 0.82, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.05,
                    delay: 0.22 + idx * 0.09 + li * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden
                >
                  {w}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </h1>
  );
}

function ScrollHint() {
  const reduced = useReducedMotion();
  return (
    <motion.a
      href="#manifesto"
      aria-label="Scroll to explore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/70 transition-colors hover:text-white"
    >
      <span>Scroll</span>
      <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-white/40">
        <motion.span
          className="mt-1 h-1.5 w-1 rounded-full bg-white/80"
          animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.a>
  );
}

/* ============================================================
   MANIFESTO — sticky, word-by-word progress reveal
   ============================================================ */

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const words =
    "We built PsyConnect for the quiet moment before you reach out — so finding the right psychologist feels less like a search, and more like an exhale.".split(
      " ",
    );

  return (
    <section
      id="manifesto"
      ref={ref}
      className="relative"
      style={{ minHeight: "130vh" }}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-surface-soft to-background" />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-[420px] w-[420px] rounded-full bg-coral/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Manifesto
          </span>
          <p className="mt-8 text-[clamp(1.75rem,4.6vw,3.75rem)] font-medium leading-[1.12] tracking-[-0.02em]">
            {words.map((w, i) => (
              <ManifestoWord key={i} progress={scrollYProgress} index={i} total={words.length}>
                {w}{" "}
              </ManifestoWord>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function ManifestoWord({
  children,
  progress,
  index,
  total,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Opacity-only reveal — no per-word blur (blur during scroll kills FPS).
  const span = 0.55 / total;
  const p1 = 0.2 + index * span;
  const p2 = p1 + span * 2.2;
  const opacity = useTransform(progress, [p1, p2], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}


/* ============================================================
   JOURNEY — natural scrolling path with soft reveal cards
   ============================================================ */

const journeySteps = [
  {
    title: "Sign in with calm.",
    body: "A single, private account. No inbox spam, no dark patterns. Just a door that opens gently.",
    tag: "01 · Arrive",
  },
  {
    title: "Meet the right clinician.",
    body: "Filter by specialty, language and approach. Every profile is human-verified by our medical team.",
    tag: "02 · Match",
  },
  {
    title: "Book in under a minute.",
    body: "Pick a slot online or in-person. Reschedule freely — life doesn't move in a straight line.",
    tag: "03 · Book",
  },
  {
    title: "Meet, encrypted end-to-end.",
    body: "Video, audio or chat. No downloads. Your words stay yours; the platform never listens.",
    tag: "04 · Meet",
  },
  {
    title: "Keep going, at your pace.",
    body: "Messages between sessions, gentle reminders, shared notes. Continuity, without pressure.",
    tag: "05 · Continue",
  },
];

function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const railScale = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.35 });

  return (
    <section
      id="journey"
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-surface-soft/70 to-background" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(300px,0.95fr)_1.5fr] lg:gap-16">
        {/* LEFT — heading + rail (sticky so it spans the full card stack) */}
        <div className="flex flex-col lg:sticky lg:top-24 lg:self-start lg:pt-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary backdrop-blur">
            The journey
          </span>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.02em] md:text-5xl lg:text-6xl">
            From first spark, <br className="hidden md:block" />
            <span className="bg-gradient-to-br from-primary via-primary-glow to-coral bg-clip-text text-transparent">
              to steady footing.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            A simple path through care — clear, calm and easy to follow. Five quiet
            steps, at your pace, with a human on the other side of every one.
          </p>

          <div className="mt-10 hidden items-start gap-5 md:flex">
            <div className="relative mt-2 h-80 w-[2px] overflow-hidden rounded-full bg-border">
              <motion.div
                style={{ scaleY: railScale }}
                className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-primary via-primary-glow to-coral"
              />
            </div>
            <ol className="space-y-5 text-sm text-muted-foreground/80">
              {journeySteps.map((s) => (
                <li key={s.tag} className="group flex flex-col gap-1 transition-colors hover:text-foreground">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">{s.tag}</span>
                  <span className="text-sm text-foreground/70 group-hover:text-foreground">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 hidden max-w-sm rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur lg:block">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Private by design.</span>{" "}
              Every step above is encrypted end-to-end and reviewed by our clinical team.
            </p>
          </div>
        </div>

        {/* RIGHT — normal document-flow cards */}
        <div className="grid gap-5 sm:gap-6">
          {journeySteps.map((s, i) => (
            <motion.article
              key={s.tag}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
              transition={{ duration: 0.7, delay: Math.min(i * 0.05, 0.18), ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2rem] border border-border bg-card/90 p-7 shadow-elegant backdrop-blur transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow md:p-10"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-coral/10 blur-3xl" />
              <div className="relative">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{s.tag}</span>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <StepDots active={i} total={journeySteps.length} />
                  <span>
                    {i + 1} of {journeySteps.length}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === active ? "w-8 bg-primary" : "w-1.5 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

/* ============================================================
   CAPABILITIES — marquee + grid
   ============================================================ */

const capabilities = [
  { icon: Video, label: "Video consults" },
  { icon: MessageCircle, label: "Secure messaging" },
  { icon: CalendarClock, label: "Instant booking" },
  { icon: FileLock2, label: "Sealed records" },
  { icon: BadgeCheck, label: "Verified clinicians" },
  { icon: MonitorSmartphone, label: "Any device" },
  { icon: HeartPulse, label: "Personalized care" },
  { icon: ShieldCheck, label: "Encrypted rooms" },
  { icon: UserCheck, label: "Identity checks" },
  { icon: Globe, label: "AR · FR · EN" },
];

function Capabilities() {
  return (
    <section className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Everything, quietly"
          title="A complete toolkit — that stays out of the way."
          sub="Purpose-built for the two people who matter most: the patient, and the clinician."
        />
      </div>
      <div className="group relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex overflow-hidden">
          <div className="flex min-w-full shrink-0 animate-marquee items-center gap-4 pe-4 group-hover:[animation-play-state:paused]">
            {capabilities.concat(capabilities).map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
          <div
            aria-hidden
            className="flex min-w-full shrink-0 animate-marquee items-center gap-4 pe-4 group-hover:[animation-play-state:paused]"
          >
            {capabilities.concat(capabilities).map(({ icon: Icon, label }, i) => (
              <div
                key={`b-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOR CLINICIANS — split
   ============================================================ */

function ForClinicians() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/25 bg-coral/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-coral">
            <Stethoscope className="h-3.5 w-3.5" /> For clinicians
          </span>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
            Run your practice, <br />
            <span className="bg-gradient-to-br from-coral via-primary-glow to-primary bg-clip-text text-transparent">
              from anywhere calm.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Availability, records, secure consultations — one uncluttered workspace. PsyConnect handles
            the admin so you can hold space for what matters.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Professional profile",
              "Appointment management",
              "Secure messaging",
              "Online consultations",
              "Availability calendar",
              "Patient records",
              "Verification system",
              "Payouts in DZD",
            ].map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm shadow-soft backdrop-blur"
              >
                <BadgeCheck className="h-4 w-4 text-primary" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <MagneticButton
              to="/onboarding/welcome"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-shadow hover:shadow-glow"
            >
              <Stethoscope className="h-4 w-4" /> Join as a psychologist
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ClinicianDashboard />
        </Reveal>
      </div>
    </section>
  );
}

function ClinicianDashboard() {
  return (
    <div className="relative rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 via-accent/10 to-card p-6 shadow-elegant">
      <div className="rounded-2xl bg-card/95 p-5 shadow-soft backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Today</div>
            <div className="text-lg font-semibold">3 sessions · 1 new patient</div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Online
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm">
          {[
            { n: "Yacine M.", t: "14:00", tag: "Video" },
            { n: "Nour B.", t: "16:30", tag: "Video" },
            { n: "Karim & Sara", t: "Tomorrow", tag: "In-person" },
          ].map((x, i) => (
            <motion.div
              key={x.n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-primary" />
                <span className="font-medium">{x.n}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{x.tag}</span>
                <span>{x.t}</span>
              </div>
            </motion.div>
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
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{m.k}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
    </div>
  );
}

/* ============================================================
   TRUST BAND — stats + security
   ============================================================ */

function TrustBand() {
  const stats = [
    { v: 500, suffix: "+", label: "Verified psychologists" },
    { v: 5000, suffix: "+", label: "Patients supported" },
    { v: 20000, suffix: "+", label: "Consultations held" },
    { v: 98, suffix: "%", label: "Patient satisfaction" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-soft py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          eyebrow="By the numbers"
          title="Trusted, quietly and consistently."
          sub="Growth we're proud of — because it means more people got help."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-border bg-card/80 p-6 text-center shadow-soft backdrop-blur"
            >
              <div className="bg-gradient-to-br from-primary via-primary-glow to-coral bg-clip-text text-5xl font-semibold tracking-[-0.02em] text-transparent md:text-6xl">
                <Counter to={s.v} />
                {s.suffix}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Lock, t: "End-to-end encrypted" },
            { icon: ShieldCheck, t: "Private by default" },
            { icon: FileLock2, t: "Records stay sealed" },
          ].map(({ icon: Icon, t }) => (
            <div
              key={t}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{t}</div>
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
          const dur = 1600;
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

/* ============================================================
   VOICES — testimonial snap gallery
   ============================================================ */

function Voices() {
  const voices = [
    {
      n: "Amel K.",
      r: "Patient · Algiers",
      q: "I felt heard from the very first session. Booking was effortless and the video was crystal clear.",
      a: "AK",
    },
    {
      n: "Dr. Hicham R.",
      r: "Psychologist · Oran",
      q: "The dashboard is calm and well thought out. I finally spend my time with patients, not on admin.",
      a: "HR",
    },
    {
      n: "Sofiane M.",
      r: "Patient · Constantine",
      q: "Knowing my data is private made it so much easier to open up. Highly recommended.",
      a: "SM",
    },
    {
      n: "Dr. Lina B.",
      r: "Psychologist · Annaba",
      q: "It feels like the platform was designed by people who understand clinical work.",
      a: "LB",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Voices"
          title="Held by clinicians. Loved by patients."
          sub="A few words from people already on the journey."
        />
      </div>
      <div className="mt-12 overflow-x-auto pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex max-w-none snap-x snap-mandatory gap-5 px-4 sm:px-6">
          {voices.map((v, i) => (
            <motion.figure
              key={v.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-[85%] max-w-md flex-shrink-0 snap-center rounded-[2rem] border border-border bg-card/90 p-8 shadow-soft backdrop-blur transition-shadow hover:shadow-elegant sm:w-[440px]"
            >
              <div className="flex items-center gap-1 text-coral">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-lg leading-relaxed text-foreground/90">
                "{v.q}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                  {v.a}
                </div>
                <div>
                  <div className="text-sm font-semibold">{v.n}</div>
                  <div className="text-xs text-muted-foreground">{v.r}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */

function FAQ() {
  const faqs = [
    { q: "How do I book an appointment?", a: "Create your account, browse verified psychologists, pick a time slot and confirm — it takes less than two minutes." },
    { q: "How are psychologists verified?", a: "Every clinician's license and credentials are personally reviewed by our medical team before they appear on the platform." },
    { q: "Are consultations confidential?", a: "Yes. All sessions are end-to-end encrypted and your records are only shared with your assigned psychologist." },
    { q: "Can I cancel an appointment?", a: "You can reschedule or cancel from your dashboard up to 24 hours before the session at no cost." },
    { q: "Does it work on mobile?", a: "PsyConnect works beautifully on mobile, tablet and desktop — including video and audio sessions." },
    { q: "How do online consultations work?", a: "At your scheduled time, join a secure video room from your dashboard — no downloads required." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <SectionHead center eyebrow="FAQ" title="Small questions, honest answers." />
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-soft backdrop-blur transition-colors hover:border-primary/30"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold sm:text-base">{f.q}</span>
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                >
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
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

/* ============================================================
   FINAL CTA — kinetic close
   ============================================================ */

function FinalCTA() {
  return (
    <section className="relative px-4 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] border border-primary/25 bg-gradient-primary p-12 text-primary-foreground shadow-elegant md:p-20"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-coral/30 blur-3xl animate-blob"
          style={{ animationDelay: "-6s" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em]">
            <Sparkles className="h-3.5 w-3.5" /> Ready when you are
          </span>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
            Take the first step, <br />
            without leaving your seat.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85 md:text-xl">
            Thousands across Algeria are already getting confidential, professional support — on their own
            terms. Your turn.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton
              to="/patient/find"
              className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-4 text-sm font-semibold text-primary shadow-elegant transition-shadow hover:shadow-glow"
            >
              Book a session <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <Link
              to="/onboarding/welcome"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-white/20"
            >
              Join as a psychologist
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5">
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
            <button className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-shadow hover:shadow-glow">
              Subscribe
            </button>
          </form>
        </div>

        <FooterCol
          title="Platform"
          links={[
            { to: "/patient/find", label: "Find a psychologist" },
            { to: "/onboarding/welcome", label: "Become a psychologist" },
            { to: "/faq", label: "FAQ" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { to: "/about", label: "About" },
            { to: "/mission", label: "Mission" },
            { to: "/contact", label: "Contact" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <div>© {new Date().getFullYear()} PsyConnect. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 transition-colors hover:bg-accent">
              <Globe className="h-3.5 w-3.5" /> English
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-foreground/80 transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   SHARED
   ============================================================ */

function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
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
      initial={reduced ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary backdrop-blur"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-lg text-muted-foreground"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
