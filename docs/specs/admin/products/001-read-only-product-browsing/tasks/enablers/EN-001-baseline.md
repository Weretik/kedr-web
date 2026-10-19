# EN-001 — Перевірити базис

**Enables:** SC-001–SC-010. **Depends on:** немає. **Статус:** план інкременту.

**Шляхи:** `apps/admin/project.json`, `libs/admin/products/*/project.json`, `libs/admin/core/shell/project.json`, `docs/contracts/openapi/`, `package-lock.json`.

**Робота:** перед кодом звірити фактичні Nx targets і змінений backend OpenAPI: boolean false для обох списків, `exportToSite`, фільтри/sort режиму без фото та Admin detail за slug. Синхронізувати frontend snapshot/generated за контрактним workflow. Не проводити повний аудит/graph прогін поза конкретним ризиком або прямим запитом.

**Рівень:** documentation/config check; Red-first не застосовується. **Докази:** записати команди й результати в цей файл під час виконання. **Checkpoint:** базис підтверджений, blockers названі.
