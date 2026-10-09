# Повний аудит архітектури та відповідальностей коду

Це обов'язковий quality gate для наявного й нового коду feature. Він перевіряє
Nx projects/tags, напрям залежностей, domain layers, public API, approved
state/data stack, DTO boundary, test tooling і dead/stale structure.

Скопіюйте [audit.template.md](audit.template.md) до
`<feature>/code-audit/audit.md` і виконайте фази по черзі:

1. [00 — inventory](phases/00-inventory.md);
2. [01 — architecture boundaries](phases/01-architecture-boundaries.md);
3. [02 — state, data and tools](phases/02-state-data-tools.md);
4. [03 — UI and feature ownership](phases/03-ui-feature.md);
5. [04 — public structure](phases/04-public-structure.md);
6. [05 — testing](phases/05-testing.md);
7. [06 — remediation verification](phases/06-remediation-verification.md).

## Project-specific baseline

Спочатку визначте клієнт у [frontend inventory](../../../architecture/frontend-inventory.md):

- Admin і Mobile: RTK Query + client-specific Axios base API;
- Storefront: Angular `HttpClient` + repository/facade + signals/RxJS;
- generated `@shared/api-contracts` залишається на transport/data-access boundary;
- усі cross-library imports проходять через alias і root `src/index.ts`.

Поточний код не є доказом approved pattern. Якщо architecture/standards
суперечать config або одне одному, спочатку виправте документацію і створіть
remediation prerequisite.

## Findings і delivery

Кожна розбіжність отримує стабільний `AF-*`, owner, evidence, target state,
exact paths, task, dependencies і verification. Статуси: `open`, `blocked`,
`planned`, `fixed`, `verified`, `deferred-approved`.

`open`, `blocked` і `planned` не проходять delivery checkpoint. `fixed` означає
лише реалізовану зміну до final regression. `deferred-approved` потребує явного
погодження, окремої SDD/task і доказу, що finding не є prerequisite.

Системні findings спочатку оформлюються через
[remediation template](../remediation/README.md). [Готовий prompt](USAGE.md).
