import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";

export const Route = createFileRoute("/psychologist")({
  component: () => (
    <RoleGuard role="psychologist">
      <AppShell role="psychologist">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});
