# Frontend design

## Перевірений базис перед реалізацією 2026-10-21

До цієї зміни `apps/admin/src/app/router/app-router.tsx` підключав dashboard/products/clients, а `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx` не мав пункту замовлень. Products і Clients задавали UI-композицію за [стандартом](../../../../../standards/admin/list-detail-pages.md). Admin використовував RTK Query у domain data-access, generated OpenAPI types на транспортній межі та runtime validation. Orders domain було створено в цій реалізації.

## Плановані межі

- Створити `libs/admin/orders/{model,data-access,ui,feature}` лише з потрібними Nx projects/exports за [правилами доменів](../../../../../architecture/admin/structure/domains.md). `feature` володіє маршрутами `/orders`, `/orders/new`, `/orders/:orderId`, `/orders/drafts/:draftId`, `/orders/drafts/:draftId/edit`; exact route order визначити без колізій.
- `orders/data-access` ін’єктує endpoints через `baseApi.injectEndpoints`, runtime validates/mapping; `feature` оркеструє запити та URL; `ui` відображає таблиці/картки/форму без HTTP. Пошук клієнта використовує чинну Admin customer query через дозволену межу; міждоменні імпорти й ownership визначити в EN-001, не послаблюючи Nx boundary.
- Поточний локальний набір належить `orders/feature/state` або app orchestration. Версіоноване `localStorage` зберігає тільки productId/quantity, читається під час bootstrap, відкидає пошкоджений payload із повідомленням; операції запису після кожної зміни. Кілька вкладок узгоджують state через `storage` event або явно повідомляють про конфлікт, без мовчазної втрати.
- Кнопки у Products не можуть імпортувати orders feature напряму за [dependency rules](../../../../../architecture/admin/structure/dependencies.md). Обраний напрям для EN-001: app-level route factory передає в products feature callback додавання товару; callback у `apps/admin` викликає orders state action. Products не імпортує orders, shared event bus не потрібен. EN-001 перевіряє цей напрям за фактичним Nx graph до коду.
- URL містить tab, page, pageSize, search, sort, counterpartyId окремо для кожної вкладки. Пошук debounce, скасування застарілих запитів; RTK Query cache key включає всі умови, mutations invalidates потрібні списки/деталі.
- Перед записом UI отримує quote; ціну не обчислює зі спискової ціни товару. Після зміни клієнта/кількості quote invalidates; submit блокується до нового quote. Якщо backend повідомляє зміну quote, показати актуальну суму й повторити confirmation.
- Таблиця/деталі використовують чинну Admin theme, локаль, Card, Data Grid, стрілку назад, доступні action icons. Діалог видалення називає чернетку й має явну destructive action. Не копіювати компоненти товарів або клієнтів без доведеного повторного використання.
- Автоматичні тести зміни стану/збереження, mapper, URL, двох таблиць, confirmation й помилок; браузерна перевірка лише за окремим прямим дозволом.

**EN-001:** зафіксувати сигнатуру route factory, callback і публічні exports; customer picker бере чинний пошук клієнтів через дозволений публічний data-access контракт після перевірки Nx constraints.

**Рішення EN-001 після реалізації:** `createProductsRoutes({ onAddProduct })` приймає app-level callback, `createOrdersRoutes({ CustomerPicker, ProductPicker })` приймає app-owned адаптери, `CustomerOrdersPanel({ counterpartyId, returnTo })` є публічним export для `createClientsRoutes({ renderOrdersPanel })`. `apps/admin/src/app/router/app-router.tsx` з’єднує ці межі. App adapters використовують публічні clients/products data-access; orders domain не імпортує інші домени. Чотири orders libraries мають окремі Nx project tags і aliases.

`DraftDetail` із `pricingStatus=Unavailable` показує nullable ціну як недоступну. `Quote` має строгі ненульові поля; його ключ залежить від клієнта та рядків. Після зміни цих даних попередній quote не відкриває submit. Конфлікт ціни прив’язується до поточного ключа й вимагає нового підтвердження.

## Architecture baseline і цільові Nx межі

На початку 2026-10-21 `apps/admin/project.json` мав теги `scope:admin,type:app`, а `products/feature` та `clients/feature` — `scope:admin,domain:<name>,type:feature`; orders Nx projects були відсутні. Тепер чотири orders libraries мають теги `scope:admin,domain:orders,type:<layer>`, aliases `@admin/orders/<layer>` та публічні `src/index.ts`. Чинні правила `@nx/enforce-module-boundaries` і project boundary script зберігаються; перевірка пройшла для 71 проєкту.
