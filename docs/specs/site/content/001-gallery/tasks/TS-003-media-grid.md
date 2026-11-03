# TS-003 — Медиакомпозиция, фильтры и состояния изображений

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-001, SC-002, SC-003, SC-004, SC-009, SC-010, SC-011, SC-012.
- **Depends on:** TS-001.
- **Test level:** component + source review.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `libs/site/content/ui/src/lib/gallery/gallery-header.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-browser.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-filters.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-grid.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-card.tsx`
- `libs/site/content/ui/src/lib/gallery/media-image.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-browser.spec.tsx`
- `libs/site/content/ui/src/index.ts`

## Work

- [x] Собрать A на явных test fixtures: up to 3 lead + 4 lower, те же media не дублируются.
- [x] Добавить local filter/reset/reveal и доступное сообщение количества реально добавленных элементов; не менять URL/history.
- [x] Карточки сохраняют native href как progressive fallback. Имена включают формат/название, image loading/error/retry удерживает размеры.
- [x] Сопоставить темы/адаптивные классы с visual.md; metadata и содержимое shell не переносить в island.
- [x] Только GalleryHeader/GalleryBrowser экспортируются как composition API; внутренние карточки остаются внутренними.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

Red 18 expected failures, initial Green 18/18; после интеграции viewer regression 28/28, включая18 grid cases.

Композиция, filter/reveal/empty, native links и image recovery проверены.

- Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --maxWorkers=1 --no-file-parallelism --config libs/site/content/ui/vite.config.mts src/lib/gallery/media-viewer.spec.tsx src/lib/gallery/gallery-browser.spec.tsx`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Взаимодействия filter/reveal/empty и image errors проверены без сети; композиция соответствует A по source review. Viewer подключается отдельно TS-004.
