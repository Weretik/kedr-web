# Товари — трасування

| Сценарій | Правила      | Задачі                                 | Рівень                | Тести й докази                                                                                                                                 | Статус  |
| -------- | ------------ | -------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| SC-001   | R-001        | EN-001, TS-003, TS-005, TS-006         | component             | [TS-003](tasks/ui/TS-003-products-list-ui.md), [TS-006](tasks/verification/TS-006-acceptance.md)                                               | planned |
| SC-002   | R-002        | EN-001, TS-001, TS-002, TS-003, TS-006 | integration/component | [TS-001](tasks/state/TS-001-mode.md), [TS-002](tasks/api/TS-002-queries.md)                                                                    | planned |
| SC-003   | R-002        | TS-001, TS-003, TS-006                 | unit/component        | [TS-001](tasks/state/TS-001-mode.md)                                                                                                           | planned |
| SC-004   | R-001, R-003 | TS-002, TS-004, TS-005, TS-006         | integration/component | [TS-004](tasks/ui/TS-004-product-details.md), [TS-006](tasks/verification/TS-006-acceptance.md)                                                | planned |
| SC-005   | R-004        | TS-002, TS-004, TS-006                 | unit/component        | [TS-002](tasks/api/TS-002-queries.md), [TS-004](tasks/ui/TS-004-product-details.md)                                                            | planned |
| SC-006   | R-004        | TS-002, TS-003, TS-006                 | component             | [TS-003](tasks/ui/TS-003-products-list-ui.md)                                                                                                  | planned |
| SC-007   | R-005        | TS-003, TS-004, TS-006                 | component             | [TS-003](tasks/ui/TS-003-products-list-ui.md), [TS-004](tasks/ui/TS-004-product-details.md), [TS-006](tasks/verification/TS-006-acceptance.md) | planned |
| SC-008   | R-001, R-006 | TS-003, TS-006                         | component             | [TS-003](tasks/ui/TS-003-products-list-ui.md), [TS-006](tasks/verification/TS-006-acceptance.md)                                               | planned |
| SC-009   | R-001, R-002 | EN-001, TS-001, TS-002, TS-003, TS-006 | mapper/component | [TS-001](tasks/state/TS-001-mode.md), [TS-002](tasks/api/TS-002-queries.md), [TS-003](tasks/ui/TS-003-products-list-ui.md) | planned |
| SC-010   | R-003, R-004 | TS-002, TS-004, TS-006 | component | [TS-002](tasks/api/TS-002-queries.md), [TS-004](tasks/ui/TS-004-product-details.md) | planned |
| SC-011   | R-001, R-002 | TS-001, TS-003 | unit/component | `products-url-state.spec.ts`, `products-navigation.spec.tsx` (вкладка «На сайті») | implemented |

Таблиця вище зберігає зв'язок сценаріїв із задачами; позначка `planned` означає,
що повне приймання, зокрема браузерні сценарії, не проводилося. Код UI,
data-access і backend для SC-001–SC-010 реалізовано. Цільові автоматичні
перевірки 2026-10-19: `libs/admin/products/ui/src/tables/products-data-grid.spec.tsx`
(3/3), тести feature (11/11), data-access (4/4) і query mapper (2/2);
цільовий TypeScript check бібліотек model/data-access/ui/feature пройшов.
У backend пройшли цільові Catalog unit (7/7), API (6/6) і тест ієрархії
публічних категорій (1/1). OpenAPI snapshot/generated types frontend
синхронізовано з backend commit `8fc8729`. Браузер і повні
проєктні прогони не запускалися за вимогою користувача.

Для SC-011 цільовий тест URL-стану пройшов 3/3; тест перемикання на вкладку
«На сайті» пройшов. Сценарій діалогу фото спочатку виявив некоректний порядок
дій у тесті; після закриття діалогу вузький повтор сценарію пройшов 1/1.
`admin-products-ui` тест таблиці пройшов 3/3, цільова
перевірка TypeScript `admin-products-feature` пройшла. Це автоматичні докази;
браузерну поведінку не перевіряли.
