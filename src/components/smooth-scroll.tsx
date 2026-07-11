import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Global Lenis smooth-scroll provider.
 * - Uses rAF; no CSS scroll-behavior conflicts.
 * - Disabled when the user prefers reduced motion.
 * - Intercepts in-page hash links so #section anchors still work smoothly.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.1,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page hash anchors
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const a = t.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
