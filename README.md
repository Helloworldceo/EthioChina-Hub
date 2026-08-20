# EthioChina Hub

A community platform for Ethiopians in China — a verified member directory, a resource hub
(announcements, events, guides, FAQs), and a support-request tracker, with a member-facing side
and an admin side for embassy contacts / community leaders.

Built with Next.js 16 (App Router), TypeScript, Prisma + PostgreSQL, NextAuth v5, and Tailwind CSS.

## How it's structured

- **Two separate account types, not one unified login.** Members and admins are different
  Prisma models (`Member`, `Admin`) with separate credential checks. Members can also sign in
  with Google (optional — only enabled if `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set), in
  which case `Member.passwordHash` is left null. Sessions are JWT-based (no database session
  table needed for credentials-only auth).
- **Two logins, only one advertised.** `/login` (member) is in the main nav. `/admin/login`
  exists but isn't linked from anywhere public — admins go there directly. Admin routes live in
  `app/admin/(protected)/` (a route group) so the auth-guarding layout wraps every admin page
  *except* `/admin/login` itself, which is a sibling outside the group.
- **Auth is checked in two places, deliberately.** Layouts (`app/admin/(protected)/layout.tsx`,
  `app/dashboard/layout.tsx`) redirect unauthenticated/wrong-role visitors before a page renders,
  for UX. But every Server Action in `lib/actions/` *also* re-checks `auth()` independently
  before touching the database — Next.js 16's own guidance is not to rely on routing-layer
  checks alone, since a refactor that moves a Server Function to a different route can silently
  drop layout coverage.
- **Server Actions, not a separate REST API**, for all mutations (register, profile edits,
  verify/edit/delete members, create/edit/pin resources, submit/assign/resolve requests, internal
  notes). The one exception is CSV export (`app/api/admin/members/export/route.ts`), which is a
  Route Handler since it needs to stream a file download with `Content-Disposition` headers
  rather than return React state.

## Data model

`prisma/schema.prisma`: `Member`, `Admin`, `Resource`, `SupportRequest`, `InternalNote`, plus
enums for admin role, resource category, request category, and request status. Internal notes
are their own model (not a text field) so a request can accumulate a running admin-only thread
over time.

## Local development

Requires Docker (for local Postgres) or your own Postgres instance.

```bash
# 1. Start local Postgres (already running if you used this during the build — check with `docker ps`)
docker run --name ethiochina-postgres \
  -e POSTGRES_USER=ethiochina -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=ethiochina \
  -p 5433:5432 -d postgres:16-alpine

# 2. Install deps, apply migrations
npm install
npx prisma migrate dev

# 3. Seed demo data (one admin + 5 members + 4 resources + 3 requests)
npm run db:seed

# 4. Run the app
npm run dev
```

Open http://localhost:3000.

### Demo credentials (seeded)

- **Admin**: `admin@ethiochina.org` / `ChangeMe123!` — log in at `/admin/login`
- **Member**: `selam@example.com` / `Password123!` (or any other seeded member email — see
  `prisma/seed.ts`) — log in at `/login`

Override the admin's seeded credentials by setting `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
before running `npm run db:seed`.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `AUTH_SECRET` | Yes | Random string; used to sign JWT sessions. Generate with `npx auth secret` |
| `NEXTAUTH_URL` | Local dev only | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enables "Continue with Google" for members only. Omit to leave it off. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | No | Only read by `prisma/seed.ts` |

`.env` is gitignored — never commit real credentials.

## Deploying

1. Provision a hosted Postgres database (Neon, Supabase, or Vercel Postgres all work).
2. Push this repo to GitHub, import it in Vercel.
3. Set `DATABASE_URL`, `AUTH_SECRET`, and (optionally) the Google OAuth vars in the Vercel
   project's Environment Variables.
4. Run `npx prisma migrate deploy` against the production database (from your machine, pointed
   at the production `DATABASE_URL`, or as a Vercel build step) before or during first deploy.
5. Optionally run `npm run db:seed` once against production for a portfolio-ready demo — or skip
   it and let real registrations populate the directory.

## What's not built yet

- Rate limiting on the public registration/request forms (flagged in the original spec as a
  polish item — worth adding via a middleware/proxy-level check or a service like Upstash if
  this goes properly public, since right now nothing stops scripted spam submissions).
- No password reset flow — an admin would need to be added manually via `prisma/seed.ts` or a
  direct DB update if someone forgets their password.
- No email notifications (e.g. member gets emailed when their request is resolved) — everything
  is check-the-dashboard-yourself for now.
