# TS-002 — Подтверждённый server-only источник

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-001, SC-010, SC-013, SC-014.
- **Depends on:** TS-001, EN-001.
- **Test level:** unit / focused source integration.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `libs/site/content/data-access/src/lib/gallery-source.ts`
- `libs/site/content/data-access/src/lib/gallery.ts`
- `libs/site/content/data-access/src/lib/gallery.spec.ts`
- `libs/site/content/data-access/src/index.ts`
- `apps/site/public/images/gallery/`

## Work

- [x] Добавить только source/assets, подтверждённые EN-001; не переносить Article_*.jpg или изображения из макета.
- [x] Реализовать getGalleryMedia(locale), валидацию и mapping readonly модели; не экспортировать bilingual manifest.
- [x] Проверить дубли ID, incomplete translations, invalid provider ID, размеры, локальные asset paths и наличие реальных файлов.
- [x] Сохранить существующий articles source и public exports; сеть/cache/API не добавлять.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

44 source cases; Red 43 failed/1 passed, Green 44/44. После совместимого hasOwnProperty.call regression 44/44.

Разрешённый source содержит все семь видео; фото отложены владельцем. Public API только getGalleryMedia.

- Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --maxWorkers=1 --no-file-parallelism --config libs/site/content/data-access/vite.config.mts src/lib/gallery.spec.ts`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Подтверждённый source согласованного видеоэтапа в обеих локалях возвращается через разрешённый public API; реальные assets доступны, source integrity проходит.
