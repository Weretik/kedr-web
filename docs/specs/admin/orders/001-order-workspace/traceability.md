# Трасування й готовність

| Правила            | Сценарії               | Задачі                 | Доказ реалізації                                                             |
| ------------------ | ---------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| R-001–R-003, R-010 | SC-001, SC-008         | TS-002–TS-004          | `order-tables.spec.tsx`, UI/routes, app typecheck                            |
| R-004–R-005        | SC-002, SC-003         | EN-001, TS-001, TS-005 | `current-order-set.spec.ts`, `orders.mapper.spec.ts`, app typecheck          |
| R-006–R-008        | SC-004, SC-005, SC-007 | TS-002, TS-005         | `new-order-page.spec.tsx`, `current-order-set.spec.ts`, checkout/detail code |
| R-009              | SC-006                 | TS-004                 | versioned delete/update code, 409 handling, app typecheck                    |

**Стан 2026-10-21:** продуктове рішення про локальне збереження, повторне використання чернетки й серверну ціну реалізовано. EN-001 зафіксовано у [frontend design](design/frontend.md); provider OpenAPI синхронізовано. Прямі вузькі Vitest: 13 тестів пройшли (state 6, mapper 4, таблиці/URL 2, повторне підтвердження quote 1). `apps/admin` і orders feature spec TypeScript check пройшли. Ручна браузерна перевірка не проводилася за правилом репозиторію.

## Рівень перевірки за сценарієм

| Сценарій | Цільова перевірка  |
| -------- | ------------------ |
| SC-001   | component/route    |
| SC-002   | unit/component     |
| SC-003   | component/API-mock |
| SC-004   | component/API-mock |
| SC-005   | component/API-mock |
| SC-006   | component/API-mock |
| SC-007   | unit/component     |
| SC-008   | route/component    |

Детальні задачі та контрольні точки — у [графі задач](tasks/README.md). Evidence вище охоплює вузькі автоматизовані перевірки; повний прогін і browser review не проводилися.
