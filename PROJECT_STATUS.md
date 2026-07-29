# Project Status

This file tracks the real, verified status of the CodeQuest Academy build. Only mark items complete once they have been implemented and manually verified — do not mark anything done based on assumption.

## Current Phase

- [ ] Phase 0: Discovery and planning
- [x] Phase 1: Foundation (scaffold committed, builds and deploys successfully on Railway with a real Postgres database connected; still missing real auth and features)
- [ ] Phase 2: Curriculum engine
- [ ] Phase 3: Learning progress
- [ ] Phase 4: Interactive missions
- [ ] Phase 5: Learner experience
- [ ] Phase 6: Launch curriculum
- [ ] Phase 7: Production hardening

Status: Repository contains planning documents plus a file scaffold that builds and deploys successfully on Railway. A real Postgres database is now provisioned and linked. Real production build bugs have been found and fixed. No authentication, curriculum, or learner-facing feature has been implemented yet — the live site is still a labeled placeholder shell.

## Completed Features

None of the actual product features described in CLAUDE.md yet. What exists today:

- Root config files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json, .gitignore, .env.example
- prisma/schema.prisma — draft starting schema derived from CLAUDE.md, not yet migrated against the real database
- src/lib/config.ts — centralized app configuration placeholder
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css — placeholder root layout and landing page markup, confirmed rendering live
- src/app/dashboard — placeholder learner dashboard page (not linked to any real data)
- src/app/sign-in — placeholder sign-in page with static email/password form fields; submitting does nothing, no authentication backend is wired up yet
- Railway build and deploy pipeline is verified working end to end

## Infrastructure (new - real, verified)

- Railway Postgres database service provisioned in the project ("Postgres" service, Online)
- DATABASE_URL and DIRECT_URL on the app service now point to the real database via Railway variable references (`${{Postgres.DATABASE_URL}}`), replacing the old placeholder connection string
- AUTH_SECRET set to a real, randomly generated 256-bit session-signing secret (generated locally, not a third-party credential)
- AUTH_URL and NEXT_PUBLIC_APP_URL set to the real production URL instead of localhost
- NODE_ENV set to "production"
- FEATURE_PUBLIC_REGISTRATION set to "true" (was "false") since real registration will be needed once auth is built
- AI/email/error-tracking/rate-limit variables remain clearly-labeled placeholders ("replace-with-real-...") since those require real third-party accounts the user must create — these are not fabricated

## Current Work

Awaiting a decision on whether to continue iterating via GitHub web edits + Railway auto-deploy to build real features (starting with authentication wired to the real database), or move to a real local development environment (e.g. Claude Code CLI).

## Blockers

- Repository visibility is still PUBLIC. Must be changed to private by the repository owner.
- No local install/build/test has ever been run against this scaffold outside of Railway's build environment.
- No authentication is implemented yet. The sign-in page is still static markup only.
- prisma/schema.prisma has not been migrated against the real database yet (no tables exist in Postgres yet).
- AI tutor, email, error tracking, and rate limiting remain unconfigured (require real third-party accounts/keys from the user).

## Remaining Launch Requirements

See LAUNCH_CHECKLIST.md for the full list. High level:

- Foundation: verified working Next.js app, database, auth, roles, CI
- Curriculum engine and admin editor
- Learning progress: XP, mastery, streaks, achievements
- Interactive code editor and safe execution
- Full learner experience (dashboard, world map, lessons, review, notes)
- Minimum launch curriculum (30 lessons, 100 missions, capstones)
- Security, accessibility, performance, and testing hardening
- Railway production deployment (build/deploy pipeline and database now verified working; still needs auth, migrations, and real features)

## Test Status

- Unit tests: not started
- Integration tests: not started
- End-to-end tests: not started
- Security tests: not started
- Note: no test runner has ever been executed against this repository

## Deployment Status

- GitHub repository: created, currently PUBLIC (owner should change to private)
- Railway application service: created and deployed successfully (service "Code-Game", live)
- Railway PostgreSQL service: created and online (service "Postgres"), linked to the app via real variable references; no tables migrated yet
- Production URL: https://code-game-production.up.railway.app (placeholder landing page + non-functional sign-in form only)

## Last Updated

2026-07-29 — Provisioned a real Railway Postgres database and linked it to the app service. Fixed a real production build failure ("Cannot read properties of null (reading 'useContext')" during static prerendering) by forcing dynamic rendering in the root layout. Replaced placeholder AUTH_SECRET/AUTH_URL/NODE_ENV/NEXT_PUBLIC_APP_URL with real values. Verified the live site still renders correctly after all changes. Repository is still public.
