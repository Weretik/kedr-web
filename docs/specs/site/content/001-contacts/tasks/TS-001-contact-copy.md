# TS-001 — Контракт представления и локализованный copy

- **Status:** completed 2026-11-03 (focused automated/source scope).
- **Enables:** SC-001…SC-010.
- **Depends on:** none.
- **Paths:** `libs/site/content/model/src/lib/contacts-types.ts`, `libs/site/content/model/src/lib/contacts-dictionary.ts`, `libs/site/content/model/src/index.ts`.
- **Test level:** source/type contract verification; observable copy проверяется component tests в TS-003/TS-005.
- **Architecture baseline:** existing `site-content-model`, type:model; public `@site/content/model`; [frontend design](../design/frontend.md).

## Work

- [x] Описать ContactsDictionary и минимальный ContactsDetails без JSX, API DTO и browser state.
- [x] Добавить полный UK/RU copy из [visual design](../design/visual.md), включая доступные имена и clipboard feedback.
- [x] Добавить getter и публичные exports, сохранив returns exports.
- [x] Не дублировать COMPANY и SEO metadata в словаре; отсутствующие адрес/часы не заполнять.
- [x] Проверить целостность ролей изменённых файлов; разделять независимые ответственности, не создавать новый Nx-проект.

## Evidence

Полный ContactsDictionary и ContactsDetails добавлены в существующий model; COMPANY не дублируется. Оба model exports сохранены. Поведение словаря проверено 11 UI component tests в TS-003 и 4 server composition tests в TS-005; site:typecheck прошёл (exit 0).

Отдельный словарный snapshot не создавался. Red-first для typed fixture подготовки — n/a; meaningful behavioral Red/Green получены у потребителей. Локальная проверка структуры: два чистых model-файла, без JSX/browser state и новой библиотеки.

## Checkpoint

Обе локали полны и типизированы; факты компании не скопированы; existing model exports сохранены. На этой контрольной точке UI и SEO не объявляются готовыми.

## Последующий архитектурный аудит

AF-003: удалён устаревший model lint inputs override, inferred target учитывает eslint.config.cjs, ^default и tools/eslint-rules. AF-006: порядок type imports соответствует import/order. Fresh model lint uncached exit 0. [Отчёт](../code-audit/audit.md).
