# SDD-спецификация архитектуры Admin

**Статус:** baseline v0.1  
**Область:** React-приложение `apps/admin` в Nx-монорепозитории  
**Подход:** гибридный domain-first

## 1. Назначение

Этот документ задаёт архитектурный контракт для разработки Admin. Любая новая
возможность сначала описывается отдельной спецификацией, затем реализуется в
границах, определённых здесь.

Цели:

- организовать код по бизнес-доменам, а не по техническим типам файлов;
- изолировать API, состояние, представление и сценарии пользователя;
- поддерживать независимое развитие доменов и предсказуемые Nx-зависимости;
- иметь единый формат постановки задач для работы с ИИ и ревью.

## 2. Целевая структура

```text
apps/
└── admin/
    └── src/
        ├── app/
        │   ├── app.tsx
        │   ├── router/
        │   └── providers/
        ├── main.tsx
        └── styles.css

libs/
├── admin/
│   ├── core/
│   │   ├── shell/
│   │   ├── auth/
│   │   └── permissions/
│   ├── shared/
│   │   ├── ui/
│   │   ├── api-client/
│   │   ├── contracts/
│   │   ├── config/
│   │   ├── util/
│   │   └── testing/
│   ├── products/{feature,data-access,model,ui}/
│   ├── orders/{feature,data-access,model,ui}/
│   ├── clients/{feature,data-access,model,ui}/
│   └── dashboard/{feature,data-access,ui}/
```

Текущий код приложения до миграции может оставаться в `apps/admin/src/pages`,
`widgets` и `shared`. Новый код размещается по целевой структуре; перенос
существующего кода выполняется только отдельной задачей.

## 3. Границы

### Приложение `apps/admin`

Приложение является точкой композиции. Здесь находятся запуск React, корневые
провайдеры, маршрутизация, глобальные стили и подключение feature-библиотек.
Бизнес-правила, вызовы API и доменные компоненты здесь не размещаются.

### `admin/core`

Кросс-доменные возможности только для Admin:

- `shell` — каркас приложения, навигация, layout и область маршрутов;
- `auth` — состояние текущей сессии и сценарии аутентификации;
- `permissions` — проверка прав и разрешённые действия.

`core` не содержит правил конкретных доменов (`products`, `orders`, `clients`).

### Бизнес-домен

Домен — изолированная область предметной области, например `products`. Он
раскрывает публичный API только через свой `src/index.ts`. Импорты во внутренние
файлы другого домена запрещены.

| Слой          | Ответственность                                                             | Не должен содержать                                |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| `feature`     | Экран, пользовательский сценарий, route entry, оркестрация state и UI       | HTTP-вызовы, переиспользуемые примитивы UI         |
| `data-access` | Клиенты API, query/mutation hooks, маппинг transport DTO, кеш и репозитории | JSX-экраны, маршруты                               |
| `model`       | Доменные типы, инварианты, чистые преобразования и селекторы                | React-компоненты, HTTP и browser API               |
| `ui`          | Переиспользуемые доменные presentational-компоненты                         | API-вызовы, роутинг, владение серверным состоянием |

`model` создаётся только когда домену действительно нужны общие типы или логика.
Для небольшого домена достаточно начать с `feature` и выделять остальные слои по
мере появления второй ответственности или повторного использования.

### Внутренняя структура `feature`

Внутренности feature-библиотеки группируются по назначению сценария, а не по
общей структуре всего приложения:

```text
libs/admin/products/feature/
└── src/
    ├── index.ts
    ├── pages/
    │   ├── ProductsPage.tsx
    │   ├── ProductCreatePage.tsx
    │   └── ProductEditPage.tsx
    ├── components/
    │   ├── ProductsToolbar.tsx
    │   └── ProductsFilters.tsx
    ├── hooks/
    │   └── useProductsFilters.ts
    └── products.routes.tsx
```

