# Фактичний frontend inventory

**Знято:** 2026-10-01; test targets перевірено повторно 2026-10-15
**Оновлено для Admin:** 2026-10-19; новий домен `clients`, маршрути товарів/клієнтів і 67 проєктів підтверджено перевіркою `npm run architecture:boundaries`. Решта розділів зберігає дату свого попереднього аудиту.
**Джерела:** `package.json`, lockfile, `nx.json`, `eslint.config.cjs`,
`tsconfig.base.json`, усі `project.json`, `npx nx show projects --json` і
`npx nx graph --file=<temporary-json>`.

Повний перелік прямих залежностей, їхні ролі та джерела версій дивись у
[каталозі технологій та npm-пакетів](technology-and-packages.md).

Цей документ фіксує поточний workspace, а не оголошує порушення допустимими.
Відомі розбіжності мають `AF-*` у
[workspace remediation SDD](../specs/architecture/001-workspace-layers-and-boundaries/README.md).

## Package manager і frameworks

| Область         | Факт                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| Package manager | npm 11.6.2, `package-lock.json`, Node 24.20.x                                       |
| Workspace       | Nx 23.2, 67 projects включно з root npm project (перевірено 2026-10-19)             |
| Storefront      | Angular 21, standalone components, SSR, PrimeNG, signals/RxJS, Angular `HttpClient` |
| Admin           | React 19, Vite 8, MUI 9, Redux Toolkit/RTK Query, Axios                             |
| Mobile          | Expo 57, React Native 0.86, Expo Router, Paper, Redux Toolkit/RTK Query, Axios      |
| Contracts       | OpenAPI snapshot → `openapi-typescript` → `@shared/api-contracts`                   |

## Applications і library groups

| Application  | Composition root  | Main libraries                                                                                 |
| ------------ | ----------------- | ---------------------------------------------------------------------------------------------- |
| `storefront` | `apps/storefront` | `libs/storefront/{contracts,data-access,feature/*,shell,ui,util}` plus Angular `libs/shared/*` |
| `admin`      | `apps/admin`      | `libs/admin/{core/*,dashboard/feature,products/*,clients/*,shared/*}`                          |
| `mobile`     | `apps/mobile`     | `libs/mobile/{core/*,shared/*,catalog/*,cart/*,orders/*,customers/*}`                          |

Усі libraries мають root `src/index.ts`; cross-library imports, знайдені під
час baseline search, використовують aliases із `tsconfig.base.json`. Deep alias
imports не виявлені. Частина barrels розкриває internal transport/mappers/
storage; це AF-008, а не затверджений public contract.

## Фактичний project graph

Ключові edges, які визначають remediation:

```text
storefront -> storefront feature/shell/data-access + Angular shared
admin -> admin core/features/shared
mobile -> shell + catalog/cart/orders features

shell -> mobile-core-connectivity + mobile-shared/api-client + mobile-orders/model
mobile-cart-model -> mobile-orders-model
mobile-catalog-feature -> catalog lower layers + cart data-access/model
mobile-cart-feature -> cart lower layers + customers data-access/model/ui
mobile-orders-feature -> orders lower layers + customers data-access/model/ui
```

Перші три cross-domain feature edges відповідають реалізованим user flows, але
потребують явної orchestration policy. `core -> orders/model` і
`cart/model -> orders/model` суперечать documented direction.

## Tags і enforcement

Використовуються `scope:*`, `domain:*` і `type:*`. Поточний
`@nx/enforce-module-boundaries` перевіряє scopes та частину type-напрямів, але:

- Storefront app має лише `scope:storefront`, без `type:app`;
- немає загального constraint для `type:model`;
- `domain:*` tags не беруть участі у constraints;
- `type:feature` може залежати від іншого `type:feature`;
- Mobile composition і core rules не можуть одночасно пояснити domain reducer
  у `@mobile/core/shell`.

Тому успішний lint є необхідним, але недостатнім evidence меж.

## State і API baseline

| Client     | Approved server path                                                                            | Local/client state                                              |
| ---------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Admin      | domain RTK Query endpoint → `@admin/shared/api-client` → Axios; auth raw Axios лише за ADR-0001 | component state, React Hook Form; Redux для shared client state |
| Mobile     | domain RTK Query endpoint → `@mobile/shared/api-client` → Axios                                 | component/reducer, React Hook Form; root Redux store            |
| Storefront | data-access repository/facade → Angular `HttpClient`                                            | Angular signals/RxJS/domain stores                              |

Прямі API calls у presentation `ui` не виявлені. Generated DTO imports
залишаються в transport/data-access і Admin auth adapter. Винятки та порушення:

- Storefront public `@storefront/contracts` називає domain-facing models `*Dto`
  і feature імпортує їх напряму;
- catalog і order-history controllers копіюють paged query results у local
  arrays;
- RTK Query endpoints не оголошують tag/invalidation semantics;
- runtime validation є у Admin products, Mobile orders/customers/cart і одному
  product-details flow, але відсутня для Mobile catalog list/categories та
  Storefront responses.

## Test і typecheck baseline

| Surface        | Runnable gates                                                                                                                         | Gap                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Admin          | inferred `typecheck`/`vite:test`, `npm run test:web`, Playwright `admin-e2e:e2e`, `typecheck:tests:web`                                | лише app і shared API client мають executable specs; generated empty suites не є characterization |
| Mobile         | app `typecheck`, `npm run test:mobile` для 21 Nx project (app, shell, api-client і domain libraries), `typecheck:tests:mobile`, export | mobile E2E target відсутній                                                                       |
| Storefront     | `storefront:lint`, production `storefront:build`, `npm run test:storefront` для `storefront-data-access`, `typecheck:tests:storefront` | focused specs покривають лише data-access, не весь застосунок                                     |
| Contracts/docs | `contracts:*`, `docs:check`, `docs:format:check`                                                                                       | contract generation змінює generated source і виконується лише в API scope                        |

Baseline 2026-10-01: `npx nx run-many -t lint --all --parallel=4` пройшов для
62 projects; Nx позначив `admin-products-data-access:lint` flaky.
`npm run typecheck:tests` пройшов для Web, Mobile й Admin E2E configs.

## Empty/dead candidates

- `libs/admin/core/permissions` removed: the empty project had no consumers or production responsibility.
- `apps/mobile/src/components`;
- `libs/mobile/{catalog/feature,orders/{data-access,feature,ui}}/src/{test-mocks|lib}`;
- `libs/shared/auth/src/lib/guards`;
- `libs/storefront/feature/{articles,cabinet}/src/lib/sections`;
- `apps/storefront/public/assets/i18n`.

Видалення відбувається лише у RM-009 після перевірки generated/runtime
consumers; сам inventory нічого не видаляє.
