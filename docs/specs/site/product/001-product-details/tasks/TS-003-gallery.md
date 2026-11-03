# TS-003 — Галерея photo/scheme

- **Covers:** SC-007–SC-010, SC-016–SC-017, SC-029.
- **Depends on:** TS-001.
- **Status:** implemented, component/source verified.
- **Exact paths:** `libs/site/product/ui/src/lib/gallery/{product-gallery.tsx,product-media.tsx,product-gallery.spec.tsx}`; public `src/index.ts`.
- **Test level:** component.
- **Baseline:** [visual](../design/visual.md), current CDN/onError conventions; без data-access import.

## Work

- [x] Отобразить один/два реальных media; при одном убрать фиктивный rail, при схеме без фото сохранить рабочую схему.
- [x] Независимо обработать failed URL, выбор другого исправного, оба failed/empty и правдивый counter.
- [x] Добавить keyboard selection, pressed state и увеличение внутри stage без модального нового потока.
- [x] Стабильный light media canvas, contain, sizes и LCP preload по установленному Next API; уменьшенные motion preferences.
- [x] Явно удерживать основную колонку/размер при скрытых thumbnails; не повторить no-photo collapse из концепта.
- [x] Проверить роли файлов: selection/failure coordination отдельно от отображения одного image.

## Evidence

P-UI: only-scheme дал behavioral Red; затем общий focused UI run после последнего изменения словаря — exit0,4 files/19 tests, из них gallery6. Проверены selection/zoom, zero/one/both media, independent failures и counter. Галерея и single-media renderer разделены. Theme/responsive/long data проверены source, browser/visual unrun.

Подробности: [implementation evidence](../verification/implementation.md).

## Checkpoint

Все media combinations и отказы корректны, primary image не искажён, keyboard/zoom/fallback не влияют на цену и покупку.
