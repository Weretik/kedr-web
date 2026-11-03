# TS-003 — Metadata и BreadcrumbList

- **Covers:** SC-010, SC-013.
- **Depends on:** EN-001.
- **Status:** complete, 2026-11-03.
- **Paths:** libs/site/content/seo/src/lib/privacy-metadata.ts, privacy-metadata.spec.ts, privacy-json-ld.ts, privacy-json-ld.spec.ts; libs/site/content/seo/src/index.ts.
- **Test level:** metadata / structured-data unit.
- **Architecture baseline:** [SEO](../design/seo.md); content/seo type:util импортирует только core config/i18n/seo.

## Work

- [x] Реализовать buildPrivacyMetadata через core builder, короткий page title без повторного brand suffix.
- [x] Реализовать buildPrivacyBreadcrumbJsonLd по видимым home/page крошкам.
- [x] Проверить обе локали, custom origin, self canonical, alternates/x-default и production/preview gate.
- [x] Проверить отсутствие invented dates, duplicate Organization и content/model imports.
- [x] Сохранить metadata и breadcrumb builders отдельными cohesive файлами; public API append-only.

## Evidence

Фактическая команда: node node_modules/vitest/vitest.mjs run --config libs/site/content/seo/vite.config.mts src/lib/privacy-metadata.spec.ts src/lib/privacy-json-ld.spec.ts

Red: exit 1, 12 expected failures callable empty builders. Green: exit 0, 2 specs / 12 tests. Проверены обе локали, custom origin, title template once, self canonical, alternates/x-default, production/preview gates и BreadcrumbList без Organization/дат.

После Green builders/specs не менялись; root принял результаты без повторного запуска и добавил public exports. Metadata и graph builders разделены, content/model не импортируется. HTTP head не проверялся.

## Checkpoint

Оба builders используют существующую SEO policy и проходят focused cases. Ни нового пакета, ни исключения boundary, ни включения indexing нет.
