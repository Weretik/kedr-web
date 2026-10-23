# Storefront dependency rules

Nx tags `scope:storefront` isolate Storefront from Admin. Storefront libraries may depend only on `scope:storefront` and `scope:shared`.

## Dependency direction

| Library       | Allowed dependencies                                                   |
| ------------- | ---------------------------------------------------------------------- |
| `contracts`   | `contracts`, `util`, `shared`                                          |
| `util`        | `util`, `contracts`, `shared`                                          |
| `ui`          | `ui`, `util`, `contracts`, `shared`                                    |
| `data-access` | `data-access`, `util`, `contracts`, `shared`                           |
| `feature`     | `feature`, `ui`, `util`, `data-access`, `contracts`, `shared`          |
| `shell`       | `shell`, `feature`, `ui`, `util`, `data-access`, `contracts`, `shared` |

These constraints are checked by `@nx/enforce-module-boundaries` in root `eslint.config.cjs`. Do not bypass them with relative or deep imports.

`contracts` does not depend on feature. `data-access` does not depend on feature or shell. UI components do not contain HTTP calls or import feature scenarios.
