# SDD process for Storefront Angular

Storefront in this repository is an Angular SSR application, not React. Create a new feature under `docs/specs/storefront/<domain>/<NNN>-<feature-slug>/` according to the [delivery rules](../../standards/shared/delivery-rules.md). Apply Angular-specific decisions from the [Storefront architecture](README.md) in the design.

Record Angular/SSR, locale, route, state/API, and browser risks in design. `libs/storefront/data-access` has a focused Vitest harness: `npm run test:storefront` and `npm run typecheck:tests:storefront`. The three existing spec files check contracts and mappers; they do not imply full Storefront coverage. For behavior outside this harness, add a relevant test or a separate `EN-*` task to extend the test setup. Lint/build do not replace behavioral tests.

Follow the [testing rules](../../standards/shared/testing-rules.md) and [delivery rules](../../standards/shared/delivery-rules.md).
