# Контракт споживача Admin: замовлення й чернетки

## Джерело та операції

- Provider snapshot: [`admin-order-workspace.openapi.yaml`](../openapi/sales/admin-order-workspace.openapi.yaml) і [`admin-order-drafts.openapi.yaml`](../openapi/sales/admin-order-drafts.openapi.yaml).
- Походження: [`SOURCE.md`](../openapi/SOURCE.md), KedrStore commit `b3797c1`.
- Операції: `getAdminWorkspaceOrders`, `getAdminWorkspaceOrderById`, `quoteAdminWorkspaceOrder`, `createAdminWorkspaceOrder`, `getAdminOrderDrafts`, `getAdminOrderDraftById`, `createAdminOrderDraft`, `updateAdminOrderDraft`, `deleteAdminOrderDraft`.
- Споживач: `@admin/orders/data-access`; транспортні типи `operations[...]` використовуються лише на цій межі, відповіді проходять runtime validation і mapping у доменну модель.

Це окремі Admin API, які на поточному етапі доступні анонімно. Чинні `/api/admin/orders` і `POST /api/admin/orders` для Mobile не перемикаються на ці операції. Provider OpenAPI змінено локально; snapshot цього репозиторію потребує синхронізації після фіксації backend revision.

## Списки й деталі

Обидва списки приймають `page`, `pageSize`, `searchTerm`, точний `counterpartyId` і `sort`. UI зберігає незалежний URL-стан кожної вкладки й застосовує фільтри до серверної пагінації. Кількість записів береться з `pagedInfo.totalRecords`. Для замовлень пошук охоплює номер/клієнта, для чернеток назву/клієнта. Доступне сортування замовлень: `createdAt`, `orderNumber`, `customerName`, `totalAmount` та зворотні значення; чернеток: `updatedAt`, `title`, `customerName` та зворотні значення.

Деталі замовлення містять його номер, клієнта, товари, суму та статус синхронізації з 1C. Чернетка має окремий `draftId`, назву, нотатку й `version`, без номера замовлення. У відповіді деталей чернетки `pricingStatus` дорівнює `Available` або `Unavailable`. За `Unavailable` загальна сума й назви/ціни/суми рядків можуть бути `null`; перегляд лишається доступним, а UI не підставляє стару ціну. Нова операція `quoteAdminWorkspaceOrder` вимагає повного актуального розрахунку, і її mapper відхиляє nullable ціни.

## Записи й помилки

Для quote з кількістю понад актуальний залишок backend повертає HTTP 400 `code=unavailable_product` і `message` з назвою товару та доступною/запитаною кількістю. `axiosBaseQuery` зберігає цей код у `ApiError.reason`; сторінка оформлення показує повідомлення, щоб користувач скоригував кількість. Provider snapshot потребує синхронізації після backend commit.

Створення замовлення передає клієнта, productId/quantity, `quoteFingerprint`, необов'язковий коментар і UUID `Idempotency-Key`. Сервер перевіряє товари/клієнта й знову рахує ціну. При `409 quote_changed` frontend показує новий quote і вимагає нового підтвердження. Ключ для повтору того самого pending payload залишається тим самим; зміна payload створює новий ключ.

Створення чернетки передає назву, нотатку, клієнта, productId/quantity та `Idempotency-Key`; редагування/видалення використовує `If-Match: version`. `409` версії вимагає завантаження актуальної чернетки перед новою дією. Мутації інвалідовують відповідні RTK Query tags списків і деталей. Локальний набір товарів у browser storage не є серверною чернеткою й не зберігає ціни або дані клієнта.

Змінювати DTO й endpoint у цьому frontend без provider OpenAPI не можна. Порядок синхронізації наведений у [contract workflow](../README.md).
