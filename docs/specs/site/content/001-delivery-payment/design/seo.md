# Delivery and payment SEO

- URL stays `/{locale}/delivery-and-payment`, matching the current Angular site and shell links. No redirect required.
- Public content is eligible for indexing in production, gated by existing `SITE_ENV=production` and `SITE_INDEXING=true`. Reuse core robots policy; no local bypass.
- Domain `buildDeliveryPaymentMetadata(locale)` calls `buildPageMetadata` from `@site/core/seo`; route only delegates.
- UK title: `Доставка та оплата`; RU title: `Доставка и оплата`. Existing root title template supplies Class Kedr.
- Proposed UK description: `Умови доставки й оплати Class Kedr: відвантаження по Україні, тарифи перевізника, оплата за реквізитами та погодження післяплати.`
- Proposed RU description: `Условия доставки и оплаты Class Kedr: отгрузка по Украине, тарифы перевозчика, оплата по реквизитам и согласование наложенного платежа.`
- Self canonical is `/uk/delivery-and-payment` or `/ru/delivery-and-payment`, with no fragment/query. Alternates are uk-UA, ru-UA and x-default to UK; Open Graph uses the corresponding localized URL, title and description.
- Add one locale-free descriptor `/delivery-and-payment` from content/feature to `buildSitemapEntries` in app sitemap; let the core builder expand both languages and alternate links. No invented `lastModified`.
- Keep existing Organization structured data from the layout. Do not introduce Product/Offer, shipping price or FAQ structured data for this static information page.
- Main text, H1, legal qualification and crawlable anchors are server-rendered. Public-offer links stay in the current language. Existing navigation links continue using the same public route.

R-012 / SC-008 are verified with domain metadata and sitemap composition tests. R-001/R-009 are covered by localized UI/feature tests and existing shell-link source inspection. No production build or browser run is implied.
