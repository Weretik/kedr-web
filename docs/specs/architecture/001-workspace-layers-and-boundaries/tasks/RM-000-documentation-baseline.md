# RM-000 — Align project-specific documentation baseline

- **Findings:** AF-011
- **Requirements:** AR-009
- **Depends on:** none
- **Owner:** frontend docs
- **Exact paths:** root `README.md`; `docs/AGENTS.md`; `docs/architecture/**`;
  `docs/standards/**`; `docs/specs/_templates/**`; this SDD

## Work

- [x] Separate Admin/Mobile RTK Query rules from Storefront Angular HttpClient.
- [x] Align Node/Expo/RN/test inventory with actual package/config.
- [x] Resolve Mobile app/core reducer ownership and cross-domain orchestration wording.
- [x] Add blocking audit/remediation workflow and indexes.

## Verification

- `npm run docs:check`: passed, 353 Markdown files.
- Prettier check for all changed/new Markdown: passed.
- Full `npm run docs:format:check`: reports 14 pre-existing, unchanged files;
  no file changed by RM-000 is in the warning list.
- Active architecture/standards/template version search: no stale Expo 56,
  React Native 0.85, jest-expo 56 or Node 24.15 claim.

## Checkpoint

AF-011 is verified: relevant docs checks and targeted format gate pass; the
repository-wide pre-existing formatting debt is outside this finding.
