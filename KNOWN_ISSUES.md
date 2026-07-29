# Known Issues

Use this file to track known bugs, limitations, and technical debt discovered during development. Do not delete resolved issues — move them to a "Resolved" section so history is preserved.

## Open Issues

### Title: Sign-in page is non-functional
- Severity: Critical
- Area: Authentication
- Description: src/app/sign-in renders a static email/password form. There is no auth backend, session handling, or credential verification wired up. Submitting the form does nothing meaningful.
- Impact: Users cannot actually sign in; this is a visual placeholder only.
- Workaround: None yet.
- Status: Open
- Date Logged: 2026-07-29

### Title: Prisma schema not migrated against the real database
- Severity: High
- Area: Data layer
- Description: A real Postgres database now exists and is linked via DATABASE_URL/DIRECT_URL, but prisma/schema.prisma has never been run through `prisma migrate`. No tables exist yet.
- Impact: No feature that requires persistence can function yet.
- Workaround: None. Requires running Prisma migrations (ideally from a real local/CI environment with a terminal).
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

## Resolved Issues

### Title: Railway build failing due to invalid ESLint rule reference
- Severity: Critical
- Area: Build pipeline
- Description: .eslintrc.json referenced the rule "@typescript-eslint/no-explicit-any" without the corresponding plugin properly configured, causing "Definition for rule ... was not found" errors during next build across dashboard/page.tsx, layout.tsx, page.tsx, sign-in/page.tsx, and lib/config.ts.
- Impact: Railway deployment failed; no live site was reachable.
- Workaround/Fix: Simplified .eslintrc.json to just `{"extends": "next/core-web-vitals"}`, removing the custom rule. Committed to main; Railway auto-redeployed and the build succeeded.
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
