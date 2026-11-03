# TS-001 — Полная модель политики

- **Covers:** SC-002, SC-003; data inputs для SC-001, SC-006, SC-007.
- **Depends on:** EN-001.
- **Status:** complete, 2026-11-03.
- **Paths:** libs/site/content/model/src/lib/privacy-types.ts, privacy-policy-copy.ts, privacy-policy-sections.ts, privacy-dictionary.ts, privacy-policy-sections.spec.ts; libs/site/content/model/src/index.ts.
- **Test level:** pure model unit.
- **Architecture baseline:** [data-model](../data-model.md), [source](../design/content-source.md); type:model, explicit bindings, без runtime Angular/config imports.

## Work

- [x] Перенести полный source в typed raw copy с provenance и exact key set.
- [x] Собрать ordered sections/blocks, summary/labels и pure bindings по СДД.
- [x] Проверить обе локали: каждый исходный section text unit и порядок; разрешённые правки отдельно.
- [x] Проверить отличающиеся siteHost/email/phone inputs и отсутствие legacy domain.
- [x] Добавить только публичные exports privacy.
- [x] Проверить роли файлов и локальные зависимости; разделять только смешанные ответственности.

## Evidence

Фактическая команда: node node_modules/vitest/vitest.mjs run --config libs/site/content/model/vite.config.mts src/lib/privacy-policy-sections.spec.ts

Red: exit 1, два ожидаемых failures пустого sections (0 вместо 8), без import/runner ошибок. Green и последняя необходимая model regression: exit 0, 1 spec / 6 tests, 17.92s. Проверены все 34 source units на локаль, 15 paragraphs/11 list items, порядок §2 и два независимых набора bindings.

Raw copy значениями и порядком совпадает с source; Angular/config runtime imports отсутствуют. После Green код модели не менялся. Coordinator добавил только public exports; последующий direct typecheck подтвердил типы. Пять ролей types/copy/mapper/dictionary/spec сохранены.

## Checkpoint

Все 34 section units на локаль и их порядок сохранены после только allowed transformations. Model чистый, тест полноты/подстановок проходит.
