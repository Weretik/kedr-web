# TS-004 — Metadata и BreadcrumbList

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Covers:** SC-011, SC-013, metadata/indexing часть SC-014.
- **Depends on:** none.
- **Paths:** `libs/site/content/seo/src/lib/contacts-metadata.ts`, `contacts-metadata.spec.ts`, `contacts-json-ld.ts`, `contacts-json-ld.spec.ts` в том же каталоге; `libs/site/content/seo/src/index.ts`.
- **Test level:** unit.
- **Architecture baseline:** content/seo — type:util, только core seo/config/i18n. [SEO-дизайн](../design/seo.md).

## Work

- [x] Добавить buildContactsMetadata с plain localized title, description и path `/contacts` через core buildPageMetadata.
- [x] Проверить self canonical, reciprocal alternates/x-default, OG и production/preview gate в двух локалях; root brand template не дублировать.
- [x] Добавить buildContactsBreadcrumbJsonLd с двумя локализованными абсолютными item, используя текущую SiteConfig/URL policy.
- [x] Сохранить безопасную сериализацию через existing JsonLd при последующей интеграции; не создавать Organization/Store/geo/hours в page builder.
- [x] Дополнить public SEO exports, сохранив delivery/returns. Не импортировать UI/model dictionaries или catalog SEO.
- [x] Проверить целостность двух чистых builders и их тестов; общий core API не менять ради одного потребителя.

## Evidence

Red: `node node_modules/nx/dist/bin/nx.js run site-content-seo:vite:test -- --run contacts` — 4 ожидаемых assertion failures (пустые UK/RU title и отсутствующие breadcrumb items); 3 gate tests прошли.

Green + regression после финального форматирования: `node node_modules/nx/dist/bin/nx.js run site-content-seo:vite:test --output-style=static -- --run` — exit 0, 4 файла / 20 tests (7 новых contacts, delivery 9, returns 4), uncached. Refactor/structure: отдельные metadata/BreadcrumbList builders, только public core imports, старые exports сохранены. Результат metadata helpers не выдаётся за фактический HTTP head.

## Checkpoint

Builders и exports готовы для route/feature integration, оба языка согласованы с site policy, неподтверждённые факты в JSON-LD отсутствуют.

## Последующий архитектурный аудит

AF-002: existing boundary validator теперь разрешает site-content-seo только core config/i18n/seo. Positive 3 / negative 4 новые fixtures с реальными manifests; final fixtures 12/12 и actual graph 102 passed. Production SEO не менялся; старые20 tests не повторялись без нового риска. [Отчёт](../code-audit/audit.md).
