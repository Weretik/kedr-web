# <Назва feature> — React Web design

## Architecture placement

- App composition and route paths:
- Domain/model responsibilities:
- State/data-access responsibilities:
- UI responsibilities:
- Feature orchestration responsibilities:
- Public exports:

Для поточного Admin звір межі
`libs/admin/<domain>/{model,data-access,ui,feature}`.

## React Web behavior

- Router and lazy-loading boundary:
- Browser/history behavior:
- Form, focus and keyboard behavior:
- Responsive states:
- Existing UI components and tokens:
- Loading, empty, error and forbidden states:

## State and API

- Local/client/server state ownership:
- Hooks/store responsibilities:
- Data fetching, cache, retry and cancellation:
- DTO validation and mapping:
- Session, 401/403 and safe errors:

## Verification

- Affected Nx projects:
- Existing test targets and test files:
- Unit/focused integration/component coverage:
- Browser integration need:
- Critical E2E decision:
- Required `EN-*` for missing tooling:

Для Admin звіряйся з
[React architecture](../../../../../../architecture/admin/README.md) і
[testing rules](../../../../../../standards/testing-rules.md).
