# Frontend design

Sources: [site modules](../../../../../architecture/site/structure/modules.md), [design system](../../../../../standards/site/design-system.md), [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md). Next 16.4.3 installed guide `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` was read before code changes.

## Architecture baseline

At initial SDD creation the content domain was planned. Concurrent delivery/payment work then created ui/seo/feature; reuse those projects and append returns-specific exports. Generate only the missing model project. Existing site home has feature/ui/seo libraries; catalog has model/data-access/ui/seo/feature. Apps use public aliases in `tsconfig.base.json`; site-core-config owns COMPANY and site-core-i18n owns Locale/localizedPath. The app already has the returns link in shell navigation. Content imports neither Angular Storefront nor home features. Storefront translations are a source to copy, not a runtime dependency.

Use the four documented content layers; only model requires a new Nx generation: model, ui, seo, feature. Tags: scope:site, domain:content, type:model/ui/util/feature (SEO uses util). app -> feature/seo; feature -> content ui/model and core; ui -> content model, core config/i18n, shared/ui; seo -> core seo/i18n. The SEO layer uses its own constant path to avoid util -> model violations. Public exports only. No data-access library, API contract, query state, cache invalidation or backend work is needed. No confirmed AF finding blocks this scope. CONTENT_SITEMAP_PAGES is owned by content/feature and shared with delivery; preserve its existing entries.

## Composition

Inherit the current site shell instead of recreating the example header/footer. Use the approved concept: compact breadcrumb/title/intro, underlined green anchors, two outlined label/value panels, tinted three-step process, notes and phone panel. At mobile sizes panels and steps stack; headings wrap naturally. Tokens provide light/dark behavior; green body text uses brand-text, icons brand, primary call button ink. Lucide stroke 1.75.

Full policy follows the compact concept as an anchored section; a short FAQ uses native details/summary consistent with home. All content is a Server Component. Keep copy/model, information panels, process, complete policy and FAQ in separate cohesive files. No global CSS edit and no client handler. Use anchor scroll offsets for the existing sticky header.

## Planned file-role map

| Path                                                              | Status                        | Responsibility                                                                 |
| ----------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `libs/site/content/model`                                         | new                           | Typed localized content and complete policy copied from Storefront             |
| `libs/site/content/ui/src/lib/returns/`                           | new files in existing project | Summary panels, process, full policy, FAQ and contact UI                       |
| `libs/site/content/feature/src/lib/returns-page.tsx`              | new                           | Compose page from locale dictionary and UI                                     |
| `libs/site/content/seo/src/lib/returns-metadata.ts`               | new                           | Localized metadata; feature owns shared sitemap descriptors                    |
| `apps/site/src/app/[locale]/(content)/returns-exchanges/page.tsx` | new                           | Await params, locale guard, call feature/metadata                              |
| `apps/site/src/app/sitemap.ts`                                    | change                        | Merge content entries with existing home/catalog                               |
| `tsconfig.base.json`, `package.json`                              | change                        | Generated public aliases and add focused content projects to site CI test list |
| `docs/features/site/returns-exchanges.md`                         | new                           | Actual architecture and focused test commands                                  |
| `docs/features/README.md`, `docs/specs/README.md`                 | change                        | Navigation entries                                                             |
| `docs/architecture/site/structure/modules.md`                     | change                        | Record new domain and route                                                    |

## States and verification

Static translated content has no loading/error/empty state. FAQ closed/open are native; contact has standard link focus/hover. Component tests prove both languages, section targets, policy preservation, process and configured phone. SEO tests prove URLs/metadata and sitemap entries. New boundaries require architecture check; new generated projects and public aliases require a narrow typecheck. No production build, browser, manual or E2E check without separate user permission. Existing unrelated changes are retained.

Concept copy may abbreviate policy for readability. Complete existing text remains available and no new legal interpretation or compensation timeframe is introduced. The image is not shipped as page content.

## Responsibility refinement after audit

TS-005 separates returns-summary-copy.ts (literal summaries), returns-policy-sections.ts (key-checked policy mapping) and returns-dictionary.ts (assembly/FAQ). UI composition uses private returns-header.tsx and returns-contact.tsx; support owns notes and grid layout. Public library APIs, routes, page markup and business content are unchanged. No new Nx project or shared abstraction. The pure model uses root tooling without React-only generated .babelrc/local ESLint config. See code-audit/audit.md for split/keep decisions and verification.
