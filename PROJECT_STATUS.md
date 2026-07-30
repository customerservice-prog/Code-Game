# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified — do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected and migrated)
- [x] Phase 1.5: Real authentication (NextAuth credentials auth wired to Postgres via Prisma; sign-up, sign-in, and session-protected dashboard all verified working end to end in production)
- [~] Phase 2: Curriculum engine (first real slice built and verified live: data model, idempotent seed script, validated lesson-content schema/renderer, World Map, world detail page, lesson viewer, and a real "mark lesson complete" write to Postgres. Content volume is still far below the launch minimum — see Remaining Launch Requirements below)
- [ ] Phase 3: Learning progress (XP, mastery, streaks, achievements — not started)
- [ ] Phase 4: Interactive missions (missions currently render as read-only previews only; no submission or grading yet)
- [ ] Phase 5: Learner experience
- [ ] Phase 6: Launch curriculum
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a working Next.js app deployed on Railway with a real Postgres database. Real authentication is implemented and verified working end to end in production. A first real slice of the curriculum engine is also implemented and verified live: 1 of 17 worlds (Web Foundations) has real published content (2 modules, 4 lessons, 4 missions as of this update), with the other 16 worlds correctly marked "Upcoming". Learners can browse the World Map, read full lesson content, and mark lessons complete (a real database write). Missions are preview-only — no interactive submission/grading yet.

## Completed Features

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, .env.example
- prisma/schema.prisma — starting schema derived from CLAUDE.md, migrated against the real Postgres database (all 28 tables exist and are confirmed via Railway's database browser)
- src/lib/prisma.ts — Prisma client singleton
- src/lib/auth.ts — NextAuth configuration (Credentials provider, Prisma adapter, JWT sessions, bcrypt password hashing)
- src/app/api/auth/[...nextauth]/route.ts — NextAuth route handler
- src/app/api/auth/register/route.ts — public registration endpoint (feature-flagged by FEATURE_PUBLIC_REGISTRATION), validates input with zod, hashes passwords with bcrypt, rejects duplicate emails
- src/components/providers.tsx — SessionProvider wrapper, wired into the root layout
- src/app/sign-up — real registration form, calls the register endpoint then signs the user in and redirects to /dashboard
- src/app/sign-in — real sign-in form wired to NextAuth credentials auth, shows a real error message on invalid credentials
- src/app/dashboard — protected by a real server-side session check (getServerSession); shows real lesson-progress counts
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css — root layout and landing page markup, confirmed rendering live
- src/types/next-auth.d.ts — real type augmentation for session/user id and role (avoids unsafe any casts)
- prisma/seed.ts — idempotent curriculum seed script (upserts keyed on stable slugs), runs on every deploy start; seeds all 17 CLAUDE.md worlds (1 published, 16 draft/"Upcoming"), 2 modules, 4 lessons, and 4 missions in Web Foundations
- src/lib/lesson-content.ts — zod-validated lesson content block schema (heading, paragraph, vocabulary, analogy, code_example, line_explanation, callout, common_mistake, knowledge_check, summary), validated server-side before rendering
- src/lib/curriculum.ts — server-side data access helpers (getWorldsWithProgress, getWorldBySlug, getLessonBySlug, getOrCreateLessonProgress), kept out of page components per CLAUDE.md section 5
- src/app/world-map — real World Map page showing all worlds with live per-user lesson-completion counts, "Upcoming" labeling for draft worlds
- src/app/world-map/[world] — real world detail page listing real modules/lessons with per-lesson complete/start status
- src/app/world-map/[world]/[lesson] — real lesson viewer rendering all content block types, a knowledge-check UI, a read-only mission preview list, and a "Mark lesson complete" button
- Mark-complete server action — verifies the lesson exists server-side (never trusts a client-supplied id blindly) and writes real LessonProgress rows to Postgres
- Railway build and deploy pipeline verified working end to end, including real database schema sync and curriculum seeding on every deploy start

## Infrastructure (real, verified)

- Railway Postgres database service provisioned in the project ("Postgres" service, Online), all 28 tables from schema.prisma exist (confirmed via Railway's Data browser)
- DATABASE_URL and DIRECT_URL on the app service point to the real database via Railway variable references (${{Postgres.DATABASE_URL}})
- AUTH_SECRET set to a real, randomly generated 256-bit session-signing secret (generated locally, not a third-party credential)
- AUTH_URL and NEXT_PUBLIC_APP_URL set to the real production URL instead of localhost
- NODE_ENV set to "production"
- FEATURE_PUBLIC_REGISTRATION set to "true", verified working (real account creation tested end to end)
- Build script runs prisma generate at build time (no DB access needed); start script runs prisma db push + prisma db seed at container start time, when the app has internal network access to Postgres
- AI/email/error-tracking/rate-limit variables remain clearly-labeled placeholders ("replace-with-real-...") since those require real third-party accounts the user must create — these are not fabricated

## Current Work

First real slice of the curriculum engine (Phase 2) is live and verified. Next logical step: continue expanding real curriculum content (more lessons/missions/worlds) toward CLAUDE.md's launch minimums, and/or begin Phase 3 (XP, mastery, streaks) or Phase 4 (interactive mission submission and grading). Proceeding autonomously per user direction to keep building real, non-placeholder features.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).
- prisma/schema.prisma changes are applied via prisma db push (schema sync) rather than reviewed migration files, since there is no local dev environment to generate migration SQL. Logged as an open item in KNOWN_ISSUES.md.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI — app/database/auth now real and verified; roles (OWNER/ADMIN/CURRICULUM_EDITOR/LEARNER) exist in the schema but are not yet used to gate any real permissions
- Curriculum engine: first real slice built (1 of 17 worlds has 2 modules / 4 lessons / 4 missions); CLAUDE.md section 12 requires at least 30 lessons and 100 missions at launch — far more content is needed
- Learning progress: XP, mastery, streaks, achievements — not started
- Interactive code editor and safe execution, mission submission/grading — not started (missions currently preview-only)
- Full learner experience (dashboard, world map, lessons done; review, notes not started)
- Minimum launch curriculum (30 lessons, 100 missions, capstones) — not yet met
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline, database, auth, and first curriculum slice now verified working)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: manual end-to-end verification only (sign-up → sign-in → protected dashboard; world map → world detail → lesson viewer → mark complete, all tested live in production with a real test account; no automated test suite yet)
- Security tests: not started
- Note: no automated test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: created and online (service "Postgres"), linked to the app via real variable references, schema fully synced (28 tables)
- Production URL: https://code-game-production.up.railway.app (landing page, fully functional sign-up/sign-in/protected dashboard, World Map, world detail, lesson viewer, and mark-complete all live)

## Last Updated

2026-07-29 — Corrected this file: a prior commit titled "Update PROJECT_STATUS.md" was accidentally empty (0 files changed) and left this document stale, still describing curriculum work as not started. This update brings the document back in line with the real, verified state: the first slice of the curriculum engine (Phase 2) is live in production, covering 1 of 17 worlds with 2 modules, 4 lessons, and 4 missions, plus a working World Map, lesson viewer, and real lesson-completion tracking. Repository is still public.
