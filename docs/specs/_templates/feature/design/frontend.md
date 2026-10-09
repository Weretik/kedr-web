# <Назва feature> — frontend design

## Affected clients and boundaries

- Client/project:
- Application variant and linked design:
- Nx libraries:
- Public API boundaries:
- Shared behavior reused across clients:

## Architecture baseline

| Area                | Actual evidence                 | Applicable rule        | Required target                       | Finding/prerequisite |
| ------------------- | ------------------------------- | ---------------------- | ------------------------------------- | -------------------- |
| Projects/tags/graph | `<project.json/nx graph>`       | `<architecture path>`  | `<direction>`                         | `<AF/RM/EN або —>`   |
| Layers/owners       | `<exact paths>`                 | `<standard>`           | `<model/data-access/ui/feature/core>` | `<ID>`               |
| Public API          | `<aliases/index.ts/imports>`    | `<nx contract>`        | `<entry point>`                       | `<ID>`               |
| Data/test tools     | `<provider/config/target/test>` | `<state/testing rule>` | `<approved path>`                     | `<ID>`               |

Поточна реалізація не є доказом approved architecture. Finding у dependency
chain feature має completed remediation checkpoint до behavioral task.

## State and data fetching

- Client/server state ownership:
- Validation and mapping boundary:
- Loading, empty, error, offline and stale-data behavior:
- Cache, retry and cancellation decisions:

## Navigation and deep links

- Route/deep-link contract:
- Parameters and invalid-link behavior:
- Access/redirect behavior:

## Platform adapters and permissions

- Browser/native/storage adapter:
- Permission states: unknown, denied, blocked, granted:
- Platform-specific fallback:

## API integration

- Contract reference:
- Request/response mapping:
- Auth, error and observability behavior:

## Test design

- Risks and selected levels:
- Existing targets/config:
- Required `EN-*` for missing tooling:
- E2E decision and reason:

Специфіку React, React Native або Angular описуй у design-файлі відповідного
варіанта. Для React Native visual interaction contract є частиною того самого
варіанта. Видали незадіяні розділи. Observable acceptance залишається у
`requirements/`.
