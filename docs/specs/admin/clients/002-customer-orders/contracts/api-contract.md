# API

Використати плановані операції `getAdminWorkspaceOrders` та `getAdminOrderDrafts` із `counterpartyId` поточного клієнта, а також чинний `getAdminCustomerById`. Відповіді пагіновані й сервер повертає `totalRecords` після фільтра клієнта. Списки не завантажують усі записи для локальної фільтрації.

Операції входять до versioned frontend snapshot із KedrStore commit `b3797c1` у `docs/contracts/openapi/`; generated types оновлено. Походження зафіксовано в [`SOURCE.md`](../../../../../contracts/openapi/SOURCE.md). Consumer projection orders узгоджується за [правилом](../../../../../standards/shared/api-data-rules.md). Контракт і робота з 401/403, 404, 409 — у [orders SDD](../../../orders/001-order-workspace/contracts/api-contract.md). Для customer-specific списку не створювати дубль API.
