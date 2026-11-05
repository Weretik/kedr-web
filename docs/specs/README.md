# Frontend feature specifications index

## Architecture remediation

- [Workspace layers and boundaries](architecture/001-workspace-layers-and-boundaries/README.md)

## Admin React

- [Admin template migration](admin/migration/template-migration.md)
- [Admin product list](admin/products/product-list-data-grid.md)
- [Product browsing and “Without photo” mode](admin/products/001-read-only-product-browsing/README.md)
- [Admin customer browsing](admin/clients/001-read-only-customers/README.md)
- [Staff profile, avatars and header menu](admin/users/001-staff-profile-and-avatars/README.md)
- [Media library «Медіа»](admin/media/001-media-library/README.md)
- [Categories: stable addresses, SEO text and FAQ](admin/categories/001-slugs-seo-content/README.md)
- [Admin orders and drafts](admin/orders/001-order-workspace/README.md)
- [Admin order responsibility split](admin/orders/002-order-structure-remediation/README.md)
- [Customer prices and per-unit discount/markup](admin/orders/003-customer-prices-and-adjustments/README.md)
- [Orders and drafts in customer details](admin/clients/002-customer-orders/README.md)
- [Redesign: design system and shell](admin/redesign/001-design-system-and-shell/README.md)
- [Redesign: tables and lists](admin/redesign/002-tables-and-lists/README.md)
- [Redesign: detail pages, forms, and dialogs](admin/redesign/003-details-forms-dialogs/README.md)

## Mobile React Native

- [Foundation](mobile/foundation/mobile-application-foundation.md)
- [Catalog specifications](mobile/catalog/README.md)
- [Shell specifications](mobile/shell/README.md)
- [Orders specifications](mobile/orders/README.md)
- [Cart checkout](mobile/cart/001-manager-cart-checkout/README.md)
- [Products without photos](mobile/profile/001-products-missing-photos/README.md)
- [Redesign: design system «Пагін»](mobile/redesign/001-pagin-design-system/README.md) (replaced by Kedr Manager)
- [Kedr Manager: rebuild of the mobile app](mobile/manager/001-manager-app/README.md)

## Site Next.js

- [Cart and quick checkout / Корзина и заказ](site/cart/001-cart-checkout/README.md) — implemented 2026-11-04 по принятому двухколоночному концепту; 16 R, 30 SC, общий owner/cart_v1/drawer/anonymous createQuickOrder; architecture audit AF-003–006 verified, fresh focused/type/lint/boundary evidence; build/HTTP/browser unrun.

- [Product details / Карточка товара](site/product/001-product-details/README.md) — stage4A implemented 2026-11-03; product158 tests, core5, boundaries27 fixtures and scoped type/lint checks pass; stage4B cart connection completed 2026-11-04 via cart TS-009; build/HTTP/browser unrun.

- [Privacy policy / Политика конфиденциальности](site/content/001-privacy-policy/README.md) — implemented and architecture-audited 2026-11-03; AF-001/AF-002 verified, test typing/import groups fixed; focused checks passed; HTTP/browser/build unrun.

- [Gallery: photos and video](site/content/001-gallery/README.md) — implemented locally 2026-11-03; 7 videos, photo support/next-stage content, 112 focused cases and app/spec types passed; HTTP/browser/build unrun.

- [Public offer](site/content/001-public-offer/README.md) — implemented and architecture-audited 2026-11-03; AF-001–AF-003 verified, DOM ownership corrected; focused checks passed; browser/HTTP/build unrun.

- [Requisites / Реквізити](site/content/001-requisites/README.md) — implemented and architecture-audited 2026-11-03; AF-001 verified, Support split, fresh source/test types and 23 regression tests; EN-002 publication gate open.

- [Articles: list, search and reading](site/content/001-articles/README.md) — implemented and function-audited 2026-11-03; AF-001/AF-002 verified; temporary source, paging/details/301; focused/source checks complete.

- [Wholesale — дверна фурнітура оптом](site/content/001-wholesale/README.md) — implemented и architecture-audited 2026-11-03; AF-001/AF-002 verified; automated/source checks complete; build/HTTP/browser unrun.

- [Contacts](site/content/001-contacts/README.md) — implemented and architecture-audited 2026-11-03; six findings verified, UI extraction and focused checks complete; HTTP/browser/build unrun

- [Delivery and payment](site/content/001-delivery-payment/README.md) — implemented and audited 2026-11-03; localized delivery/payment and sitemap

- [Returns and exchanges](site/content/001-returns-exchanges/README.md) — implemented 2026-11-03; responsibility audit/refactoring completed, findings verified

- [Centered top navigation and theme switch](site/shell/001-top-bar-controls/README.md) — implemented and audited 2026-11-03

- [Storefront migration to Next.js: plan](site/migration/README.md) and [feature inventory with SEO analysis](site/migration/feature-inventory.md)
- [Home page](site/home/001-home-page/README.md) — implemented; company concept and FAQ added 2026-11-03

## Storefront Angular

There are no feature specifications in this directory yet. New storefront work goes to the Next.js site above.

Create a new specification under the [delivery rules](../standards/shared/delivery-rules.md) and the architecture of the relevant application. For systemic debt, create a separate remediation SDD under the [architecture rules](../standards/README.md).
