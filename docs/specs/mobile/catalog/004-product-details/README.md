# 004 — Mobile product details

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** catalog
- **Status:** implemented; device verification deferred
- **Owner:** Mobile team
- **Created:** 2026-09-15
- **Last updated:** 2026-09-15

Менеджер відкриває товар із поточного пошукового або відфільтрованого каталогу,
переглядає всі доступні в API деталі та зображення і може додати доступний товар
із ціною до локального кошика. Повернення відновлює попередній каталог без
втрати query та scroll position.

## Status

- Specification: ready
- Implementation: complete
- Verification: automated checks and Android/web production exports pass;
  interactive device/visual QA deferred
- Blockers: no interactive Android/iOS device was available; backend contract
  has no description field, so the UI does not invent one

## Requirements

- [Scope and outcome](requirements/overview.md)
- [Business rules and scenarios](requirements/behavior.md)

## Technical context

- [Frontend design](design/frontend.md)
- [React Native design](design/react-native.md)
- [Visual and interaction contract](design/visual-interaction.md)
- [API integration contract](contracts/api-contract.md)
- [Visual and package research](research/visual-references.md)

## Planning and delivery

- [Traceability](traceability.md)
- [Task graph](tasks/README.md)
- [Specification readiness](checklist/spec-readiness.md)
- [React Native readiness](checklist/react-native-readiness.md)
- [Visual readiness](checklist/visual-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Visual delivery](checklist/visual-delivery.md)
- [Device QA](verification/device-qa.md)
- [Visual QA](verification/visual-qa.md)

## Change notes

- 2026-09-15 — створено scenario-first SDD за фактичними Mobile architecture,
  OpenAPI та наданим visual reference; implementation не розпочато.
- 2026-09-15 — реалізовано маршрут, API mapping/query, gallery, усі page states,
  persistent local cart і acceptance tests; Android/web bundles pass, device QA deferred.
