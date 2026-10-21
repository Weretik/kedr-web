# API та стан

**Стан контракту 2026-10-21:** KedrStore SDD Sales 004/005 реалізовано; frontend синхронізував provider commit `b3797c1` у `docs/contracts/openapi/`, `SOURCE.md` і generated types. Посилання на інший репозиторій у цьому проєкті не додається. Наведені operation IDs уже є у snapshot; [consumer projection](../../../../../contracts/sales/admin-order-workspace.md) описує їх використання.

| Сценарій                 | operationId                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Таблиця/деталі замовлень | `getAdminWorkspaceOrders`, `getAdminWorkspaceOrderById`                                                                    |
| Quote/оформлення         | `quoteAdminWorkspaceOrder`, `createAdminWorkspaceOrder`                                                                    |
| Таблиця/CRUD чернеток    | `getAdminOrderDrafts`, `createAdminOrderDraft`, `getAdminOrderDraftById`, `updateAdminOrderDraft`, `deleteAdminOrderDraft` |
| Пошук клієнта            | чинний `getAdminCustomers`                                                                                                 |

Списки серверні: `pagedInfo`, searchTerm, exact counterpartyId, sort, page/pageSize; `totalRecords` не обчислювати із довжини сторінки. Checkout надсилає `counterpartyId,lines[{productId,quantity}],quoteFingerprint` та новий UUID `Idempotency-Key`; ні unitPrice, ні amount у запиті немає. Ключ зберігати з pending операцією для retry, не генерувати новий при повторі після timeout. Чернетка має `draftId` і version, без orderNumber; її quote server-derived. `409` price change показує нову суму; `409` draft conflict вимагає reload; 401/403 відпрацьовує чинний Admin session flow.

`DraftDetail` містить `pricingStatus: Available | Unavailable`. Якщо ціна недоступна, `totalAmount`, `productName`, `unitPrice` і `lineAmount` можуть бути `null`; деталі чернетки лишаються доступними, UI показує причину й не видає ці поля за поточну ціну. `Quote` завжди вимагає ненульові назви та ціни. Після зміни клієнта/рядків або повторного використання чернетки оформлення можливе лише після нового успішного `Quote`.

Runtime validation і mapper переводять транспортні DTO в orders model; компоненти не імпортують generated types. Локальний набір не є RTK Query cache і не містить серверної ціни. За відсутності з’єднання він лишається доступним для редагування, а збереження/оформлення потребують успішного server quote.
