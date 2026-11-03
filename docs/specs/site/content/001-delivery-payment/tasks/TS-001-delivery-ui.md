# TS-001 — Localized delivery UI

- **Covers:** R-001–R-011; SC-001–SC-007.
- **Depends on:** EN-001.
- **Paths:** `libs/site/content/ui/src/index.ts`, `src/lib/i18n/delivery-payment-dictionary.ts`, `src/lib/delivery-payment/*` (relative to the UI project), focused UI tests.
- **Owner:** UI agent; do not edit shared documentation/indexes or another library.
- **Test level:** component and source/style review.

## Work

Copy exact UK/RU source values with no Angular imports. Implement separate header/breadcrumb/anchor, shipping/payment, order steps, important terms/offer and phone contact components according to design/frontend.md. Preserve all qualifications; pickup omitted. Use shared Button, COMPANY phone, locale helpers, lucide and inherited site tokens. Respect source wording even where the raster differs. Use semantic headings/lists, visible keyboard focus and responsive anchor clearance. Check each file's responsibility and split independent blocks before handoff.

## Evidence

- Completed SC-001–SC-007, 2026-11-03. Five server-renderable blocks and typed standalone dictionary publicly exported under @site/content/ui.
- Red: node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts — exit 1; eight expected failures for missing headings, regions and anchor navigation against compilable null stubs, not harness/import errors.
- Green/final regression after implementation and formatting: same command — exit 0, 8 tests in 1 delivery test file.
- Independent exact source comparison: 28 UK + 28 RU original keys/values match Angular, zero differences. Additional UI labels localized separately. Full dispatch/OR, tariffs, conditional cash on delivery, IBAN, return, price, correspondence and offer terms retained.
- Source/style review: inherited tokens/Onest; one phone column, sm two/lg four ordered steps, lg two terms panels; labelled anchor targets with scroll-mt-40/md:scroll-mt-16; configured company phone and shared Button. No client state, API, Angular import, direct env read or raw HTML.
- Scoped Prettier and git diff --check passed. No browser validation. Agent returned complete source/structure evidence; coordinator preserves concurrent ReturnsContent export in shared UI index.

## Checkpoint

Complete server-renderable UI exports, exact sourced copy, focused tests pass and no confirmed in-scope finding remains. Return evidence for SC-001–SC-007.
