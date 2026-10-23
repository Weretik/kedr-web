# Products without photos in Profile — scope and outcome

## Goal

As a manager, I want to see products without photos in the “Профіль” tab so I can quickly find records that need content updates.

## In scope

- A “Товари без фотографій” section in the “Профіль” tab.
- Initial list loading and visible loading, empty, error, and success states.
- Manual retry after an error and pull-to-refresh for a successful list.
- Load subsequent results only if the canonical API contract supports pagination.
- Navigate to current product details only if the response provides an identifier supported by current navigation.
- Ukrainian text, touch targets, text scaling, TalkBack/VoiceOver, safe area, and Android, iOS, and Expo web behavior.

## Out of scope

- Any backend changes.
- Adding, uploading, editing, or checking photos.
- Client-side rechecking whether a product actually has photos.
- Creating a new product detail screen.
- Changes to other tabs.
- Search, sorting, or filters for this list.
- Implementing application code as part of preparing this specification.

## Actors and external systems

- Manager: views the list, refreshes it, retries a failed request, and opens details if the current route supports it.
- KedrStore Catalog API: returns products guaranteed to have no photos; Mobile does not question this business meaning.
- Current Mobile product details flow: opens a supported product without creating a new screen.

## Constraints

- Membership in the list comes only from the specialized operation response; the client does not filter by photo/image fields.
- Response fields, parameters, pagination, and access rules are not determined by assumption; they must be confirmed in the current API contract.
- Reuse existing mobile product patterns only when confirmed data can be displayed without inventing values.

## Open product questions

- [BLOCKED BY EN-001, owner: Catalog API owner] What exact request/response, access/error, and pagination semantics does the current list contract provide?
- [RESOLVED BY EN-001, owner: Mobile team] Does the confirmed consumer projection contain an identifier required by the existing detail navigation? If not, products remain non-interactive; no new navigation is created.
