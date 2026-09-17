# 001 — Mobile manager cart checkout

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** cart
- **Status:** implemented; runtime device QA pending
- **Owner:** Mobile team
- **Created:** 2026-09-17
- **Last updated:** 2026-09-17

Менеджер переглядає збережений кошик, коригує кількість у межах останнього
відомого залишку, вибирає активного клієнта та створює повноцінне Sales
замовлення для асинхронної передачі до 1С.

## Status

- Specification: accepted
- Implementation: complete through the delivery checkpoint
- Verification: automated checks passed; runtime device/visual QA pending
- Blockers: no implementation blocker; Android/iOS/web interaction environments
  were unavailable for manual verification

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

- 2026-09-17 — Initial scenario-first specification from agreed cart, customer
  selection and manager-order decisions.
- 2026-09-17 — Implemented the accepted feature, synchronized the Sales
  contract, passed automated delivery checks and recorded unavailable device QA.
