# Клієнти — frontend design

## Перевірений базис на 2026-10-19

| Область | Факт і джерело                                                                                  | Ціль                                                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Модулі  | `libs/admin/clients/{feature,data-access,ui,model}/project.json` уже існують; [правила доменів](../../../../../architecture/admin/structure/domains.md) | розширити чинні модулі без міждоменного імпорту |
| Router  | `apps/admin/src/app/router/app-router.tsx` підключає clientsRoutes                              | зберегти чинні маршрути й URL-контекст списку |
| Menu    | `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`                          | чинний пункт «Клієнти» без зміни |
| API     | [Admin state/API](../../../../../architecture/admin/runtime/state-and-api.md)                   | `baseApi.injectEndpoints` у clients data-access; runtime validation, mapper, типи за generated OpenAPI                                                                            |
| UI      | `libs/admin/clients/ui/src/tables/customers-data-grid.tsx`, `package.json`                      | один MUI quick search у toolbar таблиці, без фільтрів колонок і сортування |
| Тести   | `package.json`, [testing rules](../../../../../standards/shared/testing-rules.md)               | автоматичні тести цієї фічі; browser journey лише за окремим дозволом                                                                                                            |

Наявний домен уже має Nx projects і маршрути. `feature` володіє `/customers` та `/customers/:counterpartyId`, пошуком і пагінацією в URL та композицією; `data-access` має RTK Query list/detail, runtime validation та mapping; `ui` — таблицю й read-only поля без HTTP/router. `model` нормалізує query; застарілі параметри фільтрації колонок і сортування не відновлюються з URL. Invalid ID не доходить до HTTP. `404` — not found, інші помилки — retry. Після реалізації звірити фактичну [сторінку фічі](../../../../../features/admin/clients.md) та Admin index.

Детальна сторінка використовує [спільний формат list/detail](../../../../../standards/admin/list-detail-pages.md): той самий MUI Link з `ArrowBackIcon`, що й деталі товару, та нейтральний заголовок сторінки. `CustomerDetailsContent` компонуватиме три окремі Card: ім'я й ID, контактні дані та типи цін. Дочірні компоненти відповідають кожен за свою картку, а `CustomerDetailField` — за однакове подання підпису й значення. Таблиць у деталях немає; телефонний, планшетний і широкий layout використовують breakpoints і кольори чинної Admin theme без власної палітри.

## Аудит відповідальностей

| Файл                   | Поточна роль                    | Рішення                                                              |
| ---------------------- | ------------------------------- | -------------------------------------------------------------------- |
| `app-router.tsx`       | route composition               | чинні `clientsRoutes` лишаються; JSX сторінок тут немає |
| `admin-navigation.tsx` | menu configuration/render       | чинний пункт і nested active state лишаються без customer logic |
| customers Data Grid    | quick search у toolbar | єдиний `searchTerm` і page/pageSize передаються в API; фільтри колонок і сортування вимкнені |

Нових пакетів не потрібно: MUI, `@mui/x-data-grid`, RTK Query і React Router уже є в `package.json`/lockfile. Дані клієнтів не переносяться в спільний Redux slice, оскільки RTK Query володіє серверним кешем. Поля контактів не логуються.

## Адаптивність і теми

Перевірений стан на 2026-10-19: `apps/admin/src/app/theme/admin-theme.ts` визначає `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, `xl: 1440` і схеми `light`/`dark`; `apps/admin/src/app/providers/app-providers.tsx` підключає цей theme через MUI `ThemeProvider` із `defaultMode="system"`. [Admin UI rules](../../../../../standards/admin/admin-ui.md) вимагають наявні MUI patterns/theme і перевірку вузьких та широких layout.

Data Grid, картка та її стани мають брати кольори/типографіку з теми Admin. Локальні жорстко задані світлі кольори не вводити. За кодом звірити підключення `light`/`dark`, горизонтальне прокручування усіх колонок на телефоні й планшеті, доступність дії та пагінації, стани loading/empty/error. Фактичне компонування, перекриття й фокус у браузері не вважати перевіреними без окремого запитання та прямого дозволу користувача на конкретний перегляд.
