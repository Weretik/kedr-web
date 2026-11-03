# TS-007 — Аудит функції та розділення model responsibilities

- **Status:** completed 2026-11-03 (source/automated).
- **Covers:** existing SC-001…SC-013; direct refactor scope SC-004/SC-010/SC-011.
- **Depends on:** EN-001, TS-001…TS-006 completed.
- **Findings:** AF-001, AF-002 — verified у [аудиті](../code-audit/audit.md).
- **Owner:** coordinator; дві незалежні read-only audit packages та post-refactor review.
- **Paths:** model article types/query/routes/window/specs/public index; article SDD verification guard, documentation and feature card.
- **Test level:** characterization unit + data/UI/feature regression; source/type/lint/boundary checks.

## Work

Виконані фази00–06 web-frontend:frontend-code-audit. Route path/slug identities/articlePath перенесені до article-routes.ts; window algorithm — до article-page-window.ts. Query-файл залишений для normalization/parse/serialize/href. Public API та поведінка збережені; existing route/window assertions перенесені до subject specs без втрати перевірок. Cohesive UI/source/feature/SEO modules залишені разом за записаними keep-рішеннями.

Source-regression 301 map/config і positive/negative boundary assertions збережені як [відтворюваний guard](../verification/source-invariants.mjs). Це перевірка source/contracts, не HTTP runtime.

Structural move не потребує штучного Red за правилами audit/template. Одна попередня route assertion виділена в окремий case; нових продуктових сценаріїв немає.

## Evidence

- Model command: `node node_modules/nx/dist/bin/nx.js run site-content-model:vite:test --output-style=static -- --run src/lib/articles/articles.spec.ts src/lib/articles/article-routes.spec.ts src/lib/articles/article-page-window.spec.ts` — exit0,18/18.
- Source consumer: `node node_modules/nx/dist/bin/nx.js run site-content-data-access:vite:test --output-style=static -- --run` — exit0,7/7.
- UI consumer: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/articles/articles-content.spec.tsx` — exit0,13/13.
- Feature/sitemap consumer: `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run src/lib/articles/articles-page.spec.tsx src/lib/content-sitemap.spec.ts` — exit0,13/13.
- Total after split: 51 focused tests; shared sitemap includes a concurrent wholesale test.
- `node --experimental-strip-types docs/specs/site/content/001-articles/verification/source-invariants.mjs` — exit0,9 allowed +5 forbidden edges;6 exact 301 mappings + config wiring.
- `node node_modules/typescript/bin/tsc -p libs/site/content/model/tsconfig.spec.json --noEmit` — exit0.
- `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static` — exit0.
- Scoped model/index/guard ESLint — exit0.
- Independent post-refactor review — no defects; public API and assertions retained.

## Checkpoint

AF-001/AF-002 verified; actual tree/docs/exports current. Runtime/build/browser/HTTP/E2E were not run. Foreign wholesale/catalog/global-policy edits remain untouched. Final docs/whitespace checks recorded in verification/results.md.
