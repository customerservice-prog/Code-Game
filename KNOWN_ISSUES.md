# Known Issues

Use this file to track known bugs, limitations, and technical debt discovered during development. Do not delete resolved issues — move them to a "Resolved" section so history is preserved.

## Open Issues

_None recorded yet. Add issues here as they are discovered during implementation, in the format below._

### Template

- **Title:** Short description of the issue
- **Severity:** Critical / High / Medium / Low
- **Area:** e.g. Authentication, Curriculum Engine, Code Editor
- **Description:** What is wrong and how it was discovered
- **Impact:** Who or what is affected
- **Workaround:** Any temporary mitigation, if applicable
- **Status:** Open / In Progress / Resolved
- **Date Logged:** YYYY-MM-DD

## Resolved Issues

_None yet._

## Known Architectural Limitations

- Server-side arbitrary code execution is intentionally excluded from the launch version for security reasons.
- Full GitHub App repository import is deferred to a post-launch phase; launch version supports sample/upload-based project exploration only.
- AI tutor features are optional and feature-flagged; the application must remain fully usable without an AI provider configured.
