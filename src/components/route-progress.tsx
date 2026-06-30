import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Slim top progress bar that reflects TanStack Router pending state.
 * Gives instant visual feedback so route switches feel snappier.
 */
export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number;
    let timer: ReturnType<typeof setTimeout>;
    if (isLoading) {
      setVisible(true);
      setProgress(15);
      const tick = () => {
        setProgress((p) => (p < 85 ? p + (90 - p) * 0.08 : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isLoading, visible]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-gradient-primary shadow-[0_0_10px_oklch(0.72_0.11_190)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
