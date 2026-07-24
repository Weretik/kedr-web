# Фаза 2: React data-access для списку товарів

**Статус:** accepted  
**Залежить від:** [фаза 1](01-admin-api-contract.md)  
**Блокує:** фази 3–5

## Мета

Підключити `@admin/products/data-access` до затвердженого Admin API через RTK
Query та надати feature типізований hook без transport-деталей.

## Межі

- У межах: query/response типи, нормалізація параметрів, endpoint у `baseApi`,
  перетворення DTO в доменну модель, публічний export hook.
- Поза межами: JSX, MUI, фільтри, Data Grid, Redux slice, зміни `baseApi` або
  глобального store.

## Рішення

- Endpoint оголошується через `baseApi.injectEndpoints` у
  `@admin/products/data-access`.
- Query, row і page типи залишаються у `data-access` та експортуються з його
  public API: чинне Nx boundary правило забороняє `type:data-access` залежати
  від `@admin/products/model`. Глобальні правила не змінюються лише заради цієї
  feature.
- Hook приймає нормалізований `ProductsListQuery`; Axios отримує його як
  `params` для `GET /api/admin/products`.
- RTK Query cache key формується з повного застосованого query.
- `isSuccess: false` envelope-відповідь та некоректні дані перетворюються на
  типізовану помилку на межі data-access.

## Сценарії

1. Given `ProductsListQuery`, when feature викликає hook, then відправляється
   один GET з query string і повертаються модель рядків, `totalRecords` та
   стандартні RTK Query стани.
2. Given два різні query, when вони запитуються, then RTK Query не змішує їхні
   кешовані відповіді.

## Критерії приймання

- [ ] У `ProductsPage` немає Axios або прямого HTTP.
- [ ] DTO не виходить за межі `data-access`.
- [ ] Публічний API бібліотеки містить лише потрібні hook і доменні типи.
- [ ] Дотримані Nx dependency boundaries.

## Перевірка

- `npx nx lint admin-products-data-access`.
- Автоматизовані тести не додаються в межах поточного scope.

## Результат реалізації

- Створено `productsApi` з `useGetProductsListQuery` для
  `GET /api/admin/products`.
- Query нормалізується та мапиться на `SearchTerm`, `InStock`, `IsSale`,
  `IsNew`, `PriceFrom`, `PriceTo`, `Sort`, `Page`, `PageSize`.
- Відповідь API перевіряється на межі data-access і мапиться у типізовану page
  модель; DTO не потрапляє у feature.
- `npx nx lint admin-products-data-access` і
  `npx nx lint admin-products-model` завершилися успішно.
- Прямий `tsc -p ... --noEmit` не є валідною перевіркою цієї бібліотеки: він
  падає на наявних типах `import.meta.env` у `@admin/shared/config`, які Vite
  додає під час app build. Помилка не пов’язана з цією фазою.

## Історія змін

- 2026-07-24: фазу реалізовано й прийнято; автоматизовані тести не додавалися
  за погодженим scope.
