# 001 — Mobile order history

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** orders
- **Status:** implementation complete; device QA pending
- **Owner:** Mobile team
- **Created:** 2026-09-17
- **Last updated:** 2026-09-17

Менеджер відкриває окрему вкладку історії замовлень, переглядає newest-first
сторінки, обмежує список одним активним клієнтом і відкриває read-only деталі
замовлення без редагування чи повторної синхронізації.

## Status

- Specification: accepted
- Implementation: complete
- Verification: automated gates and exported web smoke complete
- Blockers: Android/iOS device-only QA requires a configured device environment

## Requirements

- [Scope and outcome](requirements/overview.md)
- [Business rules and scenarios](requirements/behavior.md)

## Technical context

- [Frontend design](design/frontend.md)
- [React Native design](design/react-native.md)
- [Visual interaction contract](design/visual-interaction.md)
- [API integration contract](contracts/api-contract.md)
- [Visual references](research/visual-references.md)

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

- 2026-09-17 — Initial scenario-first specification from the agreed order
  history, customer filter, pagination, read-only detail and visual decisions.
- 2026-09-17 — Implemented the accepted feature and passed contract, lint, test,
  typecheck and Android/iOS/web export gates; physical device QA remains assigned.
