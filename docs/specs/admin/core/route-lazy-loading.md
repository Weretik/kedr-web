# SDD: route-level lazy loading Admin

**Статус:** accepted

## Мета

Завантажувати код feature-сторінок лише після переходу на їхній маршрут, не
змінюючи URL, shell або публічний API feature libraries.

## Межі

- У межах: lazy import для `dashboard` і `catalog`, один fallback у shell,
  архітектурні правила route-level code splitting.
- Поза межами: ручний `manualChunks`, зміна MUI, нові залежності, зміна route
  paths або поведінки сторінок.

## Структура реалізації

- Route page має `default` export; `feature/*/*.routes.tsx` створює його через
  `lazy(() => import('./pages/<page>'))` без named-export adapter.
- `core/shell/components/route-loading-fallback.tsx` — один presentational
  fallback для відкладеного route content.
- `AdminLayout` містить `Suspense` навколо `Outlet`.

## Критерії приймання

- [ ] Dashboard і catalog page відсутні з initial JavaScript chunk.
- [ ] Під час завантаження feature chunk shell лишається доступним, а content
      area показує доступний fallback.
- [ ] Route paths, navigation і page public APIs не змінюються.
- [ ] `npx nx lint admin-core-shell`, lint feature libraries та
      `npx nx build admin` проходять.

## Результат

- Dashboard і catalog page завантажуються через `React.lazy` з dynamic import.
- `AdminLayout` показує єдиний `RouteLoadingFallback` навколо `Outlet`.
- Lint `admin-core-shell`, `admin-dashboard-feature`, `admin-products-feature`
  та production build Admin завершилися успішно.
- Initial JavaScript chunk зменшився з приблизно 954 kB до 443 kB; dashboard
  виділено у lazy chunk 333 kB, catalog — у lazy chunk 2.7 kB.
