# TS-005 — Metadata и BreadcrumbList

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-015, SC-016, SC-017.
- **Depends on:** нет.
- **Test level:** unit.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `libs/site/content/seo/src/lib/gallery-metadata.ts`
- `libs/site/content/seo/src/lib/gallery-metadata.spec.ts`
- `libs/site/content/seo/src/lib/gallery-json-ld.ts`
- `libs/site/content/seo/src/lib/gallery-json-ld.spec.ts`
- `libs/site/content/seo/src/index.ts`

## Work

- [x] Добавить builders через существующие core APIs; source/model imports в SEO запрещены текущим allowlist.
- [x] Проверить UK/RU, plain title без удвоения бренда, description, self canonical, reciprocal alternates и HTML x-default.
- [x] Проверить config-controlled origin/OG и общий indexing gate, BreadcrumbList из двух элементов.
- [x] Не добавлять VideoObject/lastModified/неподтверждённые schema fields и отдельный OG screenshot.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

Red 10 expected failures; Green 10/10 в Node environment, DOM unit tests не используют.

Core-only boundary сохранён; metadata/BreadcrumbList проверены, даты/VideoObject/Twitter не выдумывались.

- Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --environment=node --maxWorkers=1 --no-file-parallelism --config libs/site/content/seo/vite.config.mts src/lib/gallery-metadata.spec.ts src/lib/gallery-json-ld.spec.ts`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Новые builders дают корректные metadata/BreadcrumbList для обеих локалей и сохраняют core policy без нового boundary.
