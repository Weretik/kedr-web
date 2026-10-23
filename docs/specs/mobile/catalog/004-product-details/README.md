# 004 — Mobile product details

- **Application type:** React Native
- **Client:** Mobile
- **Domain:** catalog
- **Status:** implemented; device verification deferred
- **Owner:** Mobile team
- **Created:** 2026-09-15
- **Last updated:** 2026-09-15

The manager opens a product from the current searched or filtered catalog, reviews all details and images available through the API, and can add an available product with a price to the local cart. Returning restores the previous catalog without losing the query or scroll position.

## Status

- Specification: ready
- Implementation: complete
- Verification: automated checks and Android/web production exports pass; interactive device/visual QA deferred
- Blockers: no interactive Android/iOS device was available; the backend contract has no description field, so the UI does not invent one

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

- 2026-09-15 — Created a scenario-first SDD based on the actual Mobile architecture, OpenAPI, and supplied visual reference; implementation had not started.
- 2026-09-15 — Implemented the route, API mapping/query, gallery, all page states, persistent local cart, and acceptance tests; Android/web bundles pass, device QA deferred.
