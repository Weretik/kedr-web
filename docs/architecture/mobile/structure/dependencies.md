# Mobile dependency rules

## Dependency directions

```text
app -> core | feature | mobile/shared
core -> core | mobile/shared
feature -> ui | model | data-access | mobile/shared
data-access -> model | mobile/shared/api-client | mobile/shared/util
ui -> model | mobile/shared/ui | mobile/shared/util
model -> mobile/shared/util
mobile/shared/* -> mobile/shared/* without cycles
```

| Source          | May depend on                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `app`           | `core`, domain `feature`, `mobile/shared`                                                                           |
| `core`          | `core`, `mobile/shared`                                                                                             |
| `feature`       | `data-access`, `model`, `ui`, `mobile/shared`; cross-domain lower layers only for an explicitly described user flow |
| `data-access`   | its own `model`, `mobile/shared/api-client`, `mobile/shared/util`                                                   |
| domain `ui`     | its own `model`, `mobile/shared/ui`, `mobile/shared/util`                                                           |
| domain `model`  | `mobile/shared/util`                                                                                                |
| `mobile/shared` | other `mobile/shared`; platform-neutral shared contract only for an explicit transport need                         |

Dependency directions match Admin. The only difference is platform-adapter implementation: Mobile shared uses Expo and React Native; Admin shared uses browser and MUI dependencies.

## Constraints

- A domain must not import another domain's internal modules. Feature may orchestrate another domain's public lower-layer API only when the feature design records it; feature-to-feature dependency is prohibited.
- `mobile/shared` must not depend on domain libraries. Generated `@shared/api-contracts` is allowed only at the transport/data-access boundary, not in UI.
- `feature`, `data-access`, `ui`, and `model` must not depend on Expo Router route files.
- `ui` must not import `data-access`, RTK Query hooks, or the router.
- `model` is plain TypeScript without React, React Native, Expo, HTTP, or storage APIs.
- API DTOs must not leave `data-access`; feature and UI use domain models.
- `data-access` does not access Expo SecureStore or NetInfo directly; it receives needed behavior through public `core/auth` and `core/connectivity` adapters.
- Cyclic dependencies and deep imports between libraries are prohibited.
- Use aliases and `src/index.ts` between libraries, not relative imports.

`apps/mobile` is the composition root and owns assembly of domain reducers. `core` provides shell/provider primitives, but does not import domain `model`, `data-access`, `ui`, or `feature`.

## Expo Router exception

`apps/mobile/src/app` is not a domain layer. It is the technical routing layer and may import only the public APIs of `core`, `feature`, and `mobile/shared`. It does not become a shared channel through which domains import one another.

```text
apps/mobile/src/app/catalog/[id].tsx
                ↓
@mobile/catalog/feature
                ↓
@mobile/catalog/data-access -> @mobile/shared/api-client
```
