# 001 — Products without photos in Profile

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** profile/catalog
- **Status:** implemented; manual device QA pending
- **Owner:** Mobile team; Catalog API owner for EN-001
- **Created:** 2026-10-03
- **Last updated:** 2026-10-05

In the “Профіль” tab, the manager sees a separate section of products without
photos, can refresh or retry loading, load more results when pagination exists
in the canonical API contract, and open current product details if the contract
provides a supported route identifier.

## Status

- Specification: complete
- Implementation: complete
- Verification: automated gates complete; device/visual QA pending
- Blockers: Android/iOS/Expo web runtime evidence is unavailable in the current
  environment; `contracts:check` remains non-zero until the synchronized
  generated diff is committed; full Expo export fails in the Windows Hermes
  compiler after successful web bundling

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
- [Device QA plan](verification/device-qa.md)
- [Visual QA plan](verification/visual-qa.md)

## Change notes

- 2026-10-03 — Created a scenario-first SDD based on the actual Mobile architecture; unknown API shape was captured in blocking `EN-001`.
- 2026-10-05 — Synchronized the canonical API operation; confirmed pagination and current navigation by `productSlug`.
- 2026-10-05 — Implemented the Mobile data/UI/navigation slice and completed affected automated verification; TS-007 remains blocked pending device QA.
- 2026-10-05 — Fixed runtime compatibility of `photoCheckedAtUtc` with backend `.NET DateTimeOffset`; added a regression test for RFC 3339 offset `+00:00`.
