# Site content seo

Localized static public content. Returns and exchanges uses the documented content seo boundary.

## Delivery and payment

- `buildDeliveryPaymentMetadata(locale, config?)` supplies Ukrainian/Russian title and description for `/{locale}/delivery-and-payment` through `@site/core/seo`.

- The shared builder owns self canonical, language alternates, Open Graph and the existing production indexing gate. The root layout supplies the title's Class Kedr suffix and absolute metadata base.

- Optional `SiteConfig` supports controlled verification; production callers use the shared default. This library reads no environment variables and imports no Angular code.

Tests: `npx vitest run --config libs/site/content/seo/vite.config.mts`, or the focused Nx target `npx nx run site-content-seo:vite:test -- --run`.
