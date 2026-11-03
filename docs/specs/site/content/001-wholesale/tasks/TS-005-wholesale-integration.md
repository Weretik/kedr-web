# TS-005 — Серверная composition, route и sitemap

- **Status:** completed 2026-11-03 (automated/source scope).
- **Covers:** SC-001, SC-003, SC-004, SC-005, SC-008, SC-011, SC-015, SC-016, SC-017.
- **Depends on:** EN-001, TS-001, TS-002, TS-003, TS-004.
- **Paths:** `libs/site/content/feature/src/lib/wholesale-page.tsx`; `libs/site/content/feature/src/lib/wholesale-page.spec.tsx`; `libs/site/content/feature/src/lib/content-sitemap.ts`; `libs/site/content/feature/src/lib/content-sitemap.spec.ts`; `libs/site/content/feature/src/index.ts`; `apps/site/src/app/[locale]/(content)/wholesale/page.tsx`.
- **Test level:** Focused integration server output/sitemap + source route guard; scoped site typecheck для route/types.
- **Architecture baseline:** EN-001 must be complete before imports. Page owns projection COMPANY + dictionary + getCatalogTree + catalog UI slot; thin route owns params/locale/metadata call.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Добавить async WholesalePage с публичным getCatalogTree; исключить doorsId без новой копии mapper; compose CategoryCards compact либо null slot, собственный UI и один BreadcrumbList.
- [x] Добавить thin route с await params/isLocale/notFound и domain metadata; не создавать новый layout/main или клиентскую загрузку.
- [x] Добавить один sitemap descriptor, сохранить все existing public exports и neighboring entries; app sitemap не менять.
- [x] Проверить полное/частичное/null/empty/doors-only дерево обеих локалей, реальные encoded category href и сохранённое server content; header/footer/Organization остаются у layout.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. При NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_NO_CLOUD=true, NX_TUI=false:
node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run wholesale-page content-sitemap.

Red: exit1, 15 ожидаемых behavioral failures /3 existing sitemap tests passed (18 total). Рабочий импортируемый async scaffold возвращал null, wholesale descriptor отсутствовал; harness не был сломан.

Green и интеграционная regression на финальной formatted сборке: exit0, 2files/18 tests (14 page +4 sitemap), uncached. Контролируется только public getCatalogTree; real UI/catalog/SEO output проверен обеих локалей для complete/partial/null/empty/doors-only, actual href/COMPANY, one H1/no nested main и одного BreadcrumbList.

node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static → exit0, Next route types generated + tsc passed, uncached. node tools/architecture/check-project-boundaries.mjs → exit0, actual graph103 после новых imports. Thin locale guards/root ownership и существующий LocaleSwitch reviewed по source. Независимое integration review замечаний не нашло. HTTP200/404/head/build не запускались.

## Checkpoint

Функция интегрирована без дублирования shell; нормальный и degraded server output полезны, sitemap имеет обе локали, typecheck не обнаруживает route/type ошибок.
