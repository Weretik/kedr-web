# TS-005 — Серверная страница, маршрут и sitemap

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Covers:** SC-001, SC-008, SC-011, SC-012, SC-013, SC-014.
- **Depends on:** TS-003, TS-004.
- **Paths:** `libs/site/content/feature/src/lib/contacts-page.tsx`, `contacts-page.spec.tsx` в том же каталоге; `libs/site/content/feature/src/index.ts`; `libs/site/content/feature/src/lib/content-sitemap.ts`, `content-sitemap.spec.ts`; `apps/site/src/app/[locale]/(content)/contacts/page.tsx`.
- **Test level:** component server output + focused integration sitemap; source integration locale guard, existing layout и shell switch.
- **Architecture baseline:** app → content feature/seo; feature → model/ui/seo/core public API; [Next.js-дизайн](../design/nextjs.md).

## Work

- [x] Собрать ContactsPage: getContactsDictionary, факты COMPANY, локализованный city, ContactsContent и JsonLd для BreadcrumbList.
- [x] Добавить тонкий route с async params и isLocale/notFound; generateMetadata вызывает domain builder только с валидной локалью.
- [x] Убедиться, что existing language switch сохраняет `/contacts`, layout даёт Organization один раз, shell владеет main и skip-link.
- [x] Добавить один contacts descriptor в CONTENT_SITEMAP_PAGES. Не менять app sitemap и не терять delivery/returns.
- [x] Проверить обе локали в server output: H1/контакты/actions до hydration, BreadcrumbList, отсутствие второго main. Проверить sitemap URL/alternates/уникальность и отсутствие lastModified.
- [x] Проверить целостность роли route, page composition и sitemap; не смешивать UI/metadata builders в app route и не переносить соседние страницы.

## Evidence

Red sitemap: `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test -- --run src/lib/content-sitemap.spec.ts` — новый сценарий ожидал UK/RU contacts URLs, получил []; прежний returns case прошёл. Red server: тот же target с `--output-style=static -- --run src/lib/contacts-page.spec.tsx` — 4 ожидаемых failures: нет H1 и BreadcrumbList на null-основе; compile/harness ошибок нет.

Green + regression после final integration/форматирования: `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run` — exit 0, 3 файла / 9 tests, uncached. `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static` — exit 0, route types сгенерированы, 21.9 s, uncached.

Refactor/structure: тонкий route, feature только собирает COMPANY/dictionary/UI/JSON-LD, sitemap остаётся общим списком. LocaleSwitch и layout/main/Organization сверены по источнику; неизвестная локаль guard есть в page и metadata. HTTP 200/404/head не проверялись.

## Checkpoint

Страница подключена по обоим адресам, маршрутизация и SEO используют публичные entry points, sitemap дополняется без дубликатов. Автоматические и source-доказательства названы отдельно от unrun HTTP/browser/build checks.

## Последующий архитектурный аудит

AF-005: feature test typecheck обнаружил TS2345 readonly sitemap descriptors; тест передаёт spread-copy в существующий mutable builder. Feature spec tsc теперь exit 0, final feature 9/9 и source site:typecheck exit 0 после UI extraction. Core API/route/feature composition не менялись. [Отчёт](../code-audit/audit.md).
