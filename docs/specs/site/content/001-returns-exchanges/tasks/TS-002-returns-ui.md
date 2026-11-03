# TS-002 — Returns UI

- **Covers:** SC-001…SC-007.
- **Depends on:** TS-001.
- **Paths:** libs/site/content/ui, libs/site/content/feature.
- **Test level:** component; native details semantics and theme/responsive code review.
- **Work:** reproduce approved compact composition within existing shell; compose full policy and FAQ after notes/contact; correct section anchors, configured phone, locale and semantic heading order. No global theme changes.
- **Evidence:** completed. Red: returns-content.spec.tsx against a title-only placeholder produced 8 behavioral failures. Green/final regression: node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/returns/returns-content.spec.tsx — exit 0, 8 tests passed (8.40s). Initial Green had one 5s DOM-query timeout; scoping the query to its header resolved it without increasing timeout. Refactor: six cohesive UI components and separate typed dictionaries/policy source. Both locales, anchors, phone and policy/FAQ markup covered. Theme/responsiveness reviewed in code; no browser claim.
- **Checkpoint:** all in-scope component assertions pass; files separated by responsibility; dark/light and responsive tokens reviewed in code.
