# 001 — Returns and exchanges

- **Client:** Next.js public site (`apps/site`)
- **Domain:** content
- **Status:** implemented 2026-11-03; focused automated verification and local source review complete; browser/build/HTML verification unrun.
- **Scope authorization:** owner requested SDD followed by implementation with multiple agents.
- **Migration:** a single page from [step 6](../../migration/README.md); the rest of step 6 remains planned.

Implement `/uk/returns-exchanges` and `/ru/returns-exchanges` using the approved [visual concept](design/returns-concept.png). The supplied delivery/payment example defines composition; the approved generated returns concept defines this page. Existing site shell stays the source of header/footer, company facts and theme.

- [Requirements and observable scenarios](requirements/behavior.md)
- [Frontend design and file roles](design/frontend.md)
- [SEO design](design/seo.md)
- [Tasks and dependencies](tasks/README.md)
- [Traceability](traceability.md)
- [Verification record](verification/seo-verification.md)

No backend operation, return request form, customer account, policy rewrite, new global styling, or deployment is included. Existing Storefront policy is the text source; the concept is visual authority, not a source for new business conditions.

- [Independent local review](verification/local-review.md) — no material findings in the changed area.

- [Architecture audit and responsibility refactoring](code-audit/audit.md) — TS-005 completed; 4 low findings verified.
