# ADR-0005: Remove the old Angular storefront

**Status:** accepted
**Decision date:** 2026-11-17
**Owners:** frontend
**Applications:** old Storefront (Angular, removed), Site (Next.js)
**Related:** [Site ADR-0001](../site/adr/0001-nextjs-public-site.md), [Site hosting](../site/platform/hosting.md)

## Context

The Next.js site (`apps/site`, Cloudflare Worker `kedr-site`) serves classkedr.com.ua. The Angular storefront (`apps/storefront`, `libs/storefront`, and the Angular `libs/shared/*` libraries only it used) was frozen and kept only until cutover. Keeping it cost CI time (build and tests on every affected change), about 40 Angular, PrimeNG and NgRx dependencies, and an extra ESLint profile.

## Options

| Option                  | Complexity | Risks                                                  |
| ----------------------- | ---------- | ------------------------------------------------------ |
| Keep the frozen app     | none       | dead code, dependency updates and CI time with no user |
| Remove it in one change | low        | none after cutover; git history keeps the code         |

## Decision and reason

Remove `apps/storefront`, `libs/storefront`, the Angular `libs/shared/*` libraries (`auth`, `data-access`, `forms`, `http`, `logging`, `theme`, `ui`, `util`), the palette generator, Angular and PrimeNG dependencies, the Angular ESLint profile and the Nx Angular generators, and the storefront CI steps. `libs/shared/api-contracts` stays. The old Cloudflare Pages project `kedr-web` is deleted by the owner after the domain is confirmed to point to `kedr-site`.

## Consequences

- Easier: one React stack; smaller install and CI.
- Harder: the old Angular code is only in git history (before this change).
- Reversibility: restore from git history; the live domain is not affected.

## Change history

| Date       | Change   | Link |
| ---------- | -------- | ---- |
| 2026-11-17 | Accepted | —    |
