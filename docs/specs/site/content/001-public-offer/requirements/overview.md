# Scope and sources

## Outcome

A visitor arriving from a legal footer link or a direct localized address can read and navigate the complete public offer in the existing ClassKedr storefront. Printing produces a clean, complete document. No sign-in or acceptance submission is needed.

## In scope

- Both preserved localized URLs, short H1 and full original document name.
- Complete source contract, seven section anchors and the final source note.
- Desktop contents rail; native mobile/tablet contents disclosure; progressive current-section highlighting.
- Existing light/dark design tokens, responsive reading layout, keyboard access and reduced-motion behavior.
- Browser print action and page-scoped print styles.
- Configured phone/email, related delivery/returns links, current shell and language switch.
- Localized metadata, visible-breadcrumb JSON-LD and sitemap integration.

## Out of scope

Contract editing, legal review, seller/date/bank details, privacy/requisites page migration, acceptance checkboxes, checkout, forms, PDF generation/download, API/CMS, backend, global shell redesign and deployment.

## Source hierarchy

1. Owner-approved [visual concept](../design/accepted-concept.md): composition and interactions.
2. [Project design system](../../../../../standards/site/design-system.md) and current shell: tokens, type, breakpoints and shared frame.
3. `apps/storefront/src/app/localization/translations/public-offer.translation.ts` and `libs/storefront/feature/about-us/src/lib/pages/public-offer/public-offer.html`: original body, ordering and the final note.
4. [Frozen source baseline](../design/source-baseline.json): both original localized documents and source fingerprint for completeness checks.
5. `libs/site/core/config/src/lib/company.ts`: actual phone/email; never infer them from the reference image.

The concept contains source excerpts. Do not OCR or transcribe the image into production copy. Preserve source text even where it mentions Angular components; this is a literal clause, not permission to import Angular code. Header/footer are inherited from Site, including existing changes made outside this task.

## Content boundary

Each locale contains 18 numbered paragraphs in groups 4/3/3/2/4/1/1 plus one final note. All remain in screen HTML and print output. Section-title capitalization and splitting a parenthetical subtitle may follow the concept while retaining every source heading word. Short contents labels are navigation copy, not replacements for complete document headings.

The old duplicated self-link and privacy card are surrounding navigation, replaced by the accepted contents/contact rail. Do not introduce a new dead privacy CTA or add an adjacent-page implementation dependency; keep the original privacy wording within the document and the inherited shell unchanged.
