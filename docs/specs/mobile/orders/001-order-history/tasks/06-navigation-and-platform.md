# Phase 06 — navigation and platform

**Purpose:** register the orders tab and stack detail through thin Expo Router
adapters.

## Planned subphases

- `TS-008` inserts «Замовлення» between cart and profile and renders the public
  history screen.
- `TS-009` validates `orderId`, opens detail outside tabs and preserves standard
  back navigation.

## Exit checkpoint

Route tests prove tab order, thin adapters, valid detail navigation and safe
invalid/not-found fallback without HTTP or business logic in route files.
