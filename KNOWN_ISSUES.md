# Known Issues

Use this file to track known bugs, limitations, and technical debt discovered during development. Do not delete resolved issues — move them to a "Resolved" section so history is preserved.

## Open Issues

### Title: No database provisioned
- Severity: Critical
- Area: Infrastructure / Data layer
- Description: No Postgres (or any) database service exists in the Railway project. DATABASE_URL and DIRECT_URL only appear as Railway's auto-suggested placeholder values pulled from .env.example; they are not set as real, active variables and do not point to a real database.
- Impact: Nothing that requires persistence (accounts, curriculum, progress) can function.
- Workaround: None. A real Postgres service must be provisioned and DATABASE_URL configured before any data-backed feature is built.
- Status: Open
- Date Logged: 2026-07-29

### Title: Sign-in page is non-functional
- Severity: Critical
- Area: Authentication
- Description: src/app/sign-in renders a static email/password form. There is no auth backend, session handling, or credential verification wired up. Submitting the form does nothing meaningful.
- Impact: Users cannot actually sign in; this is a visual placeholder only.
- Workaround: None yet.
- Status: Open
- Date Logged: 2026-07-29

### Title: No real environment variables/secrets configured on Railway
- Severity: High
- Area: Infrastructure
- Description: Aside from Railway's own system variables, only placeholder values suggested from .env.example exist (e.g. "replace-with-real-provider-key"). None have been added as actual active variables with real values.
- Impact: Any feature depending on a database, auth secret, or third-party API key will fail once implemented, until real values are set.
- Workaround: None. Real values must be generated/obtained and added deliberately (never fabricated by an automated agent).
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

## Known Architectural Limitations

- Server-side arbitrary code execution is intentionally excluded from the launch version for security reasons.
- Full GitHub App repository import is deferred to a post-launch phase; launch version supports sample/upload-based project exploration only.
- AI tutor features are optional and feature-flagged; the application must remain fully usable without an AI provider configured.
