# Known Issues

Use this file to track known bugs, limitations, and technical debt discovered during development. Do not delete resolved issues - move them to a "Resolved" section so history is preserved.

## Open Issues

### Title: Curriculum content volume is far below the launch minimum
- Severity: Medium
- Area: Curriculum
- Description: Only 1 of 17 worlds (Web Foundations) has real published content: 2 modules, 4 lessons, 4 missions. CLAUDE.md section 12 requires at least 30 lessons and 100 missions at launch.
- Impact: The product is not launch-ready from a content perspective, even though the underlying engine (data model, seed pipeline, renderer, progress tracking) is real and working.
- Workaround: The other 16 worlds are correctly marked "Upcoming" in the UI rather than shown as empty/broken, per CLAUDE.md section 11.
- Status: Open
- Date Logged: 2026-07-29

### Title: Missions are preview-only - no submission or grading yet
- Severity: Medium
- Area: Curriculum / Interactive missions
- Description: The lesson viewer lists each lesson's missions (title, type, XP) but there is no UI to actually submit an answer, run code, or receive a grade. This is intentionally deferred to CLAUDE.md's Phase 4 (Interactive missions).
- Impact: Learners can read lesson content and mark lessons complete, but cannot yet complete missions for XP or skill mastery. Note: as of 2026-07-30, lesson completion itself does award real XP/levels and update a real streak - only mission-level XP/grading remains unbuilt.
- Workaround: The mission list is clearly labeled "Interactive mission solving and grading is not built yet" so it is not presented as a finished feature.
- Status: Open
- Date Logged: 2026-07-29

### Title: Mastery scoring is not implemented
- Severity: Low
- Area: Learning progress
- Description: The UserSkill/masteryScore tables exist in the schema but nothing writes to them yet. XP, levels, streaks, and a first achievements system (all added 2026-07-30) are real so far; per-skill mastery scoring is the remaining unbuilt piece of learning progress.
- Impact: The dashboard does not show any skill mastery breakdown - only XP/level/streak/achievements, all of which are real.
- Workaround: None needed - mastery scoring simply is not surfaced anywhere yet, so nothing fake is shown.
- Status: Open
- Date Logged: 2026-07-30

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

### Title: Achievements were not implemented
- Severity: Low
- Area: Learning progress
- Description: The Achievement/UserAchievement tables existed in the schema but nothing wrote to them or showed real earned/locked state anywhere in the UI.
- Impact: Learners had no way to see recognition for real milestones beyond raw XP/streak numbers.
- Workaround/Fix: Added a getAchievements helper in src/lib/gamification.ts that derives five real achievements (First Steps, Getting Serious, Streak Starter, Streak Keeper, World Graduate) entirely from existing real data (completed-lesson count, current/longest streak, and per-world completion), with no new database writes needed. Rendered as an Earned/Locked grid on the dashboard. Verified live: completing the final lesson in Web Foundations flipped "World Graduate" from Locked to Earned in production.
- Status: Resolved
- Date Logged: 2026-07-30
- Date Resolved: 2026-07-30

### Title: A GitHub web-editor commit creating a new file silently did not save, breaking 4 deployments
- Severity: High
- Area: Documentation / tooling process
- Description: While adding src/lib/gamification.ts through the GitHub web editor's "new file" flow, the commit dialog showed a normal success state (confirmed commit message, "Commit directly to the main branch" selected), but the file was not actually present in the repository afterward. Four subsequent commits that imported from "@/lib/gamification" (actions.ts, mark-complete-button.tsx, dashboard/page.tsx, world-map/page.tsx) were then made on top of a repository that did not contain that file, and each triggered a Railway deployment that failed at build time with "Module not found: Can't resolve '@/lib/gamification'".
- Impact: Four consecutive Railway deployments failed. The live site was never affected, since Railway kept serving the last successful deployment throughout, but real progress tracking and time were lost until this was caught.
- Workaround/Fix: Caught by checking Railway's deployment history directly (showed "FAILED" with build logs naming the missing module) instead of assuming success. Confirmed the file was missing by browsing the src/lib directory on GitHub. Recreated src/lib/gamification.ts, and this time verified the file's presence in the GitHub directory listing before moving on to the next step. Confirmed the next Railway deployment succeeded and the live site showed correct XP/streak values.
- Status: Resolved
- Date Logged: 2026-07-30
- Date Resolved: 2026-07-30

### Title: PROJECT_STATUS.md update silently produced an empty commit
- Severity: Medium
- Area: Documentation / tooling process
- Description: A prior commit titled "Update PROJECT_STATUS.md" was made via the GitHub web editor's clipboard-paste workflow, but the paste did not actually change any text before committing, resulting in a real commit with 0 files changed. This left the document stale, still describing the curriculum engine as not started even after it had been built and verified live.
- Impact: The tracking document did not reflect real, verified project state, which could have misled anyone reading it about progress.
- Workaround/Fix: Discovered by checking the commit diff directly (GitHub showed "0 file changed" for that commit) rather than trusting the commit list alone. Rewrote PROJECT_STATUS.md with accurate current state and verified the new commit actually contains a real diff before moving on. Going forward, each editor paste is verified with a screenshot of both the start and end of the file before committing. (This same class of paste-silently-not-applying bug recurred several more times during later gamification/achievements work and was caught every time using the same verification habit - always check the actual rendered content or the commit's file diff, never assume a click-through succeeded.)
- Status: Resolved
- Date Logged: 2026-07-29
- Date Resolved: 2026-07-29

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
