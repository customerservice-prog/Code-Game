# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified — do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed and now builds/deploys successfully on Railway; still missing database, auth, and real features)
- [ ] Phase 2: Curriculum engine
- [ ] Phase 3: Learning progress
- [ ] Phase 4: Interactive missions
- [ ] Phase 5: Learner experience
- [ ] Phase 6: Launch curriculum
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a file scaffold that has now been successfully built and deployed to Railway as a live placeholder site. No dependencies have been verified locally, no database exists, and no real feature (auth, curriculum, progress, missions) has been implemented. This is still not a working application — it is a deployed empty shell.

## Completed Features

None of the actual product features described in CLAUDE.md. What exists today:

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, .env.example
- prisma/schema.prisma — draft starting schema derived from CLAUDE.md, not migrated against any real database
- src/lib/config.ts — centralized app configuration placeholder
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css — placeholder root layout and landing page markup, confirmed rendering live
- src/app/dashboard — placeholder learner dashboard page (not linked to any real data)
- src/app/sign-in — placeholder sign-in page with static email/password form fields; submitting does nothing, no authentication backend is wired up
- Railway build pipeline is working: Next.js build completes and the app runs on Railway's Node runtime

## Current Work

Awaiting a decision on whether to continue iterating via GitHub web edits + Railway auto-deploy, or move to a real local development environment (e.g. Claude Code CLI) to properly install dependencies, verify the scaffold, and begin real implementation per CLAUDE.md.

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner before real credentials or deployment work begins.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- No database has been provisioned (no Postgres service exists in the Railway project). DATABASE_URL is only a suggested placeholder value, not a real connection.
- No authentication is implemented. The sign-in page is static markup only.
- No real environment variables/secrets have been set on Railway — only Railway's own system variables exist. All app-specific variables (DATABASE_URL, auth secrets, API keys) are still unset placeholder suggestions.

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI
- Curriculum engine and admin editor
- Learning progress: XP, mastery, streaks, achievements
- Interactive code editor and safe execution
- Full learner experience (dashboard, world map, lessons, review, notes)
- Minimum launch curriculum (30 lessons, 100 missions, capstones)
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline now verified working; still needs database, auth, real features)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: not started
- Security tests: not started
- Note: no test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: not created
- Production URL: https://code-game-production.up.railway.app (placeholder landing page + non-functional sign-in form only)

## Last Updated

2026-07-29 — Fixed a Railway build failure (broken ESLint rule reference in .eslintrc.json), confirmed successful deploy, generated a public Railway domain, and manually verified the live site shows the placeholder landing page and a static (non-functional) sign-in form. Confirmed no database or real environment variables exist yet. Repository is still public.
