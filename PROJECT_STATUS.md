# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified - do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected and migrated)
- [x] Phase 1.5: Real authentication (NextAuth credentials auth wired to Postgres via Prisma; sign-up, sign-in, and session-protected dashboard all verified working end to end in production)
- [~] Phase 2: Curriculum engine (real slice built and verified live: data model, idempotent seed script, validated lesson-content schema/renderer, World Map, world detail page, lesson viewer, and a real "mark lesson complete" write to Postgres. Content volume is still far below the launch minimum - see Remaining Launch Requirements below)
- [~] Phase 3: Learning progress (real XP, levels, and streak tracking implemented and verified live: XP is derived from completed lessons (20 XP each, no fabricated numbers), levels are derived from total XP (100 XP per level), streaks count consecutive calendar days with at least one lesson completed, tracked in a real Streak table and updated by the mark-complete server action. A first real achievements system is also implemented - five achievements ("First Steps", "Getting Serious", "Streak Starter", "Streak Keeper", "World Graduate") computed entirely from real lesson/streak/world-completion data, shown as Earned/Locked on the dashboard. Mastery scoring is still not started; missions still display XP values as flavor text only since mission submission/grading does not exist yet)
- [ ] Phase 4: Interactive missions (missions currently render as read-only previews only; no submission or grading yet)
- [~] Phase 5: Learner experience (visual/gamification polish pass done: per-world icons and accent colors, real progress bars, numbered/checkmarked lesson rows, icon-coded lesson content blocks, a celebratory lesson-complete state showing real XP/level/streak, glowing gradient stat cards for XP/Level/Streak on the dashboard and World Map, and an achievements grid. Still missing notes and review features)
- [~] Phase 6: Launch curriculum (3 of 17 worlds now have real, launch-quality content - Web Foundations, HTML Harbor, and CSS City - each with 2 modules, 4 lessons, and 4 missions, 12 lessons and 12 missions total. Still far below CLAUDE.md's minimums of 30 lessons and 100 missions; the other 14 worlds remain correctly marked "Upcoming")
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a working Next.js app deployed on Railway with a real Postgres database. Real authentication is implemented and verified working end to end in production. The curriculum engine now has three real published worlds: Web Foundations, HTML Harbor, and CSS City (2 modules / 4 lessons / 4 missions each), with the other 14 worlds correctly marked "Upcoming". Learners can browse a visually polished World Map with real XP/level/streak totals, read full lesson content, mark lessons complete with a celebratory confirmation showing real XP/level/streak progress, and view a real achievements grid on the dashboard (all backed by real database writes and derived values). Missions are preview-only - no interactive submission/grading yet.

## Completed Features

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, .env.example
- prisma/schema.prisma - starting schema derived from CLAUDE.md, migrated against the real Postgres database (all 28 tables exist and are confirmed via Railway's database browser)
- src/lib/prisma.ts - Prisma client singleton
- src/lib/auth.ts - NextAuth configuration (Credentials provider, Prisma adapter, JWT sessions, bcrypt password hashing)
- src/app/api/auth/[...nextauth]/route.ts - NextAuth route handler
- src/app/api/auth/register/route.ts - public registration endpoint (feature-flagged by FEATURE_PUBLIC_REGISTRATION), validates input with zod, hashes passwords with bcrypt, rejects duplicate emails
- src/components/providers.tsx - SessionProvider wrapper, wired into the root layout
- src/app/sign-up - real registration form, calls the register endpoint then signs the user in and redirects to /dashboard
- src/app/sign-in - real sign-in form wired to NextAuth credentials auth, shows a real error message on invalid credentials
- src/app/dashboard - protected by a real server-side session check (getServerSession); shows real lesson-progress counts, glowing gradient stat cards for total XP, level (with progress bar to next level), current streak, and longest streak, plus a real achievements grid (Earned/Locked, derived from real progress data)
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css - root layout, landing page markup, design tokens, plus a small celebratory pop-in keyframe animation
- src/types/next-auth.d.ts - real type augmentation for session/user id and role (avoids unsafe any casts)
- prisma/seed.ts - idempotent curriculum seed script (upserts keyed on stable slugs), runs on every deploy start; seeds all 17 CLAUDE.md worlds (3 published - Web Foundations, HTML Harbor, and CSS City - 14 draft/"Upcoming"), 6 modules, 12 lessons, and 12 missions total across the three published worlds
- src/lib/lesson-content.ts - zod-validated lesson content block schema (heading, paragraph, vocabulary, analogy, code_example, line_explanation, callout, common_mistake, knowledge_check, summary), validated server-side before rendering
- src/lib/curriculum.ts - server-side data access helpers (getWorldsWithProgress, getWorldBySlug, getLessonBySlug, getOrCreateLessonProgress), kept out of page components per CLAUDE.md section 5
- src/lib/world-visuals.ts - per-world icon + accent color metadata, purely presentational, used by the World Map and world detail pages
- src/lib/gamification.ts - real XP/level/streak stats helper (getUserGameStats, getLevelInfo) and a real achievements helper (getAchievements); XP is derived (completed lessons x LESSON_XP) rather than stored, levels are derived from XP (100 XP per level), and achievements are derived from real completed-lesson/streak/world-completion counts - nothing here is faked or hardcoded to look impressive
- src/app/world-map - real World Map page: per-world icon and accent-colored top border, a real percentage-based gradient progress bar, "Upcoming" labeling for draft worlds, and glowing gradient XP / Level (with mini progress bar) / Streak badges
- src/app/world-map/[worldSlug] - world detail page: numbered lesson badges that become green checkmarks on completion, per-module progress bars, world icon in the header
- src/app/world-map/[worldSlug]/[lessonSlug] - lesson viewer: icon-coded content blocks (vocabulary cards, analogy cards, a terminal-style code block, arrow-style line explanations, tone-coded callouts with icons, a labeled knowledge check, a labeled key-takeaway summary), a mission preview list with per-type icons and a "Coming soon" badge, and a "Mark lesson complete" button
- Mark-complete server action and button - verifies the lesson exists server-side (never trusts a client-supplied id blindly), writes a real LessonProgress row to Postgres, updates a real Streak row (consecutive-calendar-day logic, only advances once per lesson so repeat clicks can't inflate it), and shows a celebratory "Lesson complete!" confirmation with the real XP just earned, current streak, and current level/progress-to-next-level, with a pop-in animation
- Railway build and deploy pipeline verified working end to end, including real database schema sync and curriculum seeding on every deploy start
- HTML Harbor world (2 modules - HTML Basics, Structuring Content; 4 lessons - What Is HTML?, Attributes and Nesting, Headings/Paragraphs/Lists, Links and Images; 4 missions), written to the same real-content standard as Web Foundations, published and verified live end to end (lesson content renders correctly, completing a lesson correctly awarded real XP and advanced the level/achievements state)
- CSS City world (2 modules - CSS Basics, Layout Basics; 4 lessons - What Is CSS?, Selectors and the Cascade, The Box Model, Flexbox Basics; 4 missions), written to the same real-content standard as Web Foundations and HTML Harbor, published and verified live end to end (World Map shows CSS City as enterable, both modules and all 4 lessons render, and completing the first lesson correctly awarded +20 XP)

## Infrastructure (real, verified)

- Railway Postgres database service provisioned in the project ("Postgres" service, Online), all 28 tables from schema.prisma exist (confirmed via Railway's Data browser)
- DATABASE_URL and DIRECT_URL on the app service point to the real database via Railway variable references (\${{Postgres.DATABASE_URL}})
- AUTH_SECRET set to a real, randomly generated 256-bit session-signing secret (generated locally, not a third-party credential)
- AUTH_URL and NEXT_PUBLIC_APP_URL set to the real production URL instead of localhost
- NODE_ENV set to "production"
- FEATURE_PUBLIC_REGISTRATION set to "true", verified working (real account creation tested end to end)
- Build script runs prisma generate at build time (no DB access needed); start script runs prisma db push + prisma db seed at container start time, when the app has internal network access to Postgres
- AI/email/error-tracking/rate-limit variables remain clearly-labeled placeholders ("replace-with-real-...") since those require real third-party accounts the user must create - these are not fabricated

## Current Work

Added a third real, published world - CSS City (2 modules, 4 lessons, 4 missions) - written to the same real-content, no-fake-data standard as Web Foundations and HTML Harbor, following the exact schema and conventions already established in prisma/seed.ts. Verified live end to end: the World Map now shows CSS City as an enterable world (no longer "Upcoming"), both modules ("CSS Basics" and "Layout Basics") and all 4 lessons render their full content correctly (selectors, the cascade/specificity, the box model, flexbox), and completing the first lesson ("What Is CSS?") correctly awarded +20 XP, taking total XP from 100 to 120. Next logical step: continue expanding real curriculum content toward CLAUDE.md's launch minimums (30 lessons, 100 missions across more worlds), and/or begin Phase 4 (interactive mission submission and grading). Proceeding autonomously per user direction to keep building real, non-placeholder features.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).
- prisma/schema.prisma changes are applied via prisma db push (schema sync) rather than reviewed migration files, since there is no local dev environment to generate migration SQL. Logged as an open item in KNOWN_ISSUES.md.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI - app/database/auth now real and verified; roles (OWNER/ADMIN/CURRICULUM_EDITOR/LEARNER) exist in the schema but are not yet used to gate any real permissions
- Curriculum engine: real content now spans 3 of 17 worlds (6 modules / 12 lessons / 12 missions total), with real visual/gamification polish; CLAUDE.md section 12 requires at least 30 lessons and 100 missions at launch - more content is still needed
- Learning progress: real XP, level, streak, and a first achievements system are now implemented and verified live across three worlds; mastery scoring is still not started
- Interactive code editor and safe execution, mission submission/grading - not started (missions currently preview-only)
- Full learner experience: dashboard, world map, lessons, XP/level/streak, achievements, and a visual polish pass are done; notes and review features are not started
- Minimum launch curriculum (30 lessons, 100 missions, capstones) - not yet met (12 of 30 lessons, 12 of 100 missions)
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline, database, auth, three-world curriculum slice, visual polish, and XP/level/streak/achievements now verified working)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: manual end-to-end verification only (sign-up, sign-in, protected dashboard; world map, world detail, lesson viewer, mark complete, celebratory confirmation with real XP/level/streak update; dashboard achievements grid flipping from Locked to Earned as lessons complete across multiple worlds; HTML Harbor and CSS City worlds verified live end to end after publishing; all tested live in production with a real test account; no automated test suite yet)
- Security tests: not started
- Note: no automated test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: created and online (service "Postgres"), linked to the app via real variable references, schema fully synced (28 tables)
- Production URL: https://code-game-production.up.railway.app (landing page, fully functional sign-up/sign-in/protected dashboard, visually polished World Map with real XP/level/streak totals across three published worlds, world detail, lesson viewer, mark-complete, and achievements grid all live)

## Last Updated

2026-07-30 - Published a third real curriculum world, CSS City (2 modules, 4 lessons, 4 missions), matching Web Foundations' and HTML Harbor's real-content standard. Verified live end to end: World Map shows CSS City as enterable, both modules and all 4 lessons render fully, and completing the first lesson correctly updated XP (100 to 120).
