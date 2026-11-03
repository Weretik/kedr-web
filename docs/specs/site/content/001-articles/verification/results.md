# Результати перевірок — 2026-11-03

Scope: EN-001, TS-001…TS-006, SC-001…SC-013; completed automated/source checks. All commands run from E:\RiderProjects\kedr-web with NX_DAEMON=false (and NX_TUI=false for coordinator commands).

| Area           | Final command                                                                                                                                                                   | Result                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Model          | `node node_modules/nx/dist/bin/nx.js run site-content-model:vite:test --output-style=static -- --run src/lib/articles/articles.spec.ts`                                         | exit 0, 17/17                                              |
| Source         | `npx nx run site-content-data-access:vite:test --skip-nx-cache --output-style=static -- --run`                                                                                  | exit 0, 7/7                                                |
| UI             | `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/articles/articles-content.spec.tsx`                                   | exit 0, 13/13                                              |
| SEO regression | `npx nx run site-content-seo:vite:test --skip-nx-cache --output-style=static -- --run`                                                                                          | exit 0, 37/37; 17 new                                      |
| Server/sitemap | `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run src/lib/articles/articles-page.spec.tsx src/lib/content-sitemap.spec.ts` | exit 0, 12/12; 10 new                                      |
| Source types   | `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static`                                                                                                  | exit 0; next typegen + source tsc                          |
| Test types     | `node node_modules/typescript/bin/tsc -p libs/site/content/{model,data-access,ui,seo,feature}/tsconfig.spec.json --noEmit` (each concrete project, not literal braces)          | all five exit 0                                            |
| Scoped lint    | `node node_modules/eslint/bin/eslint.js` with only new/changed article source/tests, public integration and next config                                                         | exit 0; UI agent independently checked owned UI/dictionary |
| Redirect map   | Node strip-types assert of articleRedirects against ARTICLE_SLUGS                                                                                                               | six mappings verified; locale preserved, statusCode301     |
| Images/content | Source tests + source/copy SHA-256                                                                                                                                              | six exact images, six UK/RU materials, 36 full paragraphs  |

Final test total: 86 passing assertions/cases across affected checks (64 new + 22 existing), without running whole site/repository suite. Red/Green evidence belongs to individual [task files](../tasks/README.md).

## Config correction and structure

The first new data-access spec typecheck found TS2307 resolving Vite under the generator's inherited old resolution mode. New data-access tsconfig was brought to the existing content bundler convention; all affected spec typechecks then passed. No root module-resolution change.

Header is outside request-query Suspense. Full text stays in server-only source and server reading UI, not in the page-size client leaf. HTML/metadata use the same normalization/listing rules. Child static params honor parent locale. Independent integration source review found no confirmed in-scope issues.

Only code/source evidence for HTTP semantics: the real local Next runtime was not started. Browser/manual/visual/HTTP checks, production build, E2E and full audit are unrun under the repository's separate-authorization rule. Therefore no screenshot, deployed 200/301/404 status or measured performance is claimed.

## Documentation and final diff

Documentation check: node tools/docs/check-markdown.mjs — exit 0, 587 Markdown files checked for valid links, nonempty files and duplicates. git diff --check — exit 0. Final changed-file review retained only article code/config/docs; unrelated wholesale concept files and the parallel wholesale SDD/index entry were left untouched. No commit, push or PR.

## Function audit / TS-007 — 2026-11-03

The explicit plugin function audit and responsibility split are complete; [full report](../code-audit/audit.md). Historical implementation results above remain unchanged.

Fresh after split: model18/18, source7/7, UI13/13, feature+sitemap13/13 — 51 focused tests. One route assertion became its own test case; shared sitemap now includes a parallel wholesale case. Site source types, model spec types and scoped model/index/guard ESLint exit0. Source invariant guard exit0:9allowed+5forbidden module edges,6locale-preserving301 mappings and Next config wiring. Independent post-refactor source review verified the unchanged public API and assertion coverage.

Audit documentation: node tools/docs/check-markdown.mjs — exit0,634 Markdown files valid. git diff --check — exit0. Final source guard additionally verifies stable public route/page-window exports; guard ESLint and rerun exit0. Source/UI behavior and foreign parallel changes remain intact. Browser/build/HTTP/E2E remain unrun.
