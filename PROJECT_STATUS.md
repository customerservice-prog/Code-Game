# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified — do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected and migrated)
- [x] Phase 1.5: Real authentication (NextAuth credentials auth wired to Postgres via Prisma; sign-up, sign-in, and session-protected dashboard all verified working end to end in production)
- [ ] Phase 2: Curriculum engine
- [ ] Phase 3: Learning progress
- [ ] Phase 4: Interactive missions
- [ ] Phase 5: Learner experience
- [ ] Phase 6: Launch curriculum
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a working Next.js app deployed on Railway with a real Postgres database. Real authentication (registration + sign-in + session-protected routes) is implemented and verified working end to end in production with a real test account. No curriculum or learner-facing feature has been implemented yet.

## Completed Features

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, .env.example
- prisma/schema.prisma — starting schema derived from CLAUDE.md, now migrated against the real Postgres database (all 28 tables exist and are confirmed via Railway's database browser)
- src/lib/prisma.ts — Prisma client singleton
- src/lib/auth.ts — NextAuth configuration (Credentials provider, Prisma adapter, JWT sessions, bcrypt password hashing)
- src/app/api/auth/[...nextauth]/route.ts — NextAuth route handler
- src/app/api/auth/register/route.ts — public registration endpoint (feature-flagged by FEATURE_PUBLIC_REGISTRATION), validates input with zod, hashes passwords with bcrypt, rejects duplicate emails
- src/components/providers.tsx — SessionProvider wrapper, wired into the root layout
- src/app/sign-up — real registration form, calls the register endpoint then signs the user in and redirects to /dashboard
- src/app/sign-in — real sign-in form wired to NextAuth credentials auth, shows a real error message on invalid credentials
- src/app/dashboard — now protected by a real server-side session check (getServerSession); unauthenticated visitors are redirected to /sign-in
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css — root layout and landing page markup, confirmed rendering live
- Railway build and deploy pipeline is verified working end to end, including a real database schema sync on every deploy start

## Infrastructure (real, verified)

- Railway Postgres database service provisioned in the project ("Postgres" service, Online), all 28 tables from schema.prisma exist (confirmed via Railway's Data browser)
- DATABASE_URL and DIRECT_URL on the app service point to the real database via Railway variable references (${{Postgres.DATABASE_URL}})
- AUTH_SECRET set to a real, randomly generated 256-bit session-signing secret (generated locally, not a third-party credential)
- AUTH_URL and NEXT_PUBLIC_APP_URL set to the real production URL instead of localhost
- NODE_ENV set to "production"
- FEATURE_PUBLIC_REGISTRATION set to "true", verified working (real account creation tested end to end)
- Build script runs prisma generate at build time (no DB access needed); start script runs prisma db push at container start time, when the app has internal network access to Postgres — this was a real bug we hit and fixed (Railway's build step cannot reach postgres.railway.internal, only the running container can)
- AI/email/error-tracking/rate-limit variables remain clearly-labeled placeholders ("replace-with-real-...") since those require real third-party accounts the user must create — these are not fabricated

## Current Work

Authentication is done. Next logical step: build real curriculum content models/admin editing, or learner-facing features (world map, lessons, XP), per CLAUDE.md phases 2-3. Awaiting direction on which to prioritize.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).
- prisma/schema.prisma changes going forward are applied via prisma db push (schema sync) rather than reviewed migration files, since there is no local dev environment to generate migration SQL. This is fine for a single environment at this stage but should be replaced with real prisma migrate history before there are multiple environments or collaborators.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI — app/database/auth now real and verified; roles (OWNER/ADMIN/CURRICULUM_EDITOR/LEARNER) exist in the schema but are not yet used to gate any real permissions
- Curriculum engine and admin editor
- Learning progress: XP, mastery, streaks, achievements
- Interactive code editor and safe execution
- Full learner experience (dashboard, world map, lessons, review, notes)
- Minimum launch curriculum (30 lessons, 100 missions, capstones)
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline, database, and auth now verified working; still needs curriculum and real features)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: manual end-to-end verification only (sign-up → sign-in → protected dashboard access tested live in production with a real test account; no automated test suite yet)
- Security tests: not started
- Note: no automated test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: created and online (service "Postgres"), linked to the app via real variable references, schema fully synced (28 tables)
- Production URL: https://code-game-production.up.railway.app (landing page + fully functional sign-up/sign-in/protected dashboard; no curriculum features yet)

## Last Updated

2026-07-29 — Implemented real authentication end to end: NextAuth credentials provider backed by Postgres via Prisma, bcrypt password hashing, a public registration endpoint, real sign-up/sign-in pages, and a session-protected dashboard route. Fixed a real deployment bug where prisma db push was running during the build step (which has no network access to Railway's internal Postgres) by moving it to the start script instead. Verified the entire flow live in production by creating a real test account and confirming the row exists in Postgres with a bcrypt-hashed password. Repository is still public.
