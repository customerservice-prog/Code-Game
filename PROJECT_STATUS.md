# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified — do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected and migrated)
- [x] Phase 1.5: Real authentication (NextAuth credentials auth wired to Postgres via Prisma; sign-up, sign-in, and session-protected dashboard all verified working end to end in production)
- [~] Phase 2: Curriculum engine (real slice built and verified live: data model, idempotent seed script, validated lesson-content schema/renderer, World Map, world detail page, lesson viewer, and a real "mark lesson complete" write to Postgres. Content volume is still far below the launch minimum — see Remaining Launch Requirements below)
- [~] Phase 3: Learning progress (real XP and streak tracking implemented and verified live: XP is derived from completed lessons (20 XP each, no fabricated numbers), streaks count consecutive calendar days with at least one lesson completed, tracked in a real Streak table and updated by the mark-complete server action. Mastery scoring and achievements are still not started; missions still display XP values as flavor text only since mission submission/grading does not exist yet)
- [ ] Phase 4: Interactive missions (missions currently render as read-only previews only; no submission or grading yet)
- [~] Phase 5: Learner experience (visual/gamification polish pass done: per-world icons and accent colors, real progress bars, numbered/checkmarked lesson rows, icon-coded lesson content blocks, a celebratory lesson-complete state that now also shows real XP earned and current streak, plus XP/streak badges on the dashboard and World Map. Still missing achievements, notes, and review features)
- [ ] Phase 6: Launch curriculum
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a working Next.js app deployed on Railway with a real Postgres database. Real authentication is implemented and verified working end to end in production. The curriculum engine's first slice is implemented and verified live: 1 of 17 worlds (Web Foundations) has real published content (2 modules, 4 lessons, 4 missions), with the other 16 worlds correctly marked "Upcoming". Learners can browse a visually polished World Map with real XP/streak totals, read full lesson content, and mark lessons complete with a celebratory confirmation that shows real XP earned and streak progress (all real database writes). Missions are preview-only — no interactive submission/grading yet.

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
- src/app/dashboard — protected by a real server-side session check (getServerSession); shows real lesson-progress counts plus real total XP, current streak, and longest streak
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css — root layout, landing page markup, design tokens, plus a small celebratory pop-in keyframe animation
- src/types/next-auth.d.ts — real type augmentation for session/user id and role (avoids unsafe any casts)
- prisma/seed.ts — idempotent curriculum seed script (upserts keyed on stable slugs), runs on every deploy start; seeds all 17 CLAUDE.md worlds (1 published, 16 draft/"Upcoming"), 2 modules, 4 lessons, and 4 missions in Web Foundations
- src/lib/lesson-content.ts — zod-validated lesson content block schema (heading, paragraph, vocabulary, analogy, code_example, line_explanation, callout, common_mistake, knowledge_check, summary), validated server-side before rendering
- src/lib/curriculum.ts — server-side data access helpers (getWorldsWithProgress, getWorldBySlug, getLessonBySlug, getOrCreateLessonProgress), kept out of page components per CLAUDE.md section 5
- src/lib/world-visuals.ts — per-world icon + accent color metadata, purely presentational, used by the World Map and world detail pages
- src/lib/gamification.ts — real XP/streak stats helper (getUserGameStats); XP is derived (completed lessons × LESSON_XP) rather than stored, so it can never drift out of sync with real progress
- src/app/world-map — real World Map page: per-world icon and accent-colored top border, a real percentage-based progress bar, "Upcoming" labeling for draft worlds, and real ⚡ XP / 🔥 streak badges
- src/app/world-map/[worldSlug] — world detail page: numbered lesson badges that become green checkmarks on completion, per-module progress bars, world icon in the header
- src/app/world-map/[worldSlug]/[lessonSlug] — lesson viewer: icon-coded content blocks (vocabulary cards, analogy cards, a terminal-style code block, arrow-style line explanations, tone-coded callouts with icons, a labeled knowledge check, a labeled key-takeaway summary), a mission preview list with per-type icons and a "Coming soon" badge, and a "Mark lesson complete" button
- Mark-complete server action and button — verifies the lesson exists server-side (never trusts a client-supplied id blindly), writes a real LessonProgress row to Postgres, updates a real Streak row (consecutive-calendar-day logic, only advances once per lesson so repeat clicks can't inflate it), and shows a celebratory "🎉 Lesson complete!" confirmation showing the real XP just earned and the current streak, with a pop-in animation
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

Implemented real XP and streak tracking (Phase 3 slice): a shared gamification helper, streak logic in the mark-complete server action, and XP/streak display on the dashboard, World Map, and the lesson-complete confirmation. Verified live end to end by completing a real lesson and watching XP go from 40 to 60 and the streak go from 0 to 1. Next logical step: continue expanding real curriculum content (more lessons/missions/worlds) toward CLAUDE.md's launch minimums, and/or begin Phase 4 (interactive mission submission and grading) or achievements. Proceeding autonomously per user direction to keep building real, non-placeholder features.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).
- prisma/schema.prisma changes are applied via prisma db push (schema sync) rather than reviewed migration files, since there is no local dev environment to generate migration SQL. Logged as an open item in KNOWN_ISSUES.md.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI — app/database/auth now real and verified; roles (OWNER/ADMIN/CURRICULUM_EDITOR/LEARNER) exist in the schema but are not yet used to gate any real permissions
- Curriculum engine: real slice built (1 of 17 worlds has 2 modules / 4 lessons / 4 missions), now with real visual/gamification polish; CLAUDE.md section 12 requires at least 30 lessons and 100 missions at launch — far more content is needed
- Learning progress: real XP and streak tracking now implemented and verified live; mastery scoring and achievements are still not started
- Interactive code editor and safe execution, mission submission/grading — not started (missions currently preview-only)
- Full learner experience: dashboard, world map, lessons, XP/streaks, and a visual polish pass are done; achievements, review, and notes are not started
- Minimum launch curriculum (30 lessons, 100 missions, capstones) — not yet met
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline, database, auth, curriculum slice, visual polish, and XP/streak tracking now verified working)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: manual end-to-end verification only (sign-up → sign-in → protected dashboard; world map → world detail → lesson viewer → mark complete → celebratory confirmation with real XP/streak update, all tested live in production with a real test account; no automated test suite yet)
- Security tests: not started
- Note: no automated test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: created and online (service "Postgres"), linked to the app via real variable references, schema fully synced (28 tables)
- Production URL: https://code-game-production.up.railway.app (landing page, fully functional sign-up/sign-in/protected dashboard, visually polished World Map with real XP/streak totals, world detail, lesson viewer, and mark-complete all live)

## Last Updated

2026-07-30 — Implemented real XP and streak tracking (src/lib/gamification.ts, streak logic in the mark-complete server action, XP/streak badges on the dashboard and World Map, and a richer lesson-complete confirmation showing real XP earned and current streak). Verified live end to end. Note on a mistake made and fixed during this work: the initial commit creating src/lib/gamification.ts silently did not save (the GitHub UI showed a successful commit dialog, but the file was not actually present in the repository afterward), which caused four consecutive Railway deployments to fail at build time with "Module not found: Can't resolve '@/lib/gamification'". This was caught by checking Railway's deployment history (not assumed successful), diagnosed from the build logs, fixed by recreating the file and verifying its presence in the repository before moving on, and confirmed with a clean successful deployment. The previously live version of the app was never affected since Railway keeps serving the last successful deployment while a new one builds.
