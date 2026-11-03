# Site product data-access

Server-only typed product detail/index reads, normalization, cache and bounded offset walking.

Public API: `@site/product/data-access`. [Feature/SDD](../../../../docs/specs/site/product/001-product-details/README.md). Shared cart integration remains EN-002/TS-005.

From repository root: `npx nx run site-product-data-access:vite:test -- --run`. Inferred `typecheck` and `lint` targets are available; use only focused checks for the actual change.
