# TS-001 — Модель представления и payload

- **Status:** verified 2026-11-03; model boundary.
- **Covers:** SC-002, SC-003, SC-006, SC-007.
- **Depends on:** нет; фактическая интеграция данных позднее зависит от EN-001.
- **Точные пути:** `libs/site/content/model/src/lib/requisites-types.ts`, `requisites-dictionary.ts`, `requisites-copy.ts`, `requisites-copy.spec.ts` в том же lib; `libs/site/content/model/src/index.ts`.
- **Test level:** unit.
- **Baseline:** существующий site-content-model, type:model, public API; [data model](../data-model.md).

## Work

- [x] Описать readonly details/dictionary/copy-labels contracts, не импортируя config или browser state.
- [x] Создать полный UK/RU интерфейсный словарь по visual contract; официальные значения не копировать в dictionary.
- [x] Реализовать pure formatter шести строк с LF и исходным IBAN; визуальные переносы не входят в данные.
- [x] Добавить unit assertions обеих локалей, порядка полей и сохранения всех символов.
- [x] Test fixtures явно относятся к тесту, не создают production config и не закрывают EN-001.
- [x] Дополнить public exports; проверить одну ответственность каждого файла без искусственного дробления.

## Evidence

Выполнено P1, public model API интегрирован координатором.

- Команда: `npx nx run site-content-model:vite:test -- --run src/lib/requisites-copy.spec.ts`.
- Valid Red: exit 1, 2 failed / 3 passed — отсутствовал символ № перед номером выписки в UK/RU payload; harness работал.
- Green / финальная regression: exit 0, 1 file / 5 tests passed, Nx cache 0/1.
- Проверены порядок шести строк, LF без trailing newline, сохранение регистра/пробелов/пунктуации/ведущих нулей, отсутствие мутации, исключение контакта и переданная подпись кода.
- Prettier перед Green; роли contracts/dictionary/formatter/spec разделены. Scoped ESLint новых model/SEO/config файлов и public indexes: exit 0.
- Production-значения не дублируются в словаре; EN-001 позже закрыт отдельным ответом владельца.

## Checkpoint

Контракты экспортированы, оба словаря полны, formatter сохраняет имя/коды и формирует согласованный payload. Unit evidence записано; production-факты ещё не считаются подтверждёнными.
