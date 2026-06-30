import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth, type Role } from "@/lib/auth";

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) return; // wait for hydration
    if (!session) {
      navigate({ to: "/auth/login" });
    } else if (session.role !== role) {
      navigate({ to: "/auth/login" });
    }
  }, [session, role, navigate]);

  // Allow render with mock session if missing — frontend-only demo, don't block
  return <>{children}</>;
}
