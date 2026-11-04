# Site requisites

**Routes:** `/uk/requisites`, `/ru/requisites`. [SDD](../../specs/site/content/001-requisites/README.md) и [принятый дизайн](../../specs/site/content/001-requisites/design/visual.md).

Страница показывает подтверждённые данные администрации ClassKedr и банковские реквизиты, копирует отдельно IBAN либо полный шестистрочный набор, предлагает согласовать оплату заказа с менеджером. UI поддерживает UK/RU, текущие light/dark tokens и mobile stacking. Официальное имя сохраняется на украинском в обеих локалях.

Локальная реализация выполнена 2026-11-03. EN-001 закрыт владельцем; EN-002 остаётся внешним publication gate для оферты/политики. Public-offer route появился отдельно, privacy-policy в проверенных destinations ещё отсутствует. Source/компонентная проверка href не означает HTTP-доступность.

## Architecture

```mermaid
flowchart LR
  Route["Next requisites route"] --> Feature["content/feature: RequisitesPage"]
  Route --> SEO["content/seo: metadata"]
  Feature --> Facts["core/config: COMPANY_REQUISITES + shared/company phone"]
  Feature --> Model["content/model: dictionary + copy formatter"]
  Feature --> UI["content/ui: RequisitesContent"]
  Feature --> SEO
  Feature --> Json["core/seo: JsonLd"]
  UI --> Copy["client: RequisitesCopyButton x2"]
  UI --> Shared["shared/ui"]
  SEO --> CoreSEO["core/seo + config + i18n"]
  Sitemap["existing app sitemap"] --> Registry["CONTENT_SITEMAP_PAGES"]
```

Core config владеет фактическими строками, model — presentation types, UK/RU copy и pure formatter. Feature собирает props/payload; UI не импортирует банковский config. SEO имеет отдельный маленький locale record по boundary allowlist. API, HTTP data-access, формы и персональное хранилище не добавлялись.

Весь основной контент и BreadcrumbList доступны в server HTML. Только copy leaf гидратируется: idle/pending/success/error, ref-guard, live status, selectable single/multiline fallback и retry. Clipboard error не вызывает звонок. Единственный main, shell, locale/theme controls и Organization остаются у существующих владельцев; WebSite принадлежит главной.

## Code structure

```text
apps/site/src/app/[locale]/(content)/requisites/page.tsx  # thin async locale route/metadata
libs/site/core/config/src/lib/company-requisites.ts     # owner-confirmed official facts
libs/site/content/
├── model/src/lib/
│   ├── requisites-types.ts                            # readonly presentation contracts
│   ├── requisites-dictionary.ts                       # UK/RU interface labels
│   └── requisites-copy.ts                             # exact six-line payload
├── ui/src/lib/requisites/
│   ├── requisites-content.tsx                         # server composition/layout
│   ├── requisites-header.tsx                          # breadcrumbs/H1/anchors
│   ├── requisites-administration.tsx                  # official data panel
│   ├── requisites-bank.tsx                            # bank/IBAN and copy actions
│   ├── requisites-payment.tsx                         # agreement before payment
│   ├── requisites-support.tsx                         # support layout/composition
│   ├── requisites-legal-links.tsx                     # legal navigation
│   ├── requisites-contact-card.tsx                    # manager phone/call
│   └── requisites-copy-button.tsx                     # only client leaf
├── seo/src/lib/
│   ├── requisites-metadata.ts                         # core metadata wrapper
│   └── requisites-json-ld.ts                          # absolute two-item breadcrumbs
└── feature/src/lib/
    ├── requisites-page.tsx                            # config/model/UI/JSON-LD integration
    └── content-sitemap.ts                             # one /requisites descriptor
```

Public exports дополняют existing core/config и content libraries. Новых Nx projects, dependencies, aliases, shell API и global CSS нет. Длинный IBAN/имя переносимы; copy использует raw значения независимо от визуальных переносов.

## Tests

Команды focused; это не обязательный full-suite пакет:

- `site-content-model`: `npx nx run site-content-model:vite:test -- --run src/lib/requisites-copy.spec.ts` — порядок/точность payload, labels и immutable values.
- `site-content-ui`: `npx nx run site-content-ui:vite:test -- --run src/lib/requisites/requisites-content.spec.tsx src/lib/requisites/requisites-copy-button.spec.tsx` — локали/семантика/назначения и controlled clipboard states.
- `site-content-seo`: `npx nx run site-content-seo:vite:test -- --run src/lib/requisites-metadata.spec.ts src/lib/requisites-json-ld.spec.ts` — self canonical, alternates/indexing и breadcrumbs.
- `site-content-feature`: `npx nx run site-content-feature:vite:test -- --run src/lib/requisites-page.spec.tsx src/lib/content-sitemap.spec.ts` — server facts, реальный UI payload и sitemap registry.
- `npx nx run site:typecheck` — Next route/type integration; фактический результат этого этапа использовал Nx cache.

Получены 43 passing tests в последних узких прогонах, scoped lint pass и source review. [Точные результаты и пределы](../../specs/site/content/001-requisites/verification/seo-verification.md) различают unit/component/server evidence, source/type guards и незапущенные HTTP/browser/build проверки.

## Architecture audit

[Аудит и исправление AF-001](../../specs/site/content/001-requisites/code-audit/audit.md) выполнены 2026-11-03: Support оставлен владельцем раскладки, legal links и contact card вынесены в два локальных server leaf с узкими props. Public API, DOM/aria/href/classes и дизайн сохранены. После split — 18 UI + 5 server tests без Nx cache, fresh source/test types с 0 diagnostics и scoped lint pass. Исторические 43 tests внедрения не выдаются за повторный полный прогон.
