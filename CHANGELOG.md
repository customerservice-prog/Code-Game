# Changelog

All notable changes to this project will be documented in this file. This project follows a simple reverse-chronological log format (newest entries at the top).

## [Unreleased]

### Added

- CLAUDE.md — full build specification for the CodeQuest Academy application, to be used by Claude Code as the master implementation instruction.
- PROJECT_STATUS.md — tracking file for current build phase, completed features, blockers, and deployment status.
- LAUNCH_CHECKLIST.md — machine-readable and human-readable launch readiness checklist.
- KNOWN_ISSUES.md — tracking file for open bugs, limitations, and technical debt.
- DECISIONS.md — architecture decision record log.
- README.md — updated to describe the CodeQuest Academy project and technology stack.
- .gitignore — Next.js/Node/Prisma/env-aware ignore rules.
- .env.example — placeholder-only environment variable names (no real secrets).
- Repository scaffold (source files, unbuilt/untested — see PROJECT_STATUS.md):
  - package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js, .eslintrc.json
  - prisma/schema.prisma — starter data model covering identity, curriculum, progress, and operations tables
  - src/lib/config.ts — centralized application configuration (name, XP defaults, feature flags)
  - src/app/globals.css — design tokens and dark/light theme variables
  - src/app/layout.tsx, src/app/page.tsx — root layout and landing page placeholders
  - src/app/sign-in/page.tsx, src/app/dashboard/page.tsx — placeholder routes with no real auth or data yet
