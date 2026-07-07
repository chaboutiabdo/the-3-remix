import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Compass,
  Home,
  LifeBuoy,
  Lock,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from "lucide-react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

/* --------------------------------- Loading -------------------------------- */

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-9 w-28 rounded-full", className)} />;
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  const bars = [60, 82, 45, 90, 70, 55, 78, 95, 62, 88, 72, 84];
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft", className)}>
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 flex h-56 items-end gap-2">
        {bars.map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-md"
            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid gap-3 border-b border-border bg-muted/40 p-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid gap-3 p-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={cn("h-3", c === 0 ? "w-3/4" : c === cols - 1 ? "w-1/3" : "w-2/3")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <SkeletonAvatar className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <SkeletonButton className="h-8 w-24" />
    </div>
  );
}

export function PageSkeletonShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      {children}
      <span className="sr-only">Loading content…</span>
    </motion.div>
  );
}

/** Generic dashboard-style page skeleton (header + stats + main + side). */
export function DashboardPageSkeleton() {
  return (
    <PageSkeletonShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
        <SkeletonButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SkeletonChart className="lg:col-span-2" />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonAvatar className="h-8 w-8" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageSkeletonShell>
  );
}

export function ListPageSkeleton({ title = true, rows = 6 }: { title?: boolean; rows?: number }) {
  return (
    <PageSkeletonShell>
      {title && (
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => <SkeletonListItem key={i} />)}
      </div>
    </PageSkeletonShell>
  );
}

export function TablePageSkeleton() {
  return (
    <PageSkeletonShell>
      <div className="mb-6 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
        <SkeletonButton />
      </div>
      <SkeletonTable />
    </PageSkeletonShell>
  );
}

export function FormPageSkeleton() {
  return (
    <PageSkeletonShell>
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <SkeletonButton className="h-11 w-full" />
      </div>
    </PageSkeletonShell>
  );
}

export function MessagesPageSkeleton() {
  return (
    <PageSkeletonShell>
      <div className="mb-6 flex items-end justify-between">
        <Skeleton className="h-7 w-40" />
        <SkeletonButton />
      </div>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-border p-4 last:border-0 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Skeleton className="h-4 w-40" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className={cn("h-8", i % 2 ? "ms-auto w-2/3" : "w-1/2")} />
            ))}
          </div>
        </div>
      </div>
    </PageSkeletonShell>
  );
}

export function LandingPageSkeleton() {
  return (
    <PageSkeletonShell>
      <div className="min-h-screen bg-gradient-hero">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Skeleton className="h-8 w-32" />
          <div className="hidden gap-6 md:flex">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-3 w-16" />)}
          </div>
          <SkeletonButton />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-16 md:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-5 w-40 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-12 w-3/5" />
            </div>
            <SkeletonText lines={3} />
            <div className="flex gap-3">
              <SkeletonButton className="h-11 w-40" />
              <SkeletonButton className="h-11 w-32" />
            </div>
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        </div>
        <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      </div>
    </PageSkeletonShell>
  );
}

/* ---------------------------------- Error --------------------------------- */

type ErrorPageProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  code?: string;
  actions?: ReactNode;
};

export function ErrorPage({ title, description, icon, code, actions }: ErrorPageProps) {
  const reduce = useReducedMotion();
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
          <div className="relative grid h-20 w-20 place-items-center rounded-3xl border border-border bg-card shadow-elegant">
            {icon ?? <AlertTriangle className="h-9 w-9 text-primary" />}
          </div>
        </div>
        {code && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {code}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      </motion.div>
    </div>
  );
}

export function RetryButton({ onRetry, label = "Try again" }: { onRetry?: () => void; label?: string }) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        if (onRetry) return onRetry();
        router.invalidate();
      }}
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" /> {label}
    </Button>
  );
}

export function HomeButton() {
  return (
    <Button asChild variant="outline" className="gap-2">
      <Link to="/"><Home className="h-4 w-4" /> Go home</Link>
    </Button>
  );
}

export function SupportButton() {
  return (
    <Button asChild variant="ghost" className="gap-2">
      <Link to="/contact"><LifeBuoy className="h-4 w-4" /> Contact support</Link>
    </Button>
  );
}

/* Default router error boundary */
export function RouteErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
    reportLovableError(error, { boundary: "route_error" });
  }, [error]);

  const message = error?.message ?? "";
  const isNetwork = /network|fetch|failed to fetch|offline/i.test(message);
  const isAuth = /unauthor|401/i.test(message);
  const isForbidden = /forbid|403/i.test(message);
  const isServer = /500|server/i.test(message);

  if (isNetwork) return <NetworkErrorPage onRetry={() => { router.invalidate(); reset(); }} />;
  if (isAuth) return <UnauthorizedPage />;
  if (isForbidden) return <ForbiddenPage />;
  if (isServer) return <ServerErrorPage onRetry={() => { router.invalidate(); reset(); }} />;

  return (
    <ErrorPage
      title="This page didn't load"
      description="Something went wrong on our end. You can retry, head home, or reach out to support."
      actions={
        <>
          <RetryButton onRetry={() => { router.invalidate(); reset(); }} />
          <HomeButton />
          <SupportButton />
        </>
      }
    />
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      icon={<Compass className="h-9 w-9 text-primary" />}
      title="You seem lost"
      description="The page you're looking for doesn't exist or may have been moved."
      actions={<><HomeButton /><SupportButton /></>}
    />
  );
}

export function ServerErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      code="500"
      icon={<ServerCrash className="h-9 w-9 text-primary" />}
      title="Something went wrong"
      description="Our servers hit an unexpected issue. Please try again in a moment."
      actions={<><RetryButton onRetry={onRetry} /><HomeButton /><SupportButton /></>}
    />
  );
}

export function NetworkErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      icon={<WifiOff className="h-9 w-9 text-primary" />}
      title="Connection lost"
      description="We couldn't reach our servers. Check your internet connection and try again."
      actions={<><RetryButton onRetry={onRetry} label="Retry" /><HomeButton /></>}
    />
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      icon={<Lock className="h-9 w-9 text-primary" />}
      title="Please sign in"
      description="You need to be signed in to access this page."
      actions={
        <>
          <Button asChild><Link to="/auth/login">Sign in</Link></Button>
          <HomeButton />
        </>
      }
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      icon={<Lock className="h-9 w-9 text-primary" />}
      title="You don't have access"
      description="This area is restricted. If you think this is a mistake, contact support."
      actions={<><HomeButton /><SupportButton /></>}
    />
  );
}

/* ---------------------------- Offline detection --------------------------- */

export function OfflineBanner() {
  const [offline, setOffline] = useOnlineStatus();
  if (!offline) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive backdrop-blur"
    >
      <WifiOff className="h-3.5 w-3.5" /> You're offline — some features may be unavailable.
      <button
        onClick={() => setOffline(!navigator.onLine)}
        className="ms-2 rounded-full border border-destructive/30 px-2 py-0.5 text-[11px] hover:bg-destructive/10"
      >
        Retry
      </button>
    </div>
  );
}

function useOnlineStatus(): [boolean, (v: boolean) => void] {
  // Client-only; renders nothing during SSR
  const [offline, setOffline] = useClientState(() => typeof navigator !== "undefined" && !navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [setOffline]);
  return [offline, setOffline];
}

function useClientState<T>(init: () => T): [T, (v: T) => void] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  const [mounted, setMounted] = React.useState(false);
  const [value, setValue] = React.useState<T>(() => (undefined as unknown as T));
  React.useEffect(() => {
    setValue(init());
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [mounted ? value : (false as unknown as T), setValue];
}
