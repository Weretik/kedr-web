# TS-004 — Доступный просмотр фото и видео

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-005, SC-006, SC-007, SC-008, SC-009, SC-010, SC-011.
- **Depends on:** TS-001, TS-003, EN-002.
- **Test level:** component / focused interaction.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `libs/site/content/ui/src/lib/gallery/media-viewer.tsx`
- `libs/site/content/ui/src/lib/gallery/video-frame.tsx`
- `libs/site/content/ui/src/lib/gallery/media-viewer.spec.tsx`
- `libs/site/content/ui/src/lib/gallery/gallery-browser.tsx`

## Work

- [x] Подключить Dialog и active media ID к существующей коллекции; photo contain, подписи, реальная позиция и bounded prev/next по всему filtered list.
- [x] Проверить Escape/close/focus return к исходному trigger, focus containment, photo arrows; не перехватывать player keyboard.
- [x] Монтировать фиксированный YouTube iframe только после выбора, autoplay=0; unmount при смене/закрытии, original/reload доступны всегда.
- [x] Проверить image error/retry в viewer и сохранение close/next; не заявлять mock как проверку реального YouTube.
- [x] Provider URL и iframe lifecycle выделить в VideoFrame; source/data-access из UI не импортировать.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

Red 10 expected failures; итог28/28 combined UI cases, из них10 viewer.

Четыре слишком строгих text queries исправлены на contains строки позиции в dialog.textContent, без изменения UI. Focus/keyboard/filtered navigation/image recovery/iframe cleanup проходят.

- Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --maxWorkers=1 --no-file-parallelism --config libs/site/content/ui/vite.config.mts src/lib/gallery/media-viewer.spec.tsx src/lib/gallery/gallery-browser.spec.tsx`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Фото, доступность и video lifecycle проверены управляемыми component fixtures; до взаимодействия iframe отсутствует, после закрытия его нет.
