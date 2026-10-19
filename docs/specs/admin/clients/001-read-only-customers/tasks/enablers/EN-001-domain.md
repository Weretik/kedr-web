# EN-001 — Підготувати домен clients

**Enables:** SC-001–SC-007. **Depends on:** немає. **Статус:** план інкременту.

**Шляхи:** `libs/admin/clients/{feature,data-access,model,ui}/`, `docs/contracts/openapi/`, `docs/contracts/sales/admin-customers.md`.

**Робота:** звірити оновлений Sales OpenAPI з `searchTerm`, `counterpartyId`, `name`, `phone`, шістьма sort значеннями, page/pageSize; синхронізувати frontend snapshot/generated за контрактним workflow. Наявні Nx projects не створювати повторно.

**Рівень:** вузька перевірка контракту; Red-first не застосовується. **Докази:** записати ревізію snapshot і результат синхронізації. **Checkpoint:** generated types відповідають provider-контракту.
