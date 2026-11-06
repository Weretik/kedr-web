# Implemented frontend feature catalog

This catalog describes the current implementation, not plans from SDDs. Each card has routes, behavior code, data sources, a **Structure diagram**, a **Code structure** tree of key files, **Tests** with focused run commands, and related specifications. [SDDs](../specs/README.md) hold requirements and history; [architecture](../architecture/frontend-inventory.md) describes shared boundaries.

## Admin React

[AppRouter](../../apps/admin/src/app/router/app-router.tsx) opens `/login` and assembles the other routes inside `AdminLayout` behind the staff session guard. See [Admin architecture](../architecture/admin/README.md).

| Feature                                           | Route or entry                                       | Status                                                                                     |
| ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Session and shell](admin/session.md)             | `/login`, all routes                                 | Cookie sign-in, role guards, layout, navigation                                            |
| [Users](admin/users.md)                           | `/users`                                             | Admin only: staff accounts, roles, block, managers' profile                                |
| [Мої задачі, Звіт роботи](admin/work.md)          | `/my-tasks`, `/work-report`                          | Own task board with results; Admin reads a person's tasks and admin changes                |
| [Мій кабінет](admin/profile.md)                   | `/profile`                                           | Own name, photo; Admin also email and password                                             |
| [Dashboard](admin/dashboard.md)                   | `/dashboard`                                         | What needs attention, today, latest orders                                                 |
| [Products](admin/products.md)                     | `/catalog`, `/catalog/:productSlug`                  | List, details, and adding products to an order set                                         |
| [Categories](admin/categories.md)                 | `/categories`, `/categories/:categoryId`             | Tree, public address, SEO text and FAQ; Admin edits                                        |
| [Ознаки](admin/catalog-attributes.md)             | `/site-showcase?tab=attributes`                      | Tabs of «Вітрина сайту»: properties, values with swatches, 1C codes, category filters      |
| [Вітрина сайту](admin/site-models.md)             | `/site-showcase`                                     | Model review queue with the open model: products, axes, values, SEO texts; dictionary tabs |
| [Media](admin/media.md)                           | `/media`                                             | CDN picture library: folders, upload, replace; Admin deletes                               |
| [Home page blocks](admin/home-content.md)         | `/home-content`                                      | Home FAQ (UK/RU) and brand logos from the media library; order; all staff                  |
| [Page «Співпраця»](admin/wholesale-content.md)    | `/wholesale-content`                                 | Wholesale page texts UK/RU: hero, company, three steps, 1–12 questions; all staff          |
| [SEO сторінок](admin/page-seo.md)                 | `/page-seo`                                          | Search title and description UK/RU of eleven site pages; empty keeps site text; all staff  |
| [Articles](admin/articles.md)                     | `/articles`, `/articles/new`, `/articles/:articleId` | Site articles UK/RU, cover, drafts; all staff edit                                         |
| [Company contacts](admin/company-contacts.md)     | `/company-contacts`                                  | Site phone, email, Telegram, Viber, map, city; all staff edit                              |
| [Company requisites](admin/company-requisites.md) | `/company-requisites`                                | ФОП, code, IBAN, bank, МФО with change history; Admins only                                |
| [Site documents](admin/documents.md)              | `/documents`, `/documents/:kind`                     | Offer, privacy, returns, delivery UK/RU; editions; all staff                               |
| [Site gallery](admin/gallery.md)                  | `/gallery`                                           | Photos from the media library and YouTube videos by link; order, UK/RU titles; all staff   |
| [Оновити сайт зараз](admin/site-refresh.md)       | top bar, all routes                                  | Drops the site content and catalogue cache now; all staff                                  |
| [Customers](admin/clients.md)                     | `/customers`, `/customers/:counterpartyId`           | List, details, and order tables                                                            |
| [Orders and drafts](admin/orders.md)              | `/orders`, `/orders/new`, details and drafts         | Lists, checkout, and draft editing                                                         |

## Mobile React Native

Kedr Manager, rebuilt by the [SDD](../specs/mobile/manager/001-manager-app/README.md) in stages. [Expo Router](../../apps/mobile/src/app/_layout.tsx) opens login, then the working area `(work)` on customer choice; products, calculation and orders stay locked until a customer is chosen and show the customer bar. See [Mobile architecture](../architecture/mobile/README.md).

| Feature                                             | Route or entry                                      |
| --------------------------------------------------- | --------------------------------------------------- |
| [Shell and navigation](mobile/shell.md)             | `index.ts`, `_layout.tsx`, `(work)/_layout.tsx`     |
| [Sign-in and session](mobile/auth.md)               | `login.tsx`, root layout guard, cabinet             |
| [Offline data and sync](mobile/sync.md)             | `(work)/_layout.tsx` (`SyncProvider`)               |
| [Customers](mobile/customers.md)                    | `/customer`, `/customer/[counterpartyId]`           |
| [Products](mobile/catalog.md)                       | `/products`, `/products/[productId]`                |
| [Calculation and send queue](mobile/calculation.md) | `/calculation`, `(work)/_layout.tsx` (queue runner) |
| [Orders](mobile/orders.md)                          | `/orders`, `/orders/[orderId]`                      |
| [Cabinet](mobile/cabinet.md)                        | `/cabinet`                                          |

## Site Next.js

