# <Назва feature> — API integration contract

## Source

- OpenAPI snapshot file under `docs/contracts/openapi/`:
- Stable `operationId`:
- Generated `operations[...]` / `components[...]` references:
- Consumer projection under `docs/contracts/<module>/`:
- Provider repository commit from `docs/contracts/openapi/SOURCE.md`:

## Operations

| User intent | Method/path    | Request           | Success           | Expected errors  |
| ----------- | -------------- | ----------------- | ----------------- | ---------------- |
| <intent>    | <METHOD /path> | <shape/reference> | <shape/reference> | <status/meaning> |

## Client projection

- DTO validation:
- Mapping to frontend model:
- Pagination/cache semantics:
- Cancellation/retry:
- Safe user-facing errors:

## Contract verification

- `npm run contracts:lint`:
- `npm run contracts:generate` and clean generated diff:
- Test level and target:
- Fixture/source:
- Compatibility or blocker:

Не копіюй request/response schemas вручну. Transport code імпортує generated
types з `@shared/api-contracts`, а mapper повертає application/domain model.
Generated types не є runtime validation. Не вигадуй поля чи responses. Видали
цей файл, якщо feature не перетинає API boundary.
