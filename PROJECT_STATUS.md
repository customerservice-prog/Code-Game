# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified - do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected and migrated)
- [x] Phase 1.5: Real authentication (NextAuth credentials auth wired to Postgres via Prisma; sign-up, sign-in, and session-protected dashboard all verified working end to end in production)
- [~] Phase 2: Curriculum engine (real slice built and verified live: data model, idempotent seed script, validated lesson-content schema/renderer, World Map, world detail page, lesson viewer, and a real "mark lesson complete" write to Postgres. Content volume is still far below the launch minimum - see Remaining Launch Requirements below)
- [~] Phase 3: Learning progress (real XP, levels, and streak tracking implemented and verified live: XP is derived from completed lessons (20 XP each) and graded missions (10 XP each, no fabricated numbers), levels are derived from total XP (100 XP per level), streaks count consecutive calendar days with at least one lesson completed, tracked in a real Streak table. A real achievements system computes eight achievements entirely from real lesson/streak/world-completion/mission data, shown as Earned/Locked on the dashboard. Mastery scoring is implemented: submitMissionAttempt bumps a skill's masteryScore the first time a linked mission is passed, mapped to a MasteryLevel enum)
- [x] Phase 4: Interactive mission grading (real, server-graded missions across five check types: multiple choice, exact-text prediction with acceptable-answer variants, regex-based code checks, HTML nesting-order checks, and one sandboxed Node vm JavaScript execution check. A real mission-solver client component renders the right input per mission type, and a submitMissionAttempt server action re-validates everything server-side, records a real MissionAttempt, and awards XP/mastery only on a genuine first pass. Verified live for every mission type across all six published worlds)
- [ ] Phase 5: AI tutor and adaptive help (feature-flagged off; no AI provider key configured)
- [ ] Phase 6: Social/community features
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a working Next.js app deployed on Railway with a real Postgres database. Real authentication is implemented and verified working end to end in production. The curriculum engine now has six real published worlds: Web Foundations, HTML Harbor, CSS City, JavaScript Jungle, TypeScript Tower, and React Realm (2 modules / 4 lessons / 4 missions each = 24 lessons and 24 missions total), with the other 11 worlds correctly marked "Upcoming" per CLAUDE.md section 11. Learners can browse a visually polished World Map with real XP/level/streak totals, read full lesson content, mark lessons complete with a celebratory confirmation, solve every mission for real (server-graded, no "Coming soon" placeholders anywhere in the shipped worlds), and view a real achievements grid on the dashboard (all backed by real database writes and derived values).

## Completed Features

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, prisma/schema.prisma
- Real NextAuth credentials authentication backed by Postgres via Prisma, with bcrypt password hashing; public sign-up page; session-protected /dashboard
- prisma/seed.ts - idempotent, upsert-based seed script that runs on every deploy start, currently defining 17 worlds total (6 PUBLISHED with real content, 11 DRAFT/"Upcoming"), 12 modules, 24 lessons, and 24 fully server-graded missions
- src/app/world-map - World Map page: all 17 worlds with per-world progress bars for the 6 published worlds, and glowing gradient XP / Level (with mini progress bar) / Streak badges
- src/app/world-map/[worldSlug] - world detail page: numbered lesson badges that become green checkmarks on completion, per-module progress bars, world icon in the header
- src/app/world-map/[worldSlug]/[lessonSlug] - lesson viewer: icon-coded content blocks (vocabulary cards, analogy cards, a terminal-style code block, arrow-style line explanations, tone-coded callouts with icons, a labeled knowledge check, a labeled key-takeaway summary), a real mission-solver widget per mission (no placeholders), and a "Mark lesson complete" button
- Mark-complete server action and button - verifies the lesson exists server-side, writes a real LessonProgress row to Postgres, updates a real Streak row, and shows a celebratory confirmation with real XP/level/streak progress
- src/lib/mission-grading.ts - server-side grading logic for all five mission check types, including a timeout-guarded Node vm sandbox for the one mission type that executes learner-submitted JavaScript
- src/components/mission-solver.tsx - client component rendering the correct input widget (radio options, text input, or code textarea) per mission type, calling the real submitMissionAttempt server action
- src/lib/gamification.ts - derives XP, level, streak, masteryLevelFromScore, and getAchievements entirely from real database rows, no fabricated data
- Dashboard page - real Total XP, Level, current/longest streak, missions-solved count, lesson-progress fraction, and an Earned/Locked achievements grid

## Recent Work Log

- Published Web Foundations, HTML Harbor, and CSS City (2 modules / 4 lessons / 4 missions each), initially with preview-only missions.
- Built real interactive mission grading end to end (five check types, sandboxed JS execution, mission-solver.tsx, submitMissionAttempt), replacing every "Coming soon" mission badge with a real, gradeable interaction. Fixed two consecutive Railway build failures encountered along the way (a Prisma JSON-type mismatch, and an invalid vm.Script constructor option) - see KNOWN_ISSUES.md for full details.
- Published JavaScript Jungle (2 modules / 4 lessons / 4 missions), then TypeScript Tower (2 modules / 4 lessons / 4 missions), each with real, server-graded missions from the start - bringing the total to 5 published worlds, 20 lessons, and 20 gradeable missions. One self-inflicted bug from that work is worth recording: a clipboard paste meant to insert new mission grading specs landed one line too early inside an existing object literal, which was not caught until Railway's build failed on a TypeScript error; it was diagnosed from the build logs and fixed with precise brace corrections, verified by re-parsing the file's brace balance before committing again.
- Published React Realm (2 modules / 4 lessons / 4 missions: Writing Your First JSX, Rendering Dynamic Values with Curly Braces, Managing State with useState, Handling Events and Props), bringing the total to 6 published worlds, 24 lessons, and 24 gradeable missions. Verified live end to end: solved "Spot the Valid Component" in production and confirmed XP increased from 150 to 160 and Missions Solved increased from 3 to 4 on the dashboard. Two authoring-workflow bugs were caught and fixed before committing (never shipped to production): a screenshot-timing-based click landed in the wrong place and briefly replaced the entire editor buffer with a single line of text (recovered with Ctrl+Z, verified via full-document clipboard read-back); and two separate attempts to update the closing console.log summary line via JavaScript-injected input values silently reverted to a stale prior search value when "Replace All" was clicked, deleting the "const MISSION_META" declaration line - both times caught immediately by post-replace clipboard verification, undone, and successfully redone by typing into the Find/Replace fields with real keyboard input instead of synthetic DOM events. See KNOWN_ISSUES.md for full technical detail on both.
- Next logical step: continue expanding real curriculum content toward CLAUDE.md's launch minimums (30 lessons, 100 missions) - Next.js Network is the next world in CLAUDE.md's defined order - and/or build notes/review features. Proceeding autonomously per user direction to keep building real, non-placeholder features.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).
- prisma/schema.prisma changes are applied via prisma db push (schema sync) rather than reviewed migration files, since there is no local dev environment to generate migration SQL. Logged as an open item in KNOWN_ISSUES.md.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI - app/database/auth now real and verified; roles (OWNER/ADMIN/CURRICULUM_EDITOR/LEARNER) exist in the schema but are not yet used to gate any real permissions
- Curriculum engine: real content now spans 6 of 17 worlds (12 modules / 24 lessons / 24 missions total, all server-graded), with the remaining 11 worlds correctly marked "Upcoming" rather than shown as empty or broken. CLAUDE.md section 12 requires at least 30 lessons, 100 missions, 5+ mission types (5 are already implemented: multiple choice, exact-text prediction, regex-based code checks, HTML nesting-order checks, and sandboxed JS execution), 3 boss challenges, 2 mini projects, 1 capstone, 75+ review questions, 30+ debugging scenarios, 25+ code-reading exercises, and 20+ terminal/Git simulations - none of the boss/capstone/mini-project/review-bank items exist yet
- Learning progress: XP, levels, streaks, mastery scoring, and achievements are all real and verified live
- AI tutor: intentionally deferred, feature-flagged off, no API key configured
- Production hardening: no rate limiting, error tracking, or email provider configured yet; prisma db push instead of reviewed migrations remains open tech debt
