# Домени та структура feature Admin

## Цільова структура

```text
libs/admin/
├── core/{shell,auth,permissions}/
├── shared/{ui,api-client,contracts,config,util,testing}/
├── products/{feature,data-access,model,ui}/
├── orders/{feature,data-access,model,ui}/
├── clients/{feature,data-access,model,ui}/
└── dashboard/{feature,data-access,ui}/
```

Новий код розміщується за цією структурою. Перенесення наявного коду виконується
лише окремою задачею.

## `admin/core`

`shell` містить каркас, навігацію, layout та область маршрутів; `auth` — сесію й
автентифікацію; `permissions` — перевірку прав. `core` не містить правил
конкретних доменів.

## Бізнес-домени

Домен ізольований і розкриває публічний API лише через кореневий `src/index.ts`.
Deep imports до внутрішніх модулів іншого домену заборонені.

| Шар           | Відповідальність                                          | Не повинен містити          |
| ------------- | --------------------------------------------------------- | --------------------------- |
| `feature`     | Екран, сценарій користувача, route entry, orchestration   | HTTP і спільні UI-примітиви |
| `data-access` | API, query/mutation hooks, DTO mapping, cache             | JSX і маршрути              |
| `model`       | Типи, інваріанти, чисті перетворення                      | React, HTTP, browser API    |
| `ui`          | Повторно використовувані domain presentational-компоненти | API, router, server state   |

`model` створюється лише за наявності спільної логіки або типів. Невеликий домен
може почати з `feature`; додаткові шари виділяються за появи нової
відповідальності чи повторного використання.

## Внутрішня структура feature

Внутрішні модулі групуються за призначенням сценарію:

```text
libs/admin/products/feature/src/
├── index.ts
├── products.routes.tsx
├── pages/
├── components/
├── hooks/
└── state/
```

Папки створюються лише за наявності відповідного коду. Якщо сторінка стає
самостійною бізнес-межею, вона виділяється в окрему feature лише окремим
архітектурним рішенням.

## `admin/shared`

`admin/shared` містить лише код, спільний для кількох доменів: UI-примітиви,
API-клієнт, transport-контракти, config, util і testing. Він не залежить від
доменів. Код, потрібний одному домену, не переноситься до shared заздалегідь.
