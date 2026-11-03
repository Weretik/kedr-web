# TS-004 — Metadata и BreadcrumbList

- **Status:** verified 2026-11-03; SEO unit boundary.
- **Covers:** SC-013, SC-014.
- **Depends on:** нет.
- **Точные пути:** `libs/site/content/seo/src/lib/requisites-metadata.ts`, `requisites-metadata.spec.ts`, `requisites-json-ld.ts`, `requisites-json-ld.spec.ts` в том же lib; `libs/site/content/seo/src/index.ts`.
- **Test level:** SEO unit.
- **Baseline:** [SEO contract](../design/seo.md), contacts builders; content/seo imports только core/config, core/i18n, core/seo.

## Work

- [x] Добавить собственный compact locale record без импорта content/model.
- [x] Обернуть buildPageMetadata с path /requisites, согласованными title/description.
- [x] Проверить self canonical, reciprocal uk-UA/ru-UA и HTML x-default на UK; текущий production indexing gate.
- [x] Создать двухэлементный BreadcrumbList с абсолютными URL, позициями 1/2 и видимыми localized names.
- [x] Сохранить Organization в locale layout, WebSite на главной; не добавлять BankAccount/LocalBusiness/налоговые поля.
- [x] Дополнить public exports; проверить ответственность builders и отсутствие новых boundary exceptions.

## Evidence

Выполнено P2, public SEO exports интегрированы координатором.

- Target подтверждён: `npx nx show project site-content-seo --json`, exit 0.
- Команда: `npx nx run site-content-seo:vite:test -- --run src/lib/requisites-metadata.spec.ts src/lib/requisites-json-ld.spec.ts`.
- Valid Red: exit 1, 4 failed / 5 passed — explicit SiteConfig игнорировался, origin и production robots были неверны.
- Green/final regression: exit 0, 2 files / 9 tests passed, без cache hit.
- Проверены UK/RU title/description/canonical/alternates/OG, production gate и custom/default origin двух BreadcrumbList.
- Prettier до финального Green; scoped ESLint pass. Metadata и breadcrumb разделены, model import отсутствует. Organization остаётся в layout, WebSite — на главной.
- Реальный head/HTTP/schema validator этим unit scope не доказаны.

## Checkpoint

Оба builder и их public exports готовы, SEO unit доказательства записаны. Domain model не импортируется в SEO; новые site-wide defaults не введены.
