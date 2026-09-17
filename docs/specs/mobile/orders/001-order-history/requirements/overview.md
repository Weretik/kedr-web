# Mobile order history — scope and outcome

## Goal

Як менеджер, я хочу переглядати історію та деталі замовлень і фільтрувати
історію за клієнтом, щоб швидко перевіряти склад, суму та стан передачі
замовлення до 1С.

## In scope

- Окрема вкладка «Замовлення» між «Кошик» і «Профіль».
- Newest-first список замовлень із номером, клієнтом, українським статусом,
  кількістю позицій, загальною сумою та датою/часом.
- Один фільтр за активним клієнтом через searchable bottom sheet із варіантом
  «Усі клієнти».
- Збереження вибраного клієнта лише в пам'яті поточної сесії застосунку.
- Сторінкова дія «Показати ще», pull-to-refresh і безпечний retry.
- Read-only деталі замовлення з клієнтом, позиціями, коментарем, статусом,
  документом 1С і загальною сумою, коли відповідні дані існують.
- Українські visible strings, accessibility names, corporate Paper theme,
  стандартна типографіка застосунку, light/dark theme.
- Android та iOS як primary targets; web як підтримуваний smoke surface.

## Out of scope

- Фільтри за статусом, датою, номером або сумою.
- Зміна newest-first порядку або користувацьке сортування.
- Редагування, скасування, видалення чи створення замовлення з історії.
- Зміна кількості, складу, клієнта, коментаря або суми у деталях.
- Ручний retry синхронізації з 1С або polling sync status.
- Показ технічних transport/1С diagnostics.
- Персистентність фільтра після cold start.
- Новий font family, feature-local colors/tokens або копіювання стилів зі
  стороннього screenshot.
- Backend implementation і application code під час підготовки цієї SDD.

## Actors and external systems

- Менеджер: переглядає історію, обирає клієнта, завантажує сторінки та відкриває
  деталі.
- Sales orders API: повертає newest-first сторінки та один persisted order.
- Sales customers API: повертає активних клієнтів для повного локального пошуку.
- 1С: зовнішня система, чий sync status і document number лише відображаються.

## Constraints

- Суми в manager orders трактуються як UAH і відображаються у форматі
  `uk-UA`, наприклад `25 000,00 грн.`.
- UTC timestamps відображаються у часовій зоні `Europe/Kyiv` як
  `17.09.2026, 14:35`.
- `lineCount` означає кількість товарних рядків, а не суму всіх одиниць.
- `counterpartyName` зі списку замовлень є snapshot-назвою для картки; окремий
  customer request на кожен рядок заборонений.
- Frontend OpenAPI snapshot синхронізований із backend commit
  `364b5f12d18cddb6efc800263581b23d25b6e484`; `getAdminOrders` і
  `getAdminOrderById` є anonymous відповідно до `AllowAnonymous` provider
  contract.

## Open product questions

- Немає. Product behavior і provider security contract погоджено.
