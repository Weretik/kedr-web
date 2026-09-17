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

- Використовуйте чинний RTK Query `baseApi` і typed hooks; не викликайте Axios/HTTP безпосередньо з components.
- Передавайте cancellation signal у transport та зберігайте чинну нормалізацію errors.
- Визначайте pagination, filtering, sorting, cache/refetch semantics у contract до коду.
- Не дублюйте RTK Query cache, loading або error state у feature reducer.

## Public configuration

- Перевіряйте public runtime config на межі застосунку.
- Не додавайте secrets, tokens, PII або request/response bodies у source, logs чи docs.
