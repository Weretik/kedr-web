# Товари — frontend design

## Перевірений базис на 2026-10-19

| Область    | Факт і джерело                                                                                                                            | Ціль                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Застосунок | `apps/admin/project.json`, `apps/admin/src/app/router/app-router.tsx`                                                                     | Додати маршрут деталей до `productsRoutes`; root router не містить сторінкового коду.    |
| Шари       | `libs/admin/products/{feature,data-access,model,ui}/project.json`, [правила](../../../../../architecture/admin/structure/dependencies.md) | Розширити чинний домен; DTO лишається в data-access, UI отримує модель.                  |
| Список     | `libs/admin/products/feature/src/pages/products-page.tsx`, `libs/admin/products/ui/src/tables/products-data-grid.tsx`                     | Серверні пошук, фільтрація, сортування й пагінація в Data Grid, без старої окремої панелі. |
| API        | `libs/admin/products/data-access/src/api/admin-products.api.ts`, [стан/API](../../../../../architecture/admin/runtime/state-and-api.md)   | Нові RTK Query queries через `baseApi.injectEndpoints`, runtime validation і mapping.    |
| Меню       | `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`                                                                    | Перейменувати «Каталог» на «Товари», активність поширити на вкладені деталі.             |
| Тести      | `package.json`, [testing rules](../../../../../standards/shared/testing-rules.md)                                                         | Автоматичні тести цієї фічі; build і browser journey лише за окремим дозволом.           |

Поточний список працює із серверним сортуванням і пагінацією лише для «Усі товари»; локальну фільтрацію всієї серверної вибірки він не забезпечує. Стару SDD зберігаємо як історію реалізації. Статичний огляд не є повним аудитом проєкту.

## Рішення

### Коригування списку від 2026-10-19

`ProductsUrlState` має окремий `siteQuery` і режим `site`. `ProductsPage` використовує той самий `useGetProductsListQuery`, що й «Усі товари», але для вкладки «На сайті» примусово передає `exportToSite: true`; у звичайній вкладці ця умова відсутня. `missingQuery` і його окремий endpoint не змінюються. `ProductsDataGrid` залишає колонку ознаки без фільтра в header, а footer Data Grid залишається єдиним місцем кількості. Нижченаведене початкове рішення про два режими і чотири колонкові boolean-фільтри є історичним і замінене цим коригуванням.

- `feature` володіє режимом, маршрутами, відновленням контексту й композицією сторінки. URL зберігає для трьох режимів пошук, підтримувані фільтри, sort/page/pageSize; зміна умов скидає сторінку. Невалідні URL-значення нормалізуються без відправлення непідтримуваних умов.
- `model` зберігає tri-state `undefined|true|false` чотирьох ознак. Не перетворювати `false` на «без фільтра», зокрема для `inStock`.
- `data-access` споживає розширені `getAdminProducts` і `getAdminProductsWithUnavailablePhotos` та новий Admin detail за slug; валідує відповіді та переводить їх у власні моделі. Public detail лишається історичним шляхом до переключення. DTO не виходять за data-access.
- `ui` розширює наявний Data Grid доступною дією перегляду, спільною для трьох режимів. Внутрішня навігація лишається у `feature`, не в `ui`.
- Маршрут деталей — `/catalog/:productSlug`. Непорожній slug перевіряється до запиту; `404` публічних деталей не замінюється даними рядка, щоб не створити враження повної картки.
- Product detail query: новий `GET /api/admin/products/by-slug/{productSlug}` після синхронізації provider OpenAPI. Маршрут `/catalog/:productSlug` лишається, тому старі прямі посилання не змінюються. Фото має fallback; блок схеми пропускається, якщо URL порожній або завантаження завершилось помилкою.
- Для звичайного списку підтримувати category/price range лише в межах його контракту; для «Без фото» — пошук, чотири boolean і sort. При поверненні повний стан списку відновлюється з URL. Сортування Data Grid доступне лише для ID/назви/ціни, які підтримує сервер.
- Публічний URL має використовувати конфігуровану адресу storefront, мову `uk`, маршрут `/catalog/product/:productSlug`, URI-encoded slug; показувати тільки за `exportToSite=true` та непорожнього slug. Значення `exportToSite` з Admin-відповіді є авторитетним.
- Після реалізації оновити [опис фічі](../../../../../features/admin/products.md) та індекс, якщо маршрут/призначення змінилися. Старий SDD залишається історичним.

## Аудит відповідальностей

| Файл                     | Поточна роль                        | Рішення                                                             |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------- |
| `products-page.tsx`      | композиція query, вкладок і таблиці | серверні filter/search/sort трьох режимів, розподіл між feature та UI |
| `products-data-grid.tsx` | рядки, стани, пагінація             | controlled Data Grid; не додавати HTTP/router import |
| `admin-navigation.tsx`   | конфігурація та rendering меню      | локальна зміна назви й active state; не переносити доменні правила  |

Нових пакетів не потрібно: `@mui/x-data-grid` і MUI уже встановлені (`package.json`, lockfile). `React Router`, RTK Query та Axios використовуються за чинними [правилами Admin](../../../../../architecture/admin/README.md).

## Адаптивність і теми

Перевірений стан на 2026-10-19: `apps/admin/src/app/theme/admin-theme.ts` визначає `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, `xl: 1440` і схеми `light`/`dark`; `apps/admin/src/app/providers/app-providers.tsx` підключає цей theme через MUI `ThemeProvider` із `defaultMode="system"`. [Admin UI rules](../../../../../standards/admin/admin-ui.md) вимагають наявні MUI patterns/theme і перевірку вузьких та широких layout.

Вкладки, Data Grid, картка, стани та заміни зображень мають брати кольори/типографіку з теми Admin. Локальні жорстко задані світлі кольори не вводити. За кодом звірити підключення `light`/`dark`, `< sm` для телефону, `sm`–`md` для планшета, доступність дії та пагінації, стани loading/empty/error і fallback зображення. Фактичне компонування, перекриття й фокус у браузері не вважати перевіреними без окремого запитання та прямого дозволу користувача на конкретний перегляд.
