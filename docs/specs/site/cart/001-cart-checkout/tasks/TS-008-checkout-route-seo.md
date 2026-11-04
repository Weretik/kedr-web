# TS-008 — Приватный checkout route и metadata

- **ID:** TS-008.
- **Covers:** SC-012, SC-025, SC-026, SC-028.
- **Depends on:** TS-005, TS-007.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** metadata unit + focused server composition.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `apps/site/src/app/[locale]/checkout/page.tsx`.
- `libs/site/cart/feature/src/lib/checkout/checkout-page.tsx`.
- `libs/site/cart/feature/src/lib/checkout/checkout-page.spec.tsx`.
- `libs/site/cart/seo/src/lib/checkout-metadata.ts`.
- `libs/site/cart/seo/src/lib/checkout-metadata.spec.ts`.
- `libs/site/core/seo/src/lib/crawling/crawling.spec.ts`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Thin route читает awaited params, вызывает feature и domain metadata; server frame содержит неперсональные H1/breadcrumb/fallback.
- [x] Request-time leaf через connection под Suspense, no shared user cache; никакого dynamic/revalidate workaround. Не добавлять собственный success/cart URL.
- [x] Metadata делегирует core buildRobotsMeta(false), не добавляет canonical/hreflang/order JSON-LD или PII. Production noindex/follow, preview noindex/nofollow.
- [x] Checkout исключён из sitemap; существующие PRIVATE_PATHS/production robots disallow сохранены. Проверить checkout Link nofollow. Не запускать build/HTTP/browser для документации или без отдельного основания.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

checkout-metadata.spec.ts: Red 5 assertions → Green 5/5 для UK/RU production/preview, без canonical/alternates/PII. checkout-page.spec.tsx проверяет server frame UK/RU с pending connection; core crawling проверяет private robots и отсутствие checkout sitemap; nofollow проверяется drawer и shell specs. Thin route/typegen/app tsc и source review подтвердили connection/Suspense без user cache. HTTP200/404 на работающем сервере не проверялись.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

UK/RU checkout имеет правильный приватный metadata/route contract, 200 empty и существующий invalid-locale 404; персональные данные не сериализованы в metadata/cache.
