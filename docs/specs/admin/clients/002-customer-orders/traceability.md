# Трасування й готовність

| Правила     | Сценарії       | Задачі         | Доказ реалізації                                                                                             |
| ----------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| R-001–R-002 | SC-001, SC-002 | EN-001, TS-001 | `customer-details-page.spec.tsx` перевіряє поточний ID; `order-tables.spec.tsx` перевіряє фільтр та URL-стан |
| R-003       | SC-003         | TS-002         | `order-tables.spec.tsx` і код переходів, підтвердження видалення                                             |
| R-004       | SC-004         | TS-001, TS-003 | `customer-details-page.spec.tsx` перевіряє ізоляцію картки клієнта                                           |

**Готовність:** EN-001 виконано через app-level callback; versioned backend contract `b3797c1` синхронізовано. Clients lib/spec TypeScript checks і 5 customer-detail component tests пройшли 2026-10-21. Orders feature перевірено 13 цільовими тестами, Admin TypeScript check і перевіркою меж Nx-проєктів.

## Рівень перевірки за сценарієм

| Сценарій | Цільова перевірка |
| -------- | ----------------- |
| SC-001   | component         |
| SC-002   | component/route   |
| SC-003   | route/component   |
| SC-004   | component         |

Детальні задачі та контрольні точки — у [графі задач](tasks/README.md). Фактичний доказ 2026-10-21: `npx vitest run --config libs/admin/clients/feature/vite.config.mts src/pages/customer-details-page.spec.tsx` — 5/5; `tsc -p libs/admin/clients/feature/tsconfig.lib.json --noEmit` і `tsc -p libs/admin/clients/feature/tsconfig.spec.json --noEmit` — пройшли. Browser review не виконувався.
