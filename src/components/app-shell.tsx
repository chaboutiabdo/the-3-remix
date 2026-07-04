import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import {
  Bell,
  CalendarDays,
  ChevronsLeft,
  ClipboardList,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { useAuth, type Role } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { to: string; label: string; icon: typeof Home };

const navByRole: Record<Role, NavItem[]> = {
  patient: [
    { to: "/patient", label: "patient.dashboard", icon: LayoutDashboard },
    { to: "/patient/find", label: "patient.find", icon: Search },
    { to: "/patient/appointments", label: "patient.appointments", icon: CalendarDays },
    { to: "/patient/assessment", label: "patient.assessmentNav", icon: ClipboardList },
    { to: "/patient/records", label: "patient.records", icon: FileText },
    { to: "/patient/messages", label: "patient.messages", icon: MessageSquare },
    { to: "/patient/support", label: "Support", icon: LifeBuoy },
    { to: "/patient/profile", label: "common.profile", icon: Users },
    { to: "/patient/settings", label: "common.settings", icon: Settings },
  ],
  psychologist: [
    { to: "/psychologist", label: "psy.dashboard", icon: LayoutDashboard },
    { to: "/psychologist/pending", label: "psy.pendingNav", icon: ShieldCheck },
    { to: "/psychologist/patients", label: "psy.patients", icon: Users },
    { to: "/psychologist/appointments", label: "psy.appointments", icon: CalendarDays },
    { to: "/psychologist/availability", label: "psy.availability", icon: ClipboardList },
    { to: "/psychologist/notes", label: "psy.notes", icon: FileText },
    { to: "/psychologist/messages", label: "psy.messages", icon: MessageSquare },
    { to: "/psychologist/profile", label: "common.profile", icon: Stethoscope },
    { to: "/psychologist/settings", label: "common.settings", icon: Settings },
  ],
  admin: [
    { to: "/admin", label: "admin.dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "admin.users", icon: Users },
    { to: "/admin/appointments", label: "admin.appointments", icon: CalendarDays },
    { to: "/admin/verification", label: "admin.verification", icon: ShieldCheck },
    { to: "/admin/reports", label: "admin.reports", icon: Sparkles },
    { to: "/admin/content", label: "admin.content", icon: FileText },
    { to: "/admin/support", label: "Support Center", icon: LifeBuoy },
    { to: "/admin/settings", label: "common.settings", icon: Settings },
  ],
};

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { t } = useTranslation();
  const { session, signOut } = useAuth();
  const { toggle, lang } = useLang();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const items = navByRole[role];

  const sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-e border-sidebar-border bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <BrandLogo />
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate font-display text-base font-medium tracking-tight text-foreground">{t("brand")}</div>
            <div className="truncate text-[11px] text-muted-foreground capitalize">{role}</div>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== `/${role}` && pathname.startsWith(it.to + "/"));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-primary/10 font-medium text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {active && (
                <span aria-hidden className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-primary" />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110", active && "text-primary")} />
              {!collapsed && <span className="truncate">{t(it.label)}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{t("nav.logout")}</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/55 hover:bg-sidebar-accent md:flex"
        >
          <ChevronsLeft className={cn("h-4 w-4 shrink-0 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block">{sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 start-0 z-50 md:hidden">{sidebar}</div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl md:px-6">
          <button
            className="rounded-xl p-2 transition-colors hover:bg-accent/40 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ms-auto flex items-center gap-2">
            <ThemeToggle compact />
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
              title={t("lang.label")}
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "العربية" : "English"}
            </button>
            <button
              className="relative rounded-full border border-border/70 bg-card/60 p-2 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-2 py-1">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground shadow-soft">
                {session?.name?.charAt(0) ?? "U"}
              </div>
              <div className="hidden pe-1 text-xs sm:block">
                <div className="font-medium leading-tight">{session?.name ?? "Guest"}</div>
                <div className="text-muted-foreground capitalize leading-tight">{role}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10 animate-fade-in-up">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background md:hidden">
          {items.slice(0, 5).map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn("flex flex-col items-center gap-1 py-2 text-[10px]", active ? "text-primary" : "text-muted-foreground")}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate px-1">{t(it.label)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export { Video };
