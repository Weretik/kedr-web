# 001 — Public offer

- **Client:** Next.js public site, `apps/site`, Kedr frontend.
- **Domain:** content.
- **Status:** implemented 2026-11-03; automated/source verification completed. Browser/HTTP/build/actual-print checks are unrun.
- **Owner:** Kedr frontend implementer; product/design decisions belong to the site owner.
- **Authorization:** the owner accepted the concept and SDD, then explicitly requested implementation of the whole feature with the existing multi-agent workflow.
- **Migration:** one legal page from [step 6](../../migration/README.md); the other content pages retain their own status.

Implement the existing `/uk/public-offer` and `/ru/public-offer` addresses in Site. Visitors can read the complete localized document, jump between seven sections, print it and contact Kedr. The [accepted concept](design/accepted-concept.md) governs page composition; the current shell and [design system](../../../../standards/site/design-system.md) govern shared UI. The generated image shows only the beginning of a long document.

## Starting state and boundary

At specification time, the Angular page and both translations existed. Site had a `/public-offer` legal link, but the page implementation and sitemap descriptor had not yet been added. The completed implementation is described by the current status and feature card below. Reuse the existing content model/UI/SEO/feature projects; add no project, package, API or backend work. Preserve all concurrent changes, public exports and sitemap entries.

The complete document means seven headings, 18 numbered paragraphs and the final unnumbered source note. Preserve the source numbering, including 1.2.1 and 3.1.2. The screenshot is not a legal-text source. The accepted design changes the reading layout and surrounding navigation, not the contract.

## Navigation

- [Scope and sources](requirements/overview.md)
- [Rules and observable scenarios](requirements/behavior.md)
- [Frontend architecture and planned files](design/frontend.md)
- [Next.js route and rendering](design/nextjs.md)
- [SEO design](design/seo.md)
- [Presentation model](data-model.md)
- [Task graph](tasks/README.md)
- [Traceability](traceability.md)
- [Specification readiness](checklist/spec-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Specification review and documentation checks](verification/spec-review.md)
- [Architecture audit and verified corrections](code-audit/audit.md)

## Decisions and readiness

No unresolved product decision or shared prerequisite blocks specification readiness. The existing privacy-policy route is a separate migration scope: this page does not recreate the old duplicate privacy sidebar/self-link. The complete source note and the reference to privacy in clause 6.1 remain. Existing shell links are preserved; this SDD does not claim adjacent legal pages are implemented.

Implementation tasks TS-001–TS-006 and audit follow-ups TS-007/TS-008 are complete at their documented automated/source verification scope. See [implementation verification](verification/implementation.md) and the [actual feature card](../../../../features/site/public-offer.md). No browser/HTTP/build/real-print result is claimed.

## History

- 2026-11-03 — accepted concept captured in-repository; scenario-first Next.js SDD prepared.

- 2026-11-03 — owner authorized implementation; public route, complete document, contents, print and SEO integrated.

- 2026-11-03 — requested architecture/responsibility audit completed; see [findings and correction verification](code-audit/audit.md).
