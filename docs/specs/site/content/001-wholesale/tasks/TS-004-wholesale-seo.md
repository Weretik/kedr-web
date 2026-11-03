# TS-004 — Локализованные metadata и BreadcrumbList

- **Status:** completed 2026-11-03 (automated/source scope).
- **Covers:** SC-012, SC-013, SC-014, SC-015.
- **Depends on:** none.
- **Paths:** `libs/site/content/seo/src/lib/wholesale-metadata.ts`; `libs/site/content/seo/src/lib/wholesale-metadata.spec.ts`; `libs/site/content/seo/src/lib/wholesale-json-ld.ts`; `libs/site/content/seo/src/lib/wholesale-json-ld.spec.ts`; `libs/site/content/seo/src/index.ts`.
- **Test level:** Unit чистых builders.
- **Architecture baseline:** content/seo type:util использует только core/seo/config/i18n public APIs. Существующий core умеет нужную политику.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Добавить buildWholesaleMetadata с plain title/description и path /wholesale; использовать existing buildPageMetadata и template один раз.
- [x] Добавить buildWholesaleBreadcrumbJsonLd: два локализованных item с абсолютным configurable origin; существующая JsonLd сериализация остаётся.
- [x] Проверить UK/RU copy, OG, same-language canonical/reciprocal alternates/x-default, gate через createSiteConfig и breadcrumbs с тестовым origin. Не дублировать Organization/Product/FAQPage или city/hours.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. При NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_NO_CLOUD=true, NX_TUI=false:
node node_modules/nx/dist/bin/nx.js run site-content-seo:vite:test --output-style=static -- --run wholesale.

Red: exit1, 2 files/7 tests: 4 ожидаемых assertion failures (пустой localized title/breadcrumb items), 3 gate cases passed, без import/runner errors. Green + focused regression: exit0, 2files/7 tests passed, uncached.

Metadata проверяет обе локали, accepted plain title/description, OG, self canonical и reciprocal alternates/x-default, production/preview/development gate с реальной config factory. Breadcrumb builder проверяет2 абсолютных localized items с controlled origin. Scope diff check exit0. Structure: только публичные core imports, без Organization/Product/Offer/FAQPage. Итоговый HTTP head не проверялся.

## Checkpoint

Builders согласованы с SEO-дизайном, не меняют core и не обещают проверенный HTTP head.
