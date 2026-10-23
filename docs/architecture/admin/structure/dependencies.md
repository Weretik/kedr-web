# Admin dependency rules

## Allowed directions

```text
app -> core | feature | admin/shared
core -> admin/shared
feature -> ui | model | data-access | admin/shared
data-access -> model | admin/shared/api-client | admin/shared/contracts | admin/shared/util
ui -> model | admin/shared/ui | admin/shared/util
model -> admin/shared/contracts | admin/shared/util
admin/shared/* -> admin/shared/* without cycles
```

| Source         | May depend on                                       |
| -------------- | --------------------------------------------------- |
| `app`          | `core`, `feature`, `admin/shared`                   |
| `feature`      | `data-access`, `model`, domain `ui`, `admin/shared` |
| `data-access`  | `model`, API client, contracts, util                |
| domain `ui`    | `model`, shared UI, util                            |
| `model`        | contracts, util                                     |
| `admin/shared` | `admin/shared` only                                 |

## Constraints

- A domain must not import another domain's internal modules.
- `admin/shared` must not depend on domain libraries.
- Admin must not depend on platform/UI libraries in root `libs/shared`.
  The only current exception is the platform-neutral generated contract
  `@shared/api-contracts` at the session/data-access transport boundary.
- `model`, `ui`, and `data-access` must not depend on `feature`.
- `ui` must not import `data-access`, the router, or a feature.
- `model` remains plain TypeScript without React.
- API DTOs must not leave `data-access`; features and UI use domain models.
- Cyclic dependencies are prohibited.
- Use path aliases and public entry points between libraries, not
  relative/deep imports.

A feature in one domain must not import a feature in another. A scenario that
spans multiple domains requires a separate orchestration feature and an explicit
architecture decision.
