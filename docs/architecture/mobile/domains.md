# Домени та структура бібліотек Mobile

## Цільова структура

```text
libs/mobile/
├── core/
│   ├── shell/
│   ├── auth/
│   └── connectivity/
├── shared/
│   ├── api-client/
│   ├── config/
│   ├── ui/
│   └── util/
└── catalog/
    ├── feature/
    ├── data-access/
    ├── model/
    └── ui/
```

Нові бібліотеки створюються лише тоді, коли з'являється їхня відповідальність.
Для першого каталогу не потрібно створювати наперед усі папки або майбутні домени
на кшталт `orders` чи `profile`.

## `mobile/core`

`shell` містить мобільний каркас: глобальні providers, Redux store, mapping
corporate Paper theme, safe-area `AppScreen`, tab/stack composition, загальні
headers та навігаційні конфігурації, що не належать окремому домену. `auth` володіє життєвим
циклом сесії та адаптером Expo SecureStore. `connectivity` інкапсулює NetInfo і
надає застосунку нормалізований online/offline-стан.

`core` не містить товарів, замовлень або іншої доменної логіки.

`shared/ui` містить лише повторно використовувані presentational-компоненти та
не володіє темою, store, safe-area shell або глобальними providers.

## Бізнес-домени

Домен розкриває публічний API лише через кореневий `src/index.ts`. Deep imports
до внутрішніх модулів іншого домену заборонені.

| Шар           | Відповідальність                                                                | Не повинен містити                                         |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `feature`     | Мобільний сценарій, екран, orchestration, локальний стан                        | HTTP-деталі, спільні UI-примітиви, Expo Router route-файли |
| `data-access` | RTK Query endpoints, DTO, мапінг, валідація відповіді, cache tags               | JSX, маршрути, Paper-компоненти                            |
| `model`       | Доменні типи, інваріанти, чисті перетворення, Zod-схеми, якщо вони доменні      | React, HTTP, Expo API                                      |
| `ui`          | Повторно використовувані domain presentational-компоненти на React Native Paper | API, router, server state                                  |

Для маленького сценарію допускається почати з `feature` і `data-access`. `model`
та `ui` виділяються, коли типи/логіка або компоненти починають повторно
використовуватися. Це та сама еволюційна модель, що в Admin.

## Перший домен: `catalog`

```text
libs/mobile/catalog/
├── feature/src/
│   ├── index.ts
│   ├── screens/
│   │   ├── catalog-screen.tsx
│   │   └── product-details-screen.tsx
│   ├── components/
│   └── hooks/
├── data-access/src/
│   ├── index.ts
│   ├── api/
│   ├── contracts/
│   ├── mappers/
│   └── validators/
├── model/src/
│   ├── index.ts
│   ├── entities/
│   └── queries/
└── ui/src/
    ├── index.ts
    ├── components/
    └── states/
```

`CatalogScreen` компонує пошук, список, loading/empty/error стани та переходи.
`data-access` повертає доменні моделі, а не API DTO. `ProductCard` належить
`catalog/ui`, якщо його буде використано більше ніж в одному екрані домену.

## Спільний код між клієнтами

Код не переноситься до кореневого `libs/shared` лише через назву «shared».
Спочатку він залишається у `libs/mobile` або `libs/admin`. Спільна бібліотека
допускається лише для чистих TypeScript-контрактів, DTO, Zod-схем або утиліт, які
фактично використовуються щонайменше двома клієнтами й не мають залежностей від
React DOM, MUI, React Native, Expo чи браузерних API.

UI, навігація, auth storage та HTTP runtime конфігурація залишаються
platform-specific, навіть якщо виконують схожу роль у web і mobile.
