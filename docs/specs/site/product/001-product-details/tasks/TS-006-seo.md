# TS-006 — Metadata и структурированные данные

- **Covers:** SC-018–SC-025, SC-027.
- **Depends on:** TS-002.
- **Status:** implemented, 9 SEO tests pass.
- **Exact paths:** `libs/site/product/seo/src/lib/inputs/product-seo-input.ts`, `metadata/product-metadata.ts`, `json-ld/product-json-ld.ts`, `json-ld/product-breadcrumb-json-ld.ts`, adjacent `.spec.ts`; `libs/site/product/feature/src/lib/mapping/product-seo-input.ts`.
- **Test level:** unit builders + focused locale input mapping.
- **Baseline:** [SEO design](../design/seo.md); `seo type:util` без импорта product/model, существующие core metadata/JsonLd.

## Work

- [x] Сформировать локализованный title/description, self canonical, подтверждённые reciprocal alternates и полный OG object.
- [x] Input формировать из той же нормализованной версии фактов, что отображается UI; не использовать demo values.
- [x] Product/Offer с price>0 и реальным stock, price-query без offers, BreadcrumbList из видимого trail; без выдуманных brand/ratings.
- [x] Обрабатывать отсутствие фото и отказ второго языка; core defaults обеих locale не должны вернуть неподтверждённую ссылку.
- [x] Проверить escaping через существующий server JsonLd и сохранение indexing gate.
- [x] Удержать mapping в feature, pure builders в seo; не смешивать SEO с fetch/UI.

## Evidence

Root: valid Red — неподтверждённый ru-UA alternate и отсутствующий Offer. Затем .\node_modules\.bin\vitest.cmd run --config libs/site/product/seo/vite.config.mts — exit0,2 files/9 tests. Подтверждены conditional Offer, OutOfStock, no invented fields, canonical/peer locale gate, safe JSON-LD renderer. Mapping в feature, SEO не импортирует model. Validators/live HTML unrun.

Подробности: [implementation evidence](../verification/implementation.md).

## Checkpoint

Метаданные и JSON-LD отражают видимые факты для обеих locale и всех price/stock cases, safe render и preview noindex сохранены.
