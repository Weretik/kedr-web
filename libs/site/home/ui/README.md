# site-home-ui

Presentational blocks of the Next.js site home page (Server Components). See the [home page specification](../../../../docs/specs/site/home/001-home-page/README.md).

- `HomeHero` — the only H1, lead text, and a GET search form to the all-products listing.
- `WholesalePanel` — partner benefits, the cooperation page link, and a call link.
- `HomeCompany`, `HomeAdvantages`, `HomeResults`, `HomeBrands`, `HomeFaq` — the approved company concept, including sourced results and native FAQ.
- `HomeSection`, `CatalogUnavailable` — titled blocks and the API failure notice.
- `getHomeDictionary`, `getCompanyDictionary` — home and company copy for `uk` and `ru`.

Tests: `npx nx run site-home-ui:vite:test -- --run`.
