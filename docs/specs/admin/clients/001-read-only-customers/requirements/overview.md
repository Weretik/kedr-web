# Customers — scope and outcome

## Goal

As an Admin user, I want to browse customers and open the available information for each one so I can find their contact and pricing data without changing records.

## In scope

- The «Клієнти» menu item opens a server-paginated list of active customers only.
- Each row provides navigation to a read-only detail card and return navigation that preserves list page, search, and sort.
- The list shows name, phone when available, and ID. The card shows name, ID, phone, email, and pricing settings. Price types use names instead of numeric IDs; each category uses its name together with its ID.
- MUI Data Grid sends one search field and sorting by name, phone, or ID to the API. The server searches ID, name, and phone across the full result set before pagination and returns the matching customer count. The UI has no column filters.
- Loading, empty, error, invalid-link, and not-found states, with accessible retry.

## Out of scope

Editing, deletion, creation, orders, payments, addresses, statuses, quota, avatars, and export.

## Constraints

“Full information” means all fields in the agreed detail operation, not an arbitrary profile from the reference. The new nullable names are confirmed in backend OpenAPI and synchronized frontend snapshot/generated types. The Admin operation is currently anonymous in OpenAPI; production rollout depends on the backend access policy.
