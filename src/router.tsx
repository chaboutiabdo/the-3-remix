import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DashboardPageSkeleton, NotFoundPage, RouteErrorBoundary } from "./components/page-states";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: DashboardPageSkeleton,
    defaultPendingMs: 150,
    defaultPendingMinMs: 400,
    defaultErrorComponent: RouteErrorBoundary,
    defaultNotFoundComponent: NotFoundPage,
  });

  return router;
};

