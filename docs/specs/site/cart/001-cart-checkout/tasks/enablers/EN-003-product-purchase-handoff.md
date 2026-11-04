# EN-003 — Серверный purchase handoff карточки товара

- **ID:** EN-003.
- **Enables:** SC-001, SC-002, SC-027.
- **Depends on:** нет.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** unit + focused server composition.
- **Архитектурный базис:** [frontend design](../../design/frontend.md), [API](../../contracts/api-contract.md), [правила проверок](../../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/product/feature/src/lib/detail/product-page.tsx`.
- `libs/site/product/feature/src/lib/detail/product-purchase-descriptor.ts`.
- `libs/site/product/feature/src/lib/detail/product-purchase-descriptor.spec.ts`.
- `libs/site/product/feature/src/lib/detail/product-page.spec.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Расширить server ProductPage optional renderPurchaseAction(descriptor):ReactNode; сформировать descriptor из нормализованного product, включая строковый productId=product.sku и существующую purchase policy.
- [x] Вызвать renderer только на сервере и передать узел в уже существующий ProductDetailView.purchaseAction. Callback не сериализовать в client leaf.
- [x] Не добавлять product feature→cart feature/data-access imports, второй cart или fake add success. Без renderer сохраняется текущее честное disabled/contact поведение.
- [x] Подтвердить structural public signature и доступный/неизвестный price/stock сценарии; не менять product SSR, redirects, JSON-LD или завершённую read-stage 4A.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

ProductPage строит ProductPurchaseDescriptor после нормализации и вызывает optional server renderer. App привязывает locale к cart renderer; клиент получает только descriptor. Contact/no-price branches сохранены. product-purchase-descriptor.spec.ts + product-page.spec.tsx: 15 passed; исходный behavioral Red — четыре renderer assertions.

[Сводка, пути и команды](../../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

ProductPage способен принять внешний server renderer без междоменных зависимостей; текущая самостоятельная read-stage работает с прежним fallback.
