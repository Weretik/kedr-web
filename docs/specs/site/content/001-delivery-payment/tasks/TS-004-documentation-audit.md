# TS-004 — Documentation and integrated audit

- **Covers:** R-001–R-012; SC-001–SC-008 (integrated evidence and source review).
- **Depends on:** TS-003.
- **Paths:** this SDD; `docs/features/site/delivery-payment.md`, `docs/features/README.md`, `docs/specs/README.md`, affected site module/SEO architecture and verification script registration if required by repository conventions.
- **Owner:** coordinator.
- **Test level:** documentation checks, scoped code audit and reuse of fresh focused test evidence.

## Work

Document actual route, three-library dependencies, Mermaid relationships, key files and exact focused tests in the feature card and indexes. Update architecture/module and SEO sitemap facts narrowly. Copy accepted concept to design/concept.png. Audit integrated changes for exact source facts, server/client boundaries, localized links/metadata, theme tokens, responsive structure, accessibility, security and unnecessary client work. Fix confirmed in-scope problems and repeat only invalidated checks. Review actual file-role map and each changed component/directory's responsibility before handoff; record deviations.

## Evidence

- Completed 2026-11-03. Feature card docs/features/site/delivery-payment.md, feature/spec indices, actual module map, SEO architecture and task traceability updated. Approved design/concept.png is included unchanged.
- Independent scoped audit reviewed actual delivery SDD, dictionary/components/tests, route, metadata, sitemap and new aliases/tags. No confirmed delivery findings. Source parity independently rechecked: UK28/RU28 exact. Labels/anchor IDs/sticky spacing, locale links, themes, responsive source and server/client boundaries reviewed.
- npm run docs:check: exit 0; 508 Markdown files checked for links, empty files and duplicate content. Delivery-only tests: UI8 + metadata9 + integration3 = 20 passed; individual commands are recorded in their tasks. Next typegen and final app typecheck passed; architecture boundaries passed.
- Existing uncommitted company/home/shell work and concurrent returns/model files retained. Shared exports and sitemap include parallel work without rewriting its content. No commit, push or deployment.
- Final whitespace check is recorded at handoff. Browser/manual/E2E/production-build and raster-fidelity verification were not run; theme/responsive conclusions are based on source wiring and component/SSR tests.

## Checkpoint

Feature docs/indexes/traceability match code; all required focused checks pass; no confirmed in-scope finding remains; completion report distinguishes source/code checks from browser evidence and preserves pre-existing changes.
