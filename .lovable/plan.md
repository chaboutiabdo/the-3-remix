## Goal
Transform the current static HTML-screen preview into a real, fully-navigable React frontend (TanStack Start) with role-based dashboards, complete auth screens, English/Arabic with RTL, and a polished responsive UI. Frontend only — no backend, no DB, mock data everywhere.

## Scope
Replace the `/screens/$id` HTML iframe approach with native React routes. Keep the static HTML pages reachable under `/raw/*` as a reference gallery, but the actual app lives in real routes.

## Information architecture (new routes)

```
/                         Landing (marketing)
/auth/login
/auth/signup              (role chooser: patient / psychologist)
/auth/forgot
/auth/reset
/auth/logout              (clears local session, redirects /)

/onboarding               Psychologist 4-step wizard
  /welcome  /credentials  /documents  /review  /pending

/patient                  Patient layout (sidebar + topbar)
  /dashboard
  /find                   Directory + filters
  /psychologist/:id       Profile
  /book/:id               Booking flow
  /appointments           History + upcoming
  /session/:id            Video room (mock)
  /records                Personal records
  /messages
  /profile
  /settings

/psychologist             Clinician layout
  /dashboard
  /patients
  /patients/:id           Patient detail + session notes
  /appointments
  /availability
  /notes
  /messages
  /profile
  /settings

/admin                    Admin layout
  /dashboard              KPIs, charts (mock)
  /users
  /appointments
  /verification           Queue
  /verification/:id       Review application
  /reports                Analytics (mock charts)
  /content                CMS list (mock)
  /settings

/screens                  Legacy HTML gallery (kept for reference)
```

Every route ships its own `head()` metadata.

## Role + auth (frontend only, mock)
- `useAuth()` hook backed by `localStorage` (`psy.auth` = `{ role, name, email }`).
- Login form: pick role from a dropdown (patient/psychologist/admin), any creds accepted, stores session, redirects to that role's `/dashboard`.
- Signup: same, also routes psychologists into `/onboarding`.
- `RoleGuard` component wrapping each role layout — if no session / wrong role, redirect to `/auth/login`. Pure client guard, no server check.
- Logout clears storage + redirects `/`.

## Shared UI
- `AppShell` per role: collapsible shadcn sidebar, topbar with language switcher + user menu, mobile bottom-nav.
- Reusable: `PageHeader`, `StatCard`, `EmptyState`, `LoadingState`, `DataTable`, `AppointmentCard`, `PsychologistCard`, `Modal` wrappers via shadcn Dialog.
- All data from `src/mocks/*.ts` (psychologists, appointments, patients, notes, users, verifications, reports).
- Forms use react-hook-form + zod, with proper validation, loading, success toasts (sonner).

## Internationalization (English + Arabic, full RTL)
- `i18next` + `react-i18next` with two JSON dictionaries: `src/i18n/en.json`, `src/i18n/ar.json`.
- `LanguageProvider` sets `<html lang dir>` based on chosen language; persisted in `localStorage`.
- Language switcher in every layout topbar.
- Use logical Tailwind utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) and `rtl:`/`ltr:` variants where needed so layouts mirror cleanly.
- All visible UI strings go through `t('...')`. No hard-coded English in components.

## Design system
- Refresh `src/styles.css` tokens to a calming clinical palette (teal/indigo primary, warm neutrals, soft surfaces), typography pair (e.g. Plus Jakarta Sans + Noto Sans Arabic for Arabic), consistent radii and shadows.
- Replace ad-hoc inline colors in `routes/index.tsx` with semantic tokens.
- Responsive at `sm` / `md` / `lg`; mobile bottom-nav under `md`, sidebar at `md+`.

## Testing pass
- Click through every link in every layout, both roles, both languages.
- Use Playwright headless to screenshot key pages (LTR + RTL) and verify nothing overflows.

## Technical notes
- Stack: TanStack Start (existing), TanStack Router file-based routes, Tailwind v4 tokens in `src/styles.css`, shadcn components already installed, `i18next` + `react-i18next` + `i18next-browser-languagedetector` (added via `bun add`), `react-hook-form`, `zod`, `sonner`, `recharts` for admin charts (already in tree).
- Each layout file uses `<Outlet />`; every route file has `errorComponent` + `notFoundComponent`; `__root.tsx` adds a `notFoundComponent`; router gets `defaultErrorComponent`.
- `__root.tsx` injects Google Fonts via `<link>` (never `@import` URLs in CSS).
- All previous `/raw/page*.html` files stay in `public/raw/` and remain reachable via a `/screens` index for reference; the new app does not depend on them.

## Out of scope
- No backend, no Supabase/Cloud, no real auth, no real video, no real payments. Everything is mocked client-side.

## Deliverable size warning
This is a large build — roughly 40+ new route/component files. I'll implement it in one pass, batching file creation in parallel. Expect a long single response. After it lands, I'll do a Playwright sweep and fix anything visibly broken.