- `pages` содержат route-level компоненты и собирают сценарий из hooks и UI;
- `components` содержат компоненты, относящиеся только к этому feature;
- `hooks` содержат логику взаимодействия и локального состояния feature;
- `products.routes.tsx` содержит конфигурацию маршрутов домена;
- публичный `src/index.ts` экспортирует только route-конфигурацию и API, нужные
  внешним библиотекам.

Структура выше — начальная, а не обязательная квота каталогов. Папка создаётся
только при наличии соответствующего кода. Пока у домена один небольшой экран,
допустимо разместить его в `pages` без `components` и `hooks`.

Если страница становится самостоятельной бизнес-границей, заметно растёт или
разрабатывается независимо, она выделяется в отдельные библиотеки, например
`feature-list`, `feature-create` и `feature-edit`. Такое деление принимается
отдельным архитектурным решением и не выполняется заранее.

### Маршрутизация доменов

Каждый домен владеет своими маршрутами в `feature` и экспортирует именованную
конфигурацию:

```text
@admin/products/feature -> productsRoutes
@admin/orders/feature   -> ordersRoutes
@admin/clients/feature  -> clientsRoutes
```

`AppRouter` в `apps/admin/src/app/router/app-router.tsx` остаётся composition
root: он подключает layout, объединяет domain routes, задаёт глобальный fallback
и не импортирует реализации страниц. Расположение файла router может меняться
без изменения этого правила.

```text
productsRoutes ─┐
ordersRoutes   ─┼→ AppRouter
clientsRoutes  ─┘
```

### `admin/shared`

`admin/shared` содержит код, общий для нескольких доменов Admin:

- `ui` — React-примитивы, дизайн-система и общие hooks;
- `api-client` — базовый HTTP-клиент, подготовка заголовков и обработка transport-ошибок;
- `contracts` — transport-контракты, общие для доменов Admin;
- `config` — типы и функции конфигурации Admin;
- `util` — общие утилиты Admin;
- `testing` — React render helpers, фабрики и test doubles.

Запрещено переносить в `admin/shared` код, который пока нужен одному домену.
Admin не импортирует существующие библиотеки из корневого `libs/shared`.

## 4. Правила зависимостей

Допустимые направления зависимостей:

```text
app -> core | feature | admin/shared
core -> admin/shared
feature -> ui | model | data-access | admin/shared
data-access -> model | admin/shared/api-client | admin/shared/contracts | admin/shared/util
ui -> model | admin/shared/ui | admin/shared/util
model -> admin/shared/contracts | admin/shared/util
admin/shared/* -> admin/shared/* только при отсутствии циклов
```

Точная матрица:

| Источник       | Может зависеть от                                       |
| -------------- | ------------------------------------------------------- |
| `app`          | `core`, `feature`, `admin/shared`                       |
| `feature`      | `data-access`, `model`, domain `ui`, `admin/shared`     |
| `data-access`  | `model`, `admin/shared/api-client`, `contracts`, `util` |
| domain `ui`    | `model`, `admin/shared/ui`, `admin/shared/util`         |
| `model`        | `admin/shared/contracts`, `admin/shared/util`           |
| `admin/shared` | только другие `admin/shared`-библиотеки                 |

Дополнительные ограничения:

- домен не импортирует внутренности другого домена;
- `admin/shared` не зависит от domain-библиотек;
- Admin не зависит от библиотек корневого `libs/shared`;
- `model`, `ui` и `data-access` не зависят от `feature`;
- `ui` не импортирует `data-access`, роутер или feature;
- `model` остаётся чистым TypeScript и не зависит от React;
- API DTO не выходят из `data-access`: feature и ui используют доменные модели;
- циклические зависимости запрещены;
- прямые relative-импорты между библиотеками запрещены: используются path aliases
  публичных entry points.

Feature одного домена не импортирует feature другого домена. В частности,
`products/feature` не зависит от `orders/feature`. Если пользовательский
сценарий объединяет несколько доменов, создаётся самостоятельная orchestration
feature, например `libs/admin/order-entry/feature`. Она может импортировать
публичные API `products/data-access`, `orders/data-access` и
`clients/data-access`, но не страницы и компоненты других feature-библиотек.

## 5. Nx-контракт

