# Delivery and payment — architecture and responsibilities audit

- Date: 2026-11-03.
- Feature: [001 — Delivery and payment](../README.md).
- Scope: delivery UI/dictionary, metadata library boundary (not SEO semantics), server feature, thin route and immediate sitemap/export integration; three content project configs and focused tests. Existing home/shell/catalog and concurrent returns implementation are preserved.
- Authorization: user explicitly requested architectural audit and fixes using frontend-code-audit. Apply relevant phases 00/01/03/04/05/06 to this feature; state/API phase is not applicable because the delivery flow has no fetch, mutation, store or transport DTO.
- Delivery status: verified; AF-001 closed with fresh configuration, lint, type and regression evidence.

## Sources and baseline

- Rules: [root AGENTS](../../../../../../AGENTS.md), [site AGENTS](../../../../../../apps/site/AGENTS.md), [site modules](../../../../../architecture/site/structure/modules.md), [routing/server boundary](../../../../../architecture/site/runtime/application.md), [design system](../../../../../standards/site/design-system.md), [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md) and [accepted feature design](../design/frontend.md).
- Audit procedure: E:/Development/Skills/frontend-code-audit/SKILL.md and E:/Development/Templates/frontend-sdd/code-audit phases01/03/04/05/06. Site-specific rules take precedence over generic React Admin/router conventions.
- Baseline: cached Nx graph resolves the three aliases and static dependencies; all three effective lint targets have cache enabled and the invalid manual inputs described below. Root eslint.config.cjs exists; .eslintrc.json, .eslintignore and eslint.config.mjs do not.
- Actual graph: content/feature consumes content/ui, core/i18n and test-only core/seo/config. content/ui consumes permitted core/config, core/i18n and shared/ui; content/seo delegates to core/seo. Shared barrels also expose independent returns work; those exports are retained.

## Finding AF-001

| Field                    | Evidence                                                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity / status        | P2 / verified                                                                                                                                                                                                                                                                       |
| Exact baseline locations | libs/site/content/ui/project.json:9–16; libs/site/content/seo/project.json:9–16; libs/site/content/feature/project.json:9–16                                                                                                                                                        |
| Rule and source          | Actual targets must enforce and invalidate the current architecture/tooling rules: site module configuration conventions, audit phases01/05. Installed @nx/eslint plugin.js:280–302 computes actual ESLint config, dependency and external tsconfig inputs.                         |
| Evidence                 | All three targets override inferred lint.inputs with nonexistent root config paths; cached graph retains those exact values. nx.json default inputs cover project files, while sharedGlobals is empty. The active root eslint.config.cjs and its module-boundary rules are omitted. |
| Impact                   | A root rule/config change can reuse a cached lint result from the prior rule set. Dependency and custom-rule inputs inferred by the plugin are also suppressed.                                                                                                                     |
| Owner / target           | Frontend coordinator; remove the three redundant overrides and use the installed Nx ESLint inference.                                                                                                                                                                               |
| Dependent task           | [TS-005 — Architecture audit fixes](../tasks/TS-005-architecture-audit.md); prerequisite for closing this audit.                                                                                                                                                                    |
| Verification             | Refreshed graph and [saved target evidence](lint-targets.json) include root/local CJS configs, ^default and custom rules for all three libraries; scoped lint, three spec typechecks and three focused SSR tests pass. Independent closure review confirms verified status.         |

## Responsibility and structure decisions

| Area                                     | Decision                                                | Rationale                                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delivery-payment-page.tsx                | keep                                                    | Selects locale dictionary and composes five page blocks; no transport, business rules, shell or client state.                                                                                   |
| delivery-payment/                        | keep five production components plus one colocated test | Header/navigation, terms, order steps, important terms and contact are independent visual responsibilities already separated. No generic catch-all directory or project-defined size violation. |
| delivery-payment-terms.tsx               | keep                                                    | Shipping/payment have the same static panel contract and lifecycle; the shared renderer avoids duplicate markup. No independent state/API flow is mixed into it.                                |
| order-steps.tsx                          | keep                                                    | Four ordered source instructions and their responsive presentation. Splitting at the first colon is explicitly allowed by the accepted source-copy contract.                                    |
| UI Next Link, locale helpers and COMPANY | keep                                                    | Declarative links and UI dependencies on core/i18n and core/config are allowed by this Site's rules. No useRouter, route state or imperative navigation is present.                             |
| dictionary                               | keep                                                    | One static localized source resource, no Angular runtime dependency. Preserving all source keys is intentional; adding a separate delivery model library is unnecessary.                        |
| metadata and sitemap owners              | keep                                                    | Route delegates metadata; domain SEO delegates core policy; app composes public content descriptors with existing catalog/home entries. No SEO behavior redesign in this audit.                 |
| public exports                           | keep                                                    | Consumers use documented aliases; no private DTO/parser/transport leak or dependency cycle. Concurrent returns exports remain independent.                                                      |

## Verification and limits

- Source and tests use existing Vitest and TypeScript configs. The earlier app typecheck excluded spec files; run the three narrow tsconfig.spec.json checks as audit evidence.
- Fresh checks: scoped ESLint of delivery source/tests and thin route — exit 0; tsc --noEmit against ui/seo/feature tsconfig.spec.json — all three exit 0; delivery feature SSR/sitemap regression — 3 tests passed, exit 0. [TS-005](../tasks/TS-005-architecture-audit.md) records exact commands.
- Refreshed graph: all three lint targets include active root/local CJS, upstream dependencies and tools/eslint-rules; allowed feature→UI and forbidden UI→feature/core→domain directions verified using the actual project validator. See [machine-readable evidence](lint-targets.json).
- One initial graph-check assertion incorrectly demanded an explicit tsconfig.base.json input. Installed plugin lines187–191 intentionally delegate root tsconfig to the native selective hasher; corrected the checker to match actual supported semantics. This was an audit-check expectation error, not a remaining project defect.
- Independent closure review confirmed AF-001 verified and no further findings. Production runtime code and existing public contracts did not change.
- No browser/manual/visual/E2E or production build; the audit concerns code boundaries, configuration and responsibilities.

- Documentation validation: npm run docs:check — exit 0, 533 Markdown files; final git diff --check — exit 0.
