# TS-001 — Модель, словарь и чистые операции галереи

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-001, SC-002, SC-003, SC-010, SC-013.
- **Depends on:** нет.
- **Test level:** unit.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `libs/site/content/model/src/lib/gallery/gallery-types.ts`
- `libs/site/content/model/src/lib/gallery/gallery-dictionary.ts`
- `libs/site/content/model/src/lib/gallery/gallery-filter.ts`
- `libs/site/content/model/src/lib/gallery/gallery.spec.ts`
- `libs/site/content/model/src/index.ts`

## Work

- [x] Добавить типы photo/video, UI copy UK/RU и pure filtering/portion helpers по data-model.md.
- [x] Проверить сохранение порядка/ID, all/photo/video, начальный объём 7, прибавление до 4 и reset; словарь полный в обеих локалях.
- [x] Экспортировать только public presentation API; source/React/browser state сюда не включать.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

13 unit cases; Red 12 failed/1 passed, Green 13/13.

Фильтрация, порядок, порции7/4 и serializable UK/RU dictionary.

- Команда: `node node_modules/vitest/vitest.mjs run --config libs/site/content/model/vite.config.mts src/lib/gallery/gallery.spec.ts`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Чистая модель и оба словаря проверены; стабильные ID/порядок не зависят от фильтра. UI/data source ещё не требуются.