Каждая библиотека получает теги по трём измерениям: область, домен и тип. Для
новых Admin-библиотек применяется целевая схема:

```json
{
  "tags": ["scope:admin", "domain:products", "type:feature"]
}
```

Для `products/data-access` используется
`["scope:admin", "domain:products", "type:data-access"]`, а для общего UI Admin —
`["scope:admin", "domain:shared", "type:ui"]`. Значения
`domain:core` и `domain:shared` применяются к соответствующим кросс-доменным
библиотекам.

Публичный alias следует шаблону:

```text
@admin/<domain>/<layer>
@admin/core/<area>
@admin/shared/<area>
```

### Public API библиотек

Каждая библиотека раскрывает разрешённый API только через корневой
`src/index.ts`. Он явно реэкспортирует компоненты, типы, hooks или
route-конфигурации, предназначенные для внешнего использования. Остальные файлы
считаются внутренними деталями библиотеки.

```ts
// Правильно: импорт через публичный entry point.
import { productsRoutes } from '@admin/products/feature';
import { ProductCard } from '@admin/products/ui';

// Неправильно: deep import во внутреннюю структуру библиотеки.
import { ProductsPage } from '@admin/products/feature/src/pages/ProductsPage';
```

Страницы по умолчанию не экспортируются из feature-библиотеки: приложение
подключает `productsRoutes`, а не реализации `ProductsPage`. Если страница нужна
внешнему потребителю, она добавляется в `src/index.ts` отдельным явным решением;
это не разрешает deep imports.

Целевая конфигурация `@nx/enforce-module-boundaries` проверяет все три измерения:

```text
scope:admin  -> scope:admin

type:feature     -> type:data-access | type:model | type:ui | admin/shared
type:data-access -> type:model | admin/shared/api-client | admin/shared/contracts | admin/shared/util
type:ui          -> type:model | admin/shared/ui | admin/shared/util
type:model       -> admin/shared/contracts | admin/shared/util
```

Типы не образуют линейную цепочку: `feature` может зависеть от `ui`,
`data-access` и `model`, тогда как `ui` не может зависеть от `data-access`.
Тег `domain:*` запрещает прямые cross-domain feature-импорты; для разрешённого
сценария используется отдельный тег orchestration feature и явное исключение в
конфигурации Nx.

Сейчас `eslint.config.cjs` уже проверяет `scope:*` и базовые `type:*` теги, но
`domain:*`, `type:model` и исключение orchestration ещё не настроены. Их нужно
добавить отдельной задачей до генерации первых domain-библиотек; до этого
архитектурное правило проверяется на code review.

## 6. Состояние и API

- Серверное состояние реализуется через RTK Query и принадлежит `data-access`.
- Корневой Redux store находится в `apps/admin/src/app/store.ts`; он создаётся
  через `configureStore` и подключается в корневом provider приложения.
- Общий RTK Query API для Admin находится в `@admin/shared/api-client`: `baseApi`,
  Axios-реализация `baseQuery`, подготовка заголовков, обновление токена и глобальная обработка API-ошибок.
  Детали транспортного контракта зафиксированы в [ADR-0001](adr/0001-admin-axios-transport.md).
- `@admin/shared/api-client` не хранит токены и не знает endpoint обновления сессии. `admin/core/auth`
  передаёт ему `AuthSessionAdapter` при инициализации приложения.
- Контракт ошибок Admin совместим со storefront: `ApiError` содержит `code`, `status`, `message`,
  опциональные `fieldErrors` и `traceId`. Транспорт распознаёт ASP.NET Core `ProblemDetails` /
  `ValidationProblemDetails` и массив ошибок Ardalis.
- Каждый домен объявляет свои endpoints в собственной `data-access`-библиотеке,
  например `products.api.ts` и `orders.api.ts`, расширяя общий `baseApi` через
  `injectEndpoints`.
- Feature-слой использует только экспортируемые типизированные RTK Query hooks и
  не обращается к `baseApi` напрямую.
