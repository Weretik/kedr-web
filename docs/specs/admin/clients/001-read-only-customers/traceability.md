# Клієнти — трасування

| Сценарій | Правила      | Задачі                                 | Рівень                | Тести й докази                                                                                                                               | Статус                  |
| -------- | ------------ | -------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| SC-001   | R-001        | EN-001, TS-001, TS-002, TS-004, TS-005 | component             | [TS-002](tasks/ui/TS-002-customer-list.md)                                                                                                   | planned                 |
| SC-002   | R-001        | TS-001, TS-002, TS-005                 | integration/component | [TS-001](tasks/api/TS-001-customer-queries.md)                                                                                               | planned                 |
| SC-003   | R-002, R-003 | TS-001, TS-003, TS-004, TS-005         | integration/component | [TS-003](tasks/ui/TS-003-customer-details.md), [TS-005](tasks/verification/TS-005-acceptance.md)                                             | planned                 |
| SC-004   | R-003        | TS-001, TS-003, TS-004, TS-005         | unit/component        | [TS-001](tasks/api/TS-001-customer-queries.md)                                                                                               | planned                 |
| SC-005   | R-003        | TS-001, TS-002, TS-005                 | component             | [TS-002](tasks/ui/TS-002-customer-list.md)                                                                                                   | planned                 |
| SC-006   | R-004        | TS-002, TS-003, TS-005                 | component             | [TS-002](tasks/ui/TS-002-customer-list.md), [TS-003](tasks/ui/TS-003-customer-details.md), [TS-005](tasks/verification/TS-005-acceptance.md) | planned                 |
| SC-007   | R-001        | EN-001, TS-001, TS-002, TS-005         | mapper/component      | [TS-001](tasks/api/TS-001-customer-queries.md), [TS-002](tasks/ui/TS-002-customer-list.md)                                                   | planned                 |
| SC-008   | R-002, R-005 | TS-006                                 | mapper/component      | [TS-006](tasks/ui/TS-006-customer-price-names.md)                                                                                            | код і контракт готові |
| SC-009   | R-002, R-004, R-006 | TS-003, TS-004 | component | [TS-003](tasks/ui/TS-003-customer-details.md), `customer-details-page.spec.tsx` 3/3, `customer-details-content.spec.tsx` 2/2, UI/feature TypeScript checks | Три картки без таблиць перевірено автоматично; браузер не перевіряли |

Таблиця вище зберігає планове трасування; `planned` означає, що повне
приймання, зокрема браузерні сценарії, не проводилося. Код списку й картки
клієнта реалізовано. Цільові автоматичні перевірки 2026-10-19: тести model
(6/6), data-access (5/5), feature (3/3) та UI (8/8); цільовий TypeScript check
UI і feature пройшов. Для редизайну трьох карток 2026-10-19 окремо пройшли
`customer-details-content.spec.tsx` (2/2), `customer-details-page.spec.tsx` (3/3)
та TypeScript checks UI і feature. Backend тести `SalesCustomerReferenceNamesTests` (1/1)
і `SalesCustomerReadModelTests|AdminCustomerApiTests` (13 passed, 5 skipped)
підтвердили реалізацію; п'ять PostgreSQL сценаріїв пропущено через
недоступність БД. Frontend OpenAPI snapshot/generated types синхронізовано з
backend commit `8fc8729`. Браузер і повні прогони не
запускалися за вимогою користувача. Зміна таблиці клієнтів 2026-10-19:
`customers-data-grid.spec.tsx` (5/5), `customers-page.spec.tsx` (2/2),
`customer-page-params.spec.ts` (6/6); окремі TypeScript checks UI/feature/model
пройшли. Перевірено один пошук у toolbar, скидання сторінки, пагінацію й
відсутність колонкових фільтрів у UI; браузер не відкривали.
