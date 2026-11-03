# TS-008 — Product index, seed и sitemap

- **Covers:** SC-020–SC-021, SC-024, SC-026–SC-028.
- **Depends on:** TS-002, TS-006.
- **Status:** implemented, index/crawling/robots verified.
- **Exact paths:** `libs/site/product/data-access/src/lib/crawling/product-index-loader.ts`, `.spec.ts`; `libs/site/product/feature/src/lib/crawling/product-sitemap.ts`, `.spec.ts`; `apps/site/src/app/product/sitemap.ts`; `apps/site/src/app/robots.ts`; `libs/site/core/seo/src/lib/crawling/{robots-file.ts,crawling.spec.ts}`.
- **Test level:** unit pagination/sharding + focused transport/core input integration.
- **Baseline:** [SEO sitemap decision](../design/seo.md), installed generateSitemaps API; core не зависит от product.

## Work

- [x] Typed getPublicProducts, All/IdAsc, max100/page, обе locale. Отдельно expose первую реальную страницу для seed без полного обхода.
- [x] Bounded best-effort индекс, дедупликация SKU/locale/slug, один retry при наблюдаемой несогласованности/межстраничных дублях, отсутствие partial-success при ошибке. Не обещать атомарный snapshot без provider version token.
- [x] Product entries строить из подтверждённых localized listings; не добавлять lastModified и N detail calls ради даты.
- [x] Shards ≤20000 URL и <50 MB XML, valid id parsing, cache/lifetime; тесты на границах, дубликатах, missing locale и failure.
- [x] Thin metadata route использует `id: Promise<string>`; root sitemap сохранить.
- [x] App robots в индексируемом окружении передаёт root+product URLs в universal core builder; preview не перечисляет продукты и сохраняет disallow `/`.
- [x] Проверить ответственность loader/sitemap builder/robots composition, не добавлять API calls внутрь core.

## Evidence

Data index coverage входит в55 tests P-DATA; final index-only retest10/10. P-CRAWL: initial empty entries Red у root, затем .\node_modules\.bin\vitest.cmd run --config libs/site/product/feature/vite.config.mts src/lib/crawling/product-sitemap.spec.ts src/lib/crawling/product-sitemap-shards.spec.ts — exit0,2 files/29 tests. Проверены canonical/locale identity, failures/IDs/empty,20001 URL split и UTF8 budget против serializer установленного Next. Core robots behavioral Red отсутствовавшего shard, затем5/5 compatibility tests. Root sitemap сохранён; robots preview не читает feed. Atomic snapshot/live XML не заявлены.

Подробности: [implementation evidence](../verification/implementation.md).

## Checkpoint

Seed доступен без обхода всего каталога, sitemap содержит только корректные canonical entries и укладывается в лимиты, исходный robots/root sitemap contract сохранён без core→domain зависимости.
