# TS-002 — Компактный вариант существующих карточек каталога

- **Status:** completed 2026-11-03 (automated/source scope).
- **Covers:** SC-003, SC-004, SC-009, SC-010.
- **Depends on:** none.
- **Paths:** `libs/site/catalog/ui/src/lib/category-cards/category-cards.tsx`; `libs/site/catalog/ui/src/lib/category-cards/category-cards.spec.tsx`.
- **Test level:** Component; default regression отдельного общего потребителя.
- **Architecture baseline:** Публичный CategoryCards уже строит правильные localized href и использует внутреннюю CATEGORY_IMAGES; владелец остаётся catalog/ui.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Добавить optional variant='default'|'compact', default не меняется. Compact: фото/имя/стрелка, 2 колонки на телефоне и 3 от lg, без счётчиков и subcategory links.
- [x] Сохранить реальный slug/locale и внутреннюю image mapping; object-contain/sizes соответствуют компактной сетке, priority не включать для всех фото.
- [x] Проверить UK/RU href, category title, actual photo path, нейтральный значок без фото и отсутствие secondary data в compact; default сохраняет counts/children и layout.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. Команда с NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_NO_CLOUD=true:
npx nx run site-catalog-ui:vite:test -- --run src/lib/category-cards/category-cards.spec.tsx.

Red: exit1, 2 compact behavioral failures / 1 existing default passed: compact accessible name ещё содержал счётчик. Green и финальная узкая regression: exit0, 3/3, uncached. UK/RU encoded href, actual image/fallback, отсутствие secondary data и default counts/children проверены.

Root source-review выявил возможное clipping focus внутри overflow-hidden: агент перенёс outline offset в -2px и сохранил default; compact fallback stroke1.75, default1.5. Это presentation-only уточнение не меняет выводы трёх функциональных тестов, повтор не потребовался. Интеграционные14 page tests затем прошли на финальном компоненте. Отдельный helper/export не создан, ответственность CategoryCards сохранена.

## Checkpoint

Compact соответствует v2, default catalog hub не меняет наблюдаемое поведение.
