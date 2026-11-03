# TS-002 — Чтение и нормализация detail

- **Covers:** SC-001–SC-009, SC-018–SC-022, SC-027.
- **Depends on:** TS-001.
- **Status:** implemented, mapper/loader verified.
- **Exact paths:** `libs/site/product/data-access/src/lib/mappers/product-details.mapper.ts`, `loaders/product-details-loader.ts`, `cache-tags.ts`; adjacent `.spec.ts`; public `src/index.ts`.
- **Test level:** unit mapper + focused integration transport boundary.
- **Baseline:** [API contract](../contracts/api-contract.md), [Next design](../design/nextjs.md); existing siteApiGet/server-only.

## Work

- [x] Типизированно вызвать getPublicProductBySlug с locale/slug/priceTypeId11; generated DTO импортировать только здесь.
- [x] Нормализовать identity, finite price/stock, informational pack и независимые разрешённые photo/scheme URL; deduplicate media.
- [x] Вернуть found/moved/category-redirect/not-found/unavailable; валидировать redirect type/segment, не придумывать410.
- [x] Добавить `'use cache'`, tags и success/failure lifetime, не читать session/cookies.
- [x] Проверить paired locale lookup того же SKU для SEO без влияния отказа второй locale на существующую текущую страницу.
- [x] Оставить скрытые catalog roots для feature composition через общую catalog policy, без запрещённого data-access cross-domain import.

## Evidence

P-DATA: valid behavioral Red mapper (null вместо реальных mapped facts), detail/index Red (нет ожидаемого товара/страниц). Финальная команда .\node_modules\.bin\vitest.cmd run --config libs/site/product/data-access/vite.config.mts — exit0,3 files/55 tests. После совместимости cacheLife overload отдельно product-index-loader.spec.ts —10/10. DTO/normalization/transport/cache/walker разделены, shared-cache inputs публичные. Actual HTTP/status не проверялись.

Подробности: [implementation evidence](../verification/implementation.md).

## Audit follow-up — 2026-11-03

AF-002: generated aliases/identity projection и unknown 404 parser перенесены в private `data-access/src/lib/contracts`; mapping/cache semantics и public barrel сохранены. Fresh data config — exit0,3 files/55 tests. Source/test typecheck и scoped ESLint pass. [Audit evidence](../code-audit/audit.md).

## Checkpoint

Все контрактные outcomes и independent data states покрыты; loader имеет только публичный ключ кеша и не выдаёт сырые DTO клиентскому UI.
