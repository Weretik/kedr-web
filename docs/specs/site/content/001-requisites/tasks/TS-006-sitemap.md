# TS-006 — Включение реквизитов в sitemap

- **Status:** verified 2026-11-03; sitemap registry integration.
- **Covers:** SC-015.
- **Depends on:** TS-005.
- **Точные пути:** `libs/site/content/feature/src/lib/content-sitemap.ts` и `libs/site/content/feature/src/lib/content-sitemap.spec.ts`.
- **Test level:** focused sitemap integration.
- **Baseline:** existing CONTENT_SITEMAP_PAGES; app/sitemap.ts и core builder уже разворачивают locales.

## Work

- [x] От свежего registry добавить один descriptor /requisites.
- [x] Проверить ровно по одному canonical URL на UK/RU, текущие reciprocal sitemap alternates и отсутствие fabricated lastModified.
- [x] Сохранить все другие descriptors, включая articles и параллельные дополнения.
- [x] Не менять app sitemap adapter или shared locale policy; HTML x-default не переносить автоматически в sitemap.
- [x] Проверить, что registry сохраняет одну ответственность.

## Evidence

Coordinator добавил один descriptor /requisites, сохранив текущие delivery/returns/contacts/wholesale/articles и все существующие тесты.

- Red: `npx nx run site-content-feature:vite:test -- --run src/lib/content-sitemap.spec.ts`, exit 1, 1 failed / 4 passed. Новые requisites URLs отсутствовали: получен [] вместо двух адресов; harness работал.
- Green/final regression: `npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/content-sitemap.spec.ts`, exit 0, 1 file / 5 tests passed, cache 0/1.
- Проверены обе записи, reciprocal sitemap alternates, отсутствие lastModified/дубликатов и сохранение остальных migrated content paths.
- Prettier changed registry/spec; scoped ESLint двух файлов и feature index: exit 0.
- App sitemap adapter и core policy не менялись; XML/HTTP не проверялись.

После параллельного добавления public-offer registry/spec изменились, поэтому выполнена только затронутая интеграция: `npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/requisites-page.spec.tsx src/lib/content-sitemap.spec.ts` — exit 0, 2 files / 11 tests (5 feature + 6 registry), свежий cache 0/1. Все текущие migrated entries сохранены; исходный Red/Green выше относится к первому requisites-пакету.

## Checkpoint

Регистрация создаёт ровно две локализованные записи без потерь соседних URL; focused evidence записано. Факт XML/HTTP не объявляется проверенным из unit/integration registry.
