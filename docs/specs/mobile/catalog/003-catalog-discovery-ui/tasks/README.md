# Фази реалізації: catalog discovery UI

| Фаза                                                                    | Результат                                                   | Статус  |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- | ------- |
| [00 — Specify і plan](00-specify-plan.md)                               | Погоджений scope, contract і реальні source paths           | planned |
| [01 — Foundation](01-foundation.md)                                     | Dependencies, test/mocks та state prerequisites             | planned |
| [02 — US1: Appbar, list і cards](02-catalog-shell.md)                   | Незалежно тестований новий базовий каталог                  | planned |
| [03 — US2: Search sheet і history](03-search-sheet-history.md)          | Незалежно тестований пошук з history                        | planned |
| [04 — US3: Control sheets і chips](04-query-sheets-chips.md)            | Незалежно тестовані sort/filter/category actions            | planned |
| [05 — Delivery](05-delivery.md)                                         | Automated і device/web evidence                             | planned |
| [06 — UI corrections](06-ui-corrections.md)                             | Уточнений card/list/sheets/category UI                      | planned |
| [07 — Delivery](07-delivery.md)                                         | Automated і device/web evidence після коригувань            | planned |
| [08 — Surface and sheet corrections](08-surface-sheet-corrections.md)   | Card/background, sheet surface, options and sort labels     | planned |
| [09 — Delivery](09-delivery.md)                                         | Final evidence після коригувань поверхонь                   | planned |
| [10 — Bottom navigation density](10-bottom-navigation-density.md)       | Compact Paper bottom navigation with preserved safe area    | planned |
| [11 — Search sheet corrections](11-search-sheet-corrections.md)         | History controls, keyboard layout and in-field submit       | planned |
| [12 — Product card hierarchy](12-product-card-hierarchy.md)             | Compact SKU/title/price/availability visual hierarchy       | planned |
| [13 — Applied query chips](13-query-chips-corrections.md)               | Compact Paper chips for search and selected query values    | planned |
| [14 — Frosted bottom navigation](14-frosted-bottom-navigation.md)       | Реальний blur за плаваючою нижньою навігацією               | planned |
| [15 — Search sheet and chip polish](15-search-sheet-and-chip-polish.md) | Android keyboard-safe search and themed aligned Paper chips | planned |
| [16 — Delivery](16-delivery.md)                                         | Єдиний final evidence після всіх коригувань                 | planned |

Для нового дозволеного scope застосовується
[`ai-feature-workflow`](../../../../_templates/ai-feature-workflow/README.md):
AI сам переходить між усіма ready task-файлами в межах дозволеної feature,
фази або набору сценаріїв.
