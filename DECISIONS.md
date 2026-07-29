# Architecture Decision Record

This file records important architectural and product decisions made during the build, along with the reasoning behind them. Add a new entry for every significant decision — do not overwrite or delete previous entries.

## Template

### [Date] — [Decision Title]

- **Context:** What problem or question prompted this decision
- **Decision:** What was decided
- **Alternatives considered:** Other options and why they were not chosen
- **Consequences:** Tradeoffs, risks, or follow-up work created by this decision

## Decisions Log

### 2026-07-29 — Initial technology stack

- **Context:** Needed a modern, maintainable full-stack architecture for an interactive coding education platform.
- **Decision:** Next.js (App Router) with TypeScript strict mode, React, PostgreSQL, Prisma ORM, Tailwind CSS, Zod for validation, and a maintained authentication library. Hosting on Railway for both the application and PostgreSQL. Source control and CI on GitHub with GitHub Actions.
- **Alternatives considered:** Separate frontend/backend microservices were considered and rejected as unnecessary complexity for a single-owner launch product.
- **Consequences:** The application will be one well-structured full-stack repository rather than multiple services.

### 2026-07-29 — Code execution security boundary

- **Context:** The product requires learners to write and run code, which introduces security risk if executed on the server without isolation.
- **Decision:** Launch version supports only safe, sandboxed client-side JavaScript execution (e.g. isolated worker). No unrestricted server-side arbitrary code execution will ship in the initial launch.
- **Alternatives considered:** Server-side sandboxed execution (e.g. containerized runners) was considered but deferred due to the additional isolation and security work required.
- **Consequences:** Some mission types (e.g. multi-language server-side exercises) are deferred to a post-launch phase.
