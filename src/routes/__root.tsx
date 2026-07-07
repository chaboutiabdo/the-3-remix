import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import appCss from "../styles.css?url";
import "../i18n";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/lang";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { RouteProgress } from "@/components/route-progress";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { NotFoundPage, RouteErrorBoundary, OfflineBanner } from "@/components/page-states";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PsyConnect — Mental well-being for Algeria" },
      {
        name: "description",
        content:
          "PsyConnect connects patients in Algeria with licensed psychologists for secure online consultations.",
      },
      { property: "og:title", content: "PsyConnect — Mental well-being for Algeria" },
      {
        property: "og:description",
        content:
          "Secure video sessions, vetted clinicians, and a private space to heal — in Arabic, French or English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PsyConnect — Mental well-being for Algeria" },
      { name: "description", content: "This application displays information and allows interaction with various content elements." },
      { property: "og:description", content: "This application displays information and allows interaction with various content elements." },
      { name: "twitter:description", content: "This application displays information and allows interaction with various content elements." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7MkDFeTq2ZR3W1a0Fb3g2q31vv43/social-images/social-1782773190577-Generate__Modern_minimalist_logo_for_PsyConnect_mental_health_platform,_featuring_an_abstract_symbol_combining_a_speech_bubble_with_a_heart_shape_and_neural_connection_nodes,_clean_geometric_design,_soft_round_(1).webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7MkDFeTq2ZR3W1a0Fb3g2q31vv43/social-images/social-1782773190577-Generate__Modern_minimalist_logo_for_PsyConnect_mental_health_platform,_featuring_an_abstract_symbol_combining_a_speech_bubble_with_a_heart_shape_and_neural_connection_nodes,_clean_geometric_design,_soft_round_(1).webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ClientGate>
              <RouteProgress />
              <AnimatedOutlet />
              <Toaster position="top-right" richColors theme="system" />
            </ClientGate>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AnimatedOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "opacity, transform" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function ClientGate({ children }: { children: ReactNode }) {
  // Avoid SSR/CSR hydration mismatches caused by language/auth restored from
  // localStorage. Render an invisible background-matched placeholder — no logo,
  // no text — so users never see a splash between navigations or on first paint.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <div
        suppressHydrationWarning
        aria-hidden
        className="min-h-screen bg-background"
      />
    );
  }
  return <>{children}</>;
}


