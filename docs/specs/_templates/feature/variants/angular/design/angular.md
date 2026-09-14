# <Назва feature> — Angular Web design

## Architecture placement

- App composition and route paths:
- Domain/feature library responsibilities:
- Data-access/service responsibilities:
- UI responsibilities:
- Shared utilities/contracts:
- Public exports:

Для поточного Storefront звір межі `apps/storefront` і
`libs/storefront/{feature,data-access,ui,shell,contracts,util}`.

## Angular and SSR behavior

- Router and lazy-loading boundary:
- Component/template responsibilities:
- Signals, services and state ownership:
- SSR, hydration and browser-only boundary:
- Locale-aware navigation/content:
- Form, focus, keyboard and accessibility:
- Responsive and loading/empty/error states:

## State and API

- Client/server state ownership:
- Data fetching, transfer/cache, retry and cancellation:
- DTO validation and mapping:
- Auth/session and safe error behavior:

## Verification

- Affected Nx projects:
- Existing test targets and test files:
- Required `EN-*` for the missing/insufficient Angular test harness:
- Unit/component/integration coverage:
- SSR/build verification:
- Critical E2E decision:

Звіряйся зі
[Storefront architecture](../../../../../../architecture/storefront/README.md)
і [testing rules](../../../../../../standards/testing-rules.md).
