# Known Issues

Use this file to track known bugs, limitations, and technical debt discovered during development. Do not delete resolved issues - move them to a "Resolved" section so history is preserved.

## Open Issues

### Title: Curriculum content volume is far below the launch minimum
- Severity: Medium
- Area: Curriculum
- Description: Only 1 of 17 worlds (Web Foundations) has real published content: 1 module, 2 lessons, 2 missions. CLAUDE.md section 12 requires at least 30 lessons and 100 missions at launch.
- Impact: The product is not launch-ready from a content perspective, even though the underlying engine (data model, seed pipeline, renderer, progress tracking) is real and working.
- Workaround: The other 16 worlds are correctly marked "Upcoming" in the UI rather than shown as empty/broken, per CLAUDE.md section 11.
- Status: Open
- Date Logged: 2026-07-29

### Title: Missions are preview-only - no submission or grading yet
- Severity: Medium
- Area: Curriculum / Interactive missions
- Description: The lesson viewer lists each lesson's missions (title, type, XP) but there is no UI to actually submit an answer, run code, or receive a grade. This is intentionally deferred to CLAUDE.md's Phase 4 (Interactive missions).
- Impact: Learners can read lesson content and mark lessons complete, but cannot yet complete missions for XP or skill mastery.
- Workaround: The mission list is clearly labeled "Interactive mission solving and grading is not built yet" so it is not presented as a finished feature.
- Status: Open
- Date Logged: 2026-07-29

### Title: AI tutor, email, error tracking, and rate limiting are unconfigured
- Severity: Medium
- Area: Infrastructure
- Description: AI_API_KEY, EMAIL_API_KEY, ERROR_TRACKING_DSN, RATE_LIMIT_PROVIDER_* remain clearly-labeled placeholders (e.g. "replace-with-real-provider-key"). These require real third-party accounts/keys that must be provided by the project owner - they are intentionally not fabricated.
- Impact: Related features stay feature-flagged off/inactive until real values are supplied.
- Workaround: Features are flagged off by default so the app remains usable without them.
- Status: Open
- Date Logged: 2026-07-29

### Title: Database schema is synced via "prisma db push" instead of reviewed migrations
- Severity: Low
- Area: Data layer
- Description: There is no local dev environment available to run `prisma migrate dev` and generate reviewable migration SQL files. Instead, `prisma db push` runs automatically on every container start to keep the live database schema in sync with prisma/schema.prisma.
- Impact: Schema changes are not tracked as reviewable migration history, and `db push` can silently apply destructive changes (hence --accept-data-loss) without a diff to review first. Fine for a single environment early on; risky once there are multiple environments or collaborators.
- Workaround: None yet. Should be replaced with real prisma migrate history once a proper local/CI environment exists.
- Status: Open
- Date Logged: 2026-07-29

## Resolved Issues

### Title: Sign-in page is non-functional
- Severity: Critical
- Area: Authentication
- Description: src/app/sign-in rendered a static email/password form with no auth backend, session handling, or credential verification wired up.
- Impact: Users could not actually sign in; it was a visual placeholder only.
- Workaround/Fix: Implemented real NextAuth credentials authentication (src/lib/auth.ts) backed by Postgres via Prisma, with bcrypt password hashing. Added a public registration endpoint and a real sign-up page, wired the sign-in page to call NextAuth's signIn(), and protected /dashboard with a real server-side session check. Verified end to end in production: created a real test account, confirmed the row in Postgres has a bcrypt-hashed password, and confirmed the session-protected dashboard renders the signed-in user's email.
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

### Title: Prisma schema not migrated against the real database
- Severity: High
- Area: Data layer
- Description: A real Postgres database existed and was linked via DATABASE_URL/DIRECT_URL, but prisma/schema.prisma had never been applied to it. No tables existed yet.
- Impact: No feature that requires persistence could function yet.
- Workaround/Fix: Added `prisma db push --accept-data-loss` to the app's start script so the schema syncs to the real database on every deploy. All 28 tables now exist and are confirmed via Railway's database browser. See the "prisma db push instead of reviewed migrations" open issue above for the follow-up tech debt this introduces.
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

### Title: Railway deployment failing because "prisma db push" ran during the build step
- Severity: Critical
- Area: Build pipeline
- Description: The build script was changed to run `prisma generate && prisma db push --accept-data-loss && next build`. This failed every build with `Error: P1001: Can't reach database server at postgres.railway.internal:5432`.
- Impact: Every deployment failed during the build step; the previous (pre-auth) deployment remained active in the meantime, so the live site stayed up but without any of the new authentication code.
- Workaround/Fix: Railway's build step runs in an isolated builder environment without access to the project's private network, so it cannot reach other services like Postgres via their *.railway.internal hostname - only the running deploy container has that access. Moved `prisma db push` out of the build script and into the start script (`prisma db push --accept-data-loss --skip-generate && next start`), keeping `prisma generate` (which needs no DB access) in the build script. Verified the fix: the next deploy's logs showed "Your database is now in sync with your Prisma schema" followed by a successful Next.js server start.
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

### Title: Railway build failing due to invalid ESLint rule reference
- Severity: Critical
- Area: Build pipeline
- Description: .eslintrc.json referenced the rule "@typescript-eslint/no-explicit-any" without the corresponding plugin properly configured, causing "Definition for rule ... was not found" errors during next build across dashboard/page.tsx, layout.tsx, page.tsx, sign-in/page.tsx, and lib/config.ts.
- Impact: Railway deployment failed; no live site was reachable.
- Workaround/Fix: Simplified .eslintrc.json to just {"extends": "next/core-web-vitals"}, removing the custom rule. Committed to main; Railway auto-redeployed and the build succeeded.
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

### Title: Production build failing with "Cannot read properties of null (reading 'useContext')"
- Severity: Critical
- Area: Build pipeline
- Description: After setting NODE_ENV to the standard "production" value and pointing DATABASE_URL/DIRECT_URL at the real Postgres database, the Railway build began failing during "Generating static pages" for "/" and "/sign-in" with a null useContext error, plus a secondary "<Html> should not be imported outside of pages/_document" error on the auto-generated 404/500 pages.
- Impact: Railway deployment failed; live site was temporarily unreachable via the newest deployment (previous deployment stayed active in the meantime).
- Workaround/Fix: Added `export const dynamic = "force-dynamic";` to the root layout (src/app/layout.tsx) so pages render per-request instead of being statically prerendered at build time, avoiding the static-generation bug. Committed to main; Railway auto-redeployed and the build succeeded. Verified the live site still renders correctly.
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

## Known Architectural Limitations

- Server-side arbitrary code execution is intentionally excluded from the launch version for security reasons.
- Full GitHub App repository import is deferred to a post-launch phase; launch version supports sample/upload-based project exploration only.
- AI tutor features are optional and feature-flagged; the application must remain fully usable without an AI provider configured.
