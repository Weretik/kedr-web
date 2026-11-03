# SEO design

Sources: [site SEO rules](../../../../../standards/site/seo-rules.md) and [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md). This applies the existing content URL policy, without changing site-wide indexing decisions.

## URLs and discovery

| URL                | Index                                    | Canonical               | robots.txt                                              | Sitemap | Links                                                        |
| ------------------ | ---------------------------------------- | ----------------------- | ------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `/uk/public-offer` | enabled only by existing production gate | same-language self      | existing public-content allow; preview Disallow remains | once    | existing legal footer, home breadcrumb, real section anchors |
| `/ru/public-offer` | same                                     | same-language self      | same                                                    | once    | same, localized                                              |
| Unsupported locale | noindex / 404                            | no advertised alternate | existing policy                                         | absent  | none                                                         |

Keep the old address unchanged; no new redirect, slug parser, query model or unlocalized route. Hashes identify document sections and never enter canonical or sitemap. Any incidental query is excluded from the base content canonical. Existing slash/root normalization stays with the app.

## Metadata

| Field       | uk                                                                                                                                              | ru                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Plain title | Публічна оферта                                                                                                                                 | Публичная оферта                                                                                                                              |
| H1          | Публічна оферта                                                                                                                                 | Публичная оферта                                                                                                                              |
| Description | Публічна оферта та правила користування сайтом Class Kedr: умови замовлення, оплати, доставки, повернення товарів і обробки персональних даних. | Публичная оферта и правила пользования сайтом Class Kedr: условия заказа, оплаты, доставки, возврата товаров и обработки персональных данных. |

`buildPublicOfferMetadata` calls existing `buildPageMetadata`. The root adds `%s | Class Kedr` once. Core builders own canonical, language alternates and robots. Domain SEO keeps its own localized metadata/path constants instead of importing the content model, as required by the actual dependency rule.

Reuse the core Open Graph/Twitter defaults and page title/description/url/locale behavior; do not replace nested defaults with a partial hand-written object or invent an image. Type is website. No custom social artwork or imagegen screenshot is published.

## Structured data and locales

`buildPublicOfferBreadcrumbJsonLd` follows the existing contacts example, using `buildCanonicalPath`, config origin and visible labels: home → public offer. Render with core `JsonLd` so escaping is preserved. Organization stays owned by the layout and is not duplicated. No Product, schema Offer, FAQ, LegalService, seller details or publication/revision dates are inferred from the document.

Both source translations exist. HTML alternates are reciprocal `uk-UA`, `ru-UA` and `x-default` → Ukrainian offer. Do not canonicalize Russian to Ukrainian. A future missing translation must not be advertised as an alternate; it is not an expected state of this fixed source.

## Sitemap and content

Append `{ path: '/public-offer' }` to the current `CONTENT_SITEMAP_PAGES`. Core expands it into two URLs with reciprocal sitemap alternates. Preserve delivery, returns, contacts, wholesale, articles and all existing article-slug entries. Omit `lastModified`: the source has no authoritative modification date. Do not refactor sitemap partitioning in this feature.

H1, original title, all legal paragraphs, final note and crawlable links are server-rendered. The text heading is the page's likely LCP element; no page image or deferred body is needed. Reuse self-hosted fonts, reserve control space and keep only small interactive leaves. Use the existing site's performance goals (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75) as targets, not measured results.

No open SEO product decision blocks this page. Metadata/JSON-LD/sitemap tests passed; detailed commands/results are in [implementation verification](../verification/implementation.md). Actual HTTP output and field performance remain unverified until separately run.
