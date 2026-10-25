# Фази реалізації: catalog discovery UI

| Фаза                                                                    | Результат                                                   | Статус |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| [00 — Specify і plan](00-specify-plan.md)                               | Погоджений scope, contract і реальні source paths           | done   |
| [01 — Foundation](01-foundation.md)                                     | Dependencies, test/mocks та state prerequisites             | done   |
| [02 — US1: Appbar, list і cards](02-catalog-shell.md)                   | Незалежно тестований новий базовий каталог                  | done   |
| [03 — US2: Search sheet і history](03-search-sheet-history.md)          | Незалежно тестований пошук з history                        | done   |
| [04 — US3: Control sheets і chips](04-query-sheets-chips.md)            | Незалежно тестовані sort/filter/category actions            | done   |
| [05 — Delivery](05-delivery.md)                                         | Automated і device/web evidence                             | done   |
| [06 — UI corrections](06-ui-corrections.md)                             | Уточнений card/list/sheets/category UI                      | done   |
| [07 — Delivery](07-delivery.md)                                         | Automated і device/web evidence після коригувань            | done   |
| [08 — Surface and sheet corrections](08-surface-sheet-corrections.md)   | Card/background, sheet surface, options and sort labels     | done   |
| [09 — Delivery](09-delivery.md)                                         | Final evidence після коригувань поверхонь                   | done   |
| [10 — Bottom navigation density](10-bottom-navigation-density.md)       | Compact Paper bottom navigation with preserved safe area    | done   |
| [11 — Search sheet corrections](11-search-sheet-corrections.md)         | History controls, keyboard layout and in-field submit       | done   |
| [12 — Product card hierarchy](12-product-card-hierarchy.md)             | Compact SKU/title/price/availability visual hierarchy       | done   |
| [13 — Applied query chips](13-query-chips-corrections.md)               | Compact Paper chips for search and selected query values    | done   |
| [15 — Search sheet and chip polish](15-search-sheet-and-chip-polish.md) | Android keyboard-safe search and themed aligned Paper chips | done   |
| [16 — Delivery](16-delivery.md)                                         | Єдиний final evidence після всіх коригувань                 | done   |

Для нового дозволеного scope застосовується
`ai-feature-workflow`:
AI сам переходить між усіма ready task-файлами в межах дозволеної feature,
фази або набору сценаріїв.
