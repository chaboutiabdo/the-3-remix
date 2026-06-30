import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";

export const Route = createFileRoute("/patient")({
  component: () => (
    <RoleGuard role="patient">
      <AppShell role="patient">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});
