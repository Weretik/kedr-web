# <Назва feature> — frontend design

## Affected clients and boundaries

- Client/project:
- Application variant and linked design:
- Nx libraries:
- Public API boundaries:
- Shared behavior reused across clients:

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
