# SEO

| URL                                  | Index after production gate | Canonical                       | Sitemap | Status / links                      |
| ------------------------------------ | --------------------------- | ------------------------------- | ------- | ----------------------------------- |
| /{locale}/articles                   | yes                         | self                            | yes     | 200; shell/breadcrumb               |
| /articles?page=N, default size, no q | yes                         | self with normalized page       | no      | 200; real pager links               |
| /articles?q=...                      | noindex,follow              | self normalized q/page/pageSize | no      | 200; GET search/pager               |
| /articles?pageSize=20 or 50          | noindex,follow              | self normalized query           | no      | 200; size controls                  |
| page beyond end                      | no stale page URL           | normalized last available page  | no      | temporary redirect to available URL |
| /{locale}/articles/{slug}            | yes                         | self                            | yes     | 200; real card links                |
| /{locale}/articles/{1..6}            | redirect                    | destination                     | no      | 301 in maintained app redirect map  |
| unknown slug                         | no                          | none                            | no      | 404 via notFound                    |

Query defaults omitted. Canonical never crosses languages or collapses different content to page 1. Unknown query keys omitted from canonical. Indexing stays off on preview/development; no robots configuration relaxation. UK/RU translations come from the same six source records. x-default points to UK. Search alternates must not claim equivalent localized search results when query matching differs: nonindex search variants omit hreflang; ordinary paging/detail reciprocally alternate.

Metadata: content/seo delegates to buildPageMetadata. Plain list title «Статті» / «Статьи», localized page suffix for page2+, query-aware nonindex title; description describes door-hardware articles, no new claims. Detail title is real source title, description real excerpt, OpenGraph type article with local cover absolute URL. Root brand template and metadataBase inherited.

JSON-LD: list BreadcrumbList only; detail BreadcrumbList + Article (headline, description, image if present, inLanguage, datePublished from source, publisher from COMPANY, mainEntityOfPage). No invented author/dateModified/reviews or Product schema. JsonLd safe serialization is reused. Organization remains in layout.

Sitemap: list and six slug paths (14 localized URLs total), no query/ID/lastModified without actual modification date. Existing descriptors preserved.

Performance targets reuse site budgets LCP≤2.5s, INP≤200ms, CLS≤0.1; declared targets, not measured. Main text uses semantic server HTML; fixed image dimensions prevent layout shift. Full HTML/head/HTTP/runtime evidence requires authorized build/server later; unit/static render evidence only in current task.
