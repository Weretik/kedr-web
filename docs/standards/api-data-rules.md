# API and data rules

## Contracts and DTO

- Canonical machine contract у frontend — versioned snapshot
  `docs/contracts/openapi/`, синхронізований із зафіксованого backend commit.
- Request, response і schema types генеруються CLI-командою
  `npm run contracts:generate` у `@shared/api-contracts`; handwritten копії
  тих самих transport shapes заборонені.
- Generated types дозволені лише в transport, auth adapter або domain
  `data-access`. Feature, UI і domain model отримують власну модель через mapper.
- Generated TypeScript перевіряє compile-time сумісність, але не замінює runtime
  validation для external/unknown responses.
- Кожна споживана operation має stable `operationId` і коротку consumer
  projection у `docs/contracts/<module>/` з mapping, behavior та limitations.

- Public API route, query parameters і response fields стабільні за замовчуванням; breaking change потребує contract, migration path і rollout у feature spec.
- Посилайтеся на versioned OpenAPI snapshot до реалізації client code.
- DTO, transport envelope і runtime response parsing залишаються private у `data-access/contracts`.
- Mapper перетворює DTO на domain/view model на API boundary; `ui` і `feature` не працюють із DTO.
- Не показуйте користувачу raw transport errors, stack traces або internal details.

## Requests and state

- Admin і Mobile використовують чинний RTK Query `baseApi`, injected endpoints
  і typed hooks. Axios належить відповідному shared API client; raw Axios у
  `admin/core/auth` дозволений лише для session bootstrap/refresh згідно з
  `docs/architecture/admin/adr/0001-admin-axios-transport.md`.
- Storefront використовує Angular `HttpClient` у `data-access`, repository/
  facade і signals/RxJS. RTK Query до Storefront не застосовується.
- Components і presentation `ui` жодного клієнта не викликають HTTP/API напряму.
- Передавайте cancellation signal у transport та зберігайте чинну нормалізацію errors.
- Визначайте pagination, filtering, sorting, cache/refetch semantics у contract до коду.
- Не дублюйте RTK Query cache, loading або error state у feature reducer чи
  component state. Для Storefront не дублюйте resource/observable server state
  поза його data-access facade.
- `fetch` у `libs/shared/logging` допустимий лише як best-effort fallback після
  `sendBeacon`; він не є API/server-state transport і не може використовуватися
  доменними queries/mutations.

## Public configuration

- Перевіряйте public runtime config на межі застосунку.
- Не додавайте secrets, tokens, PII або request/response bodies у source, logs чи docs.
