import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/lang";
import { BrandLogo } from "@/components/brand-logo";
import type { ReactNode } from "react";

export function PublicShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { toggle, lang } = useLang();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo />
            <span className="text-base font-semibold tracking-tight text-primary">{t("brand")}</span>
          </Link>
          <nav className="ms-auto hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link>
            <Link to="/mission" className="hover:text-foreground">{t("public.mission")}</Link>
            <Link to="/faq" className="hover:text-foreground">{t("public.faq")}</Link>
            <Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link>
            <Link to="/patient/find" className="hover:text-foreground">{t("nav.psychologists")}</Link>
          </nav>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Link to="/auth/login" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent">
            {t("nav.login")}
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-6 py-12">{children}</section>
      </main>

      <PublicFooter />
    </div>
  );
}

export function PublicFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-surface-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <BrandLogo className="h-8 w-8" />
            <span className="font-semibold text-primary">{t("brand")}</span>
          </div>
          <p className="mt-3 text-muted-foreground">{t("tagline")}</p>
        </div>
        <FooterCol title={t("public.company")} links={[
          { to: "/about", label: t("nav.about") },
          { to: "/mission", label: t("public.mission") },
          { to: "/contact", label: t("nav.contact") },
        ]} />
        <FooterCol title={t("public.product")} links={[
          { to: "/patient/find", label: t("nav.psychologists") },
          { to: "/onboarding/welcome", label: t("public.forClinicians") },
          { to: "/faq", label: t("public.faq") },
        ]} />
        <FooterCol title={t("public.legal")} links={[
          { to: "/privacy", label: t("footer.privacy") },
          { to: "/terms", label: t("footer.terms") },
        ]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")} · {t("footer.rights")}
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}><Link to={l.to} className="hover:text-foreground">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