The new public site (`apps/site`); routes live in [app/[locale]](../../apps/site/src/app/[locale]/layout.tsx). Features move here from the Angular storefront by the [migration plan](../specs/site/migration/README.md). See [Site architecture](../architecture/site/README.md).

| Feature                                            | Route or entry                                                      | Status                                                                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Site shell](site/shell.md)                        | all `/uk` and `/ru` routes, `robots`, `sitemap`                     | Header with centered top links and sun/moon switch, footer, languages, SEO base                                                                                              |
| [Site home page](site/home.md)                     | `/uk`, `/ru`                                                        | Home and company page (`#about-company`); hero/search, catalog, results, brands and FAQ from the Content API with code fallback (uk/ru)                                      |
| [Delivery and payment](site/delivery-payment.md)   | `/{locale}/delivery-and-payment`                                    | Sourced UK/RU terms, ordering steps, contact, themes/responsive layout, metadata and sitemap                                                                                 |
| [Returns and exchanges](site/returns-exchanges.md) | `/{locale}/returns-exchanges`                                       | UK/RU conditions, warranty, full policy, process, phone, native FAQ, metadata and sitemap                                                                                    |
| [Company contacts](site/company-contacts.md)       | layout, shell, JSON-LD, pages                                       | Admin-edited phone, email, messengers, map and city from the Content API, ten-minute cache, code fallback                                                                    |
| [Contacts](site/contacts.md)                       | `/{locale}/contacts`                                                | UK/RU phone, clipboard feedback, messengers/email/map, cooperation, server HTML, metadata/BreadcrumbList and sitemap                                                         |
| [Requisites](site/requisites.md)                   | `/{locale}/requisites`                                              | UK/RU confirmed administration data, exact clipboard, server content, metadata/BreadcrumbList and sitemap; architecture-audited, Support split; EN-002 publication gate open |
| [Public offer](site/public-offer.md)               | `/{locale}/public-offer`                                            | Complete UK/RU contract and note, contents, print, configured contacts, metadata/BreadcrumbList and sitemap                                                                  |
| [Privacy policy](site/privacy-policy.md)           | /{locale}/privacy-policy                                            | Complete UK/RU policy, summary, native contents, configured contacts, server HTML, metadata/BreadcrumbList and sitemap                                                       |
| [Wholesale](site/wholesale.md)                     | `/{locale}/wholesale`                                               | UK/RU wholesale offer (texts from the admin, code fallback), live compact categories, manager contact, degraded content, metadata/BreadcrumbList and sitemap                 |
| [Articles](site/articles.md)                       | `/{locale}/articles`, `/{locale}/articles/{slug}`                   | UK/RU articles from the Content API (admin-managed); search and 10/20/50 paging from 20 articles; reading pages, 301, metadata and sitemap                                   |
| [Site catalog](site/catalog.md)                    | `/{locale}/catalog`, `/{locale}/catalog/{slug}`, `/{locale}/search` | Category page of model cards with attribute filters, pages, SEO text and FAQ; hub; search with exact 1C code; mega menu                                                      |
| [Product details](site/product.md)                 | `/{locale}/product/{slug}`, `/product/sitemap/{id}.xml`             | Model page (switchers, in-stock variants, variants table, texts, other models) over the product page; SSR/canonical/308/Product JSON-LD; shared cart                         |
| [Gallery and video](site/gallery.md)               | /{locale}/galleria                                                  | Mixed gallery UI/viewer from the Content API (photos from the media library, YouTube videos), UK/RU, SEO/sitemap                                                             |
| [Cart and quick checkout](site/cart.md)            | Header drawer, `/{locale}/checkout`, product purchase               | Shared document owner, cart_v1 recovery, two columns from 720px container, UK/RU contacts, anonymous order and confirmed receipt                                             |

## Storefront Angular

Routes come from [app.routes.ts](../../apps/storefront/src/app/app.routes.ts) and have the `/uk` or `/ru` prefix. See [Storefront architecture](../architecture/storefront/README.md).

| Feature                                                   | Route or entry                                                                          |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Categories](storefront/catalog/categories.md)            | `/`, `/categories`                                                                      |
| [Product list and details](storefront/catalog/catalog.md) | `/catalog/products`, `/catalog/:categorySlug/products`, `/catalog/product/:productSlug` |
| [Cart](storefront/catalog/cart.md)                        | Component in the header                                                                 |
| [Checkout](storefront/catalog/checkout.md)                | `/checkout`                                                                             |
| [Sign in](storefront/account/auth.md)                     | `/login`                                                                                |
| [Cabinet](storefront/account/cabinet.md)                  | `/cabinet/dashboard`                                                                    |
| [Articles](storefront/content/articles.md)                | `/articles`, `/articles/:id`                                                            |
| [About and legal pages](storefront/content/about-us.md)   | Seven `about-us` routes                                                                 |
| [Contacts](storefront/content/contacts.md)                | `/contacts`                                                                             |
| [Regions](storefront/content/regions.md)                  | `/region/:city`                                                                         |
| [Wholesale](storefront/content/wholesale.md)              | `/wholesale`                                                                            |
| [404 page](storefront/not-found.md)                       | Shell                                                                                   |
| [Home](storefront/home.md)                                | Library exists, not routed: `categoriesRoutes` handles `/`                              |

After behavior changes, compare the card and this catalog with the code.