- Локальное состояние экрана остаётся в `feature`.
- Клиентское состояние домена, которое должно переживать размонтирование экрана
  или использоваться несколькими страницами домена, хранится в
  `feature/state/<domain>.slice.ts`. Reducer экспортируется публично для
  регистрации в `apps/admin/src/app/store.ts`.
- `model` не содержит Redux slice: он остаётся чистым TypeScript без зависимости
  от Redux Toolkit. Не создаётся slice для данных, уже кэшируемых RTK Query.
- Состояние, нужное нескольким несвязанным доменам, допускается только в `core`
  после отдельного архитектурного решения.
- DTO, ошибки API и URL не используются в `ui` и `model`.
- Все внешние данные валидируются и преобразуются на границе `data-access`.

### Структура RTK Query

```text
apps/admin/src/app/
└── store.ts

libs/admin/shared/api-client/
└── src/lib/
    ├── base-api.ts
    └── base-query.ts

libs/admin/products/data-access/
└── src/lib/products.api.ts

libs/admin/products/feature/
└── src/state/products.slice.ts
```

RTK Query хранит server cache, loading и API errors. `createSlice` применяется
только для клиентского состояния, которое нельзя выразить через URL, локальный
state компонента или RTK Query cache. Это правило предотвращает дублирование
одних и тех же серверных данных в двух источниках состояния.

### Формы

Форма относится к бизнес-сценарию и размещается внутри feature-библиотеки
домена. Общая форма create и edit остаётся в одном feature, пока оба сценария
принадлежат одному домену:

```text
libs/admin/products/feature/
└── src/product-form/
    ├── ProductForm.tsx
    ├── product-form.schema.ts
    ├── product-form.types.ts
    └── map-product-to-form.ts
```

- `ProductForm` получает данные и обработчики через props, не вызывает API и не
  владеет маршрутизацией;
- schema, типы формы и преобразования между моделью и form values остаются рядом
  с формой;
- страницы create/edit вызывают RTK Query mutations и передают результат в
  `ProductForm`;
- форма выносится в доменный `ui` только после доказанного повторного
  использования вне feature-сценариев.

Универсальные контролы (`Input`, `Select`, `DatePicker`, `FormField`,
`FormError`) размещаются в `@admin/shared/ui`. Они не содержат бизнес-правил и не
зависят от конкретной библиотеки домена.

Библиотека форм и схема валидации выбираются отдельным ADR до первой реализации;
они не добавляются неявно в рамках feature-задачи.

## 7. SDD-процесс

Для каждой задачи создаётся Markdown-спецификация в
`docs/specs/admin/<domain>/<feature-name>.md`. Реализация начинается после
согласования разделов «Цель», «Границы» и «Критерии приёмки».

Шаблон:

```md
# <Название возможности>

## Цель

Как <роль>, я хочу <действие>, чтобы <результат>.

## Границы

- In scope:
- Out of scope:
- Затрагиваемые библиотеки:

## Сценарии

1. Given ... When ... Then ...

## Контракты и данные

- Endpoint / входные и выходные модели:
- Права доступа:
- Состояния: loading, empty, error, success:

## UI и маршрутизация

- Route:
- Компоненты:

## Критерии приёмки

- [ ]

## Проверка

- Unit:
- Integration / e2e:
- Ручная проверка:

## Открытые вопросы

- [ ]
```

Изменение спецификации после начала разработки фиксируется внизу документа с
датой и причиной. Реализация не добавляет поведение, которого нет в принятой
спецификации.

## 8. Definition of Done

Задача завершена, когда:

- спецификация содержит проверяемые критерии приёмки;
- код расположен в корректных границах и проходит Nx module boundaries;
- добавлены или обновлены релевантные тесты;
- запущены подходящие lint, test и build цели;
- в спецификации отмечены ручные проверки и оставшиеся риски.

## 9. Открытые архитектурные решения

Следующие решения намеренно отложены до появления первой соответствующей feature:

1. Библиотека форм и схема валидации.
2. Единый формат ошибок API и уведомлений.
3. Стратегия прав доступа на уровне маршрутов и действий.
4. Правила i18n для Admin.
