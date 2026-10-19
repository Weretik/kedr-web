# TS-001 — Запити клієнтів

**Covers:** SC-001–SC-005. **Depends on:** EN-001. **Статус:** planned.

**Шляхи:** `libs/admin/clients/data-access/src/api/`, `.../validators/`, `.../mappers/`, `libs/admin/clients/model/src/` за потреби.

**Робота:** базові list/detail endpoints реалізовано. Інкремент: після backend OpenAPI sync додати `searchTerm`, `counterpartyId`, `name`, `phone`, `sort`, page/pageSize до list query і cache key; дозволені sort: `name`, `-name`, `counterpartyId`, `-counterpartyId`, `phone`, `-phone`. Runtime validation, mapper і 404/error distinction залишаються на межі data-access. Не завантажувати всі сторінки, як Mobile picker.

**Рівень:** unit + focused integration. **Докази:** тести зміненої query/mapper та контракту. **Checkpoint:** серверна фільтрація перед пагінацією відображається у валідованій моделі сторінки.
