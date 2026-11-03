# TS-001 — Модель представления и полный copy UK/RU

- **Status:** completed 2026-11-03 (automated/source scope).
- **Enables:** SC-001, SC-002, SC-005, SC-006, SC-007, SC-008, SC-009, SC-010, SC-012.
- **Depends on:** none.
- **Paths:** `libs/site/content/model/src/lib/wholesale-types.ts`; `libs/site/content/model/src/lib/wholesale-dictionary.ts`; `libs/site/content/model/src/index.ts`.
- **Test level:** Source/types; наблюдаемый copy подтверждается TS-003/TS-005, отдельные зеркальные string-тесты не нужны.
- **Architecture baseline:** Существующий content/model owns typed copy; не импортирует UI, catalog и API types.
- **Rules:** [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [file-role map](../design/frontend.md).

## Work

- [x] Добавить компактные dictionary/details types и getter по Locale согласно data-model.md.
- [x] Перенести полный принятый текст из design/content.md, включая fallback, FAQ и labels двух языков; убрать фактические телефон/город/ссылки из словаря в пользу COMPANY projection feature.
- [x] Не публиковать wholesale conditions, brand claims, статистику или неподтверждённые promises; сохранить existing model exports.
- [x] Проверить целостность ответственности изменённых файлов; при смешении независимых ролей разделить по существующим границам, записать решение и повторить затронутую проверку. Полный аудит не добавляется автоматически.

## Evidence

2026-11-03, completed. Добавлены WholesaleDictionary, WholesaleCompanyDetails, getWholesaleDictionary и append-only public exports. Оба языка сравнили с accepted copy. Фактические телефон/город/links поступают через props из feature, не продублированы в словаре.

Наблюдаемое copy/props evidence: TS-003 — 8/8 component tests; TS-005 — 18/18 server/sitemap tests. site:typecheck exit 0 подтверждает интегрированные production types. Отдельных зеркальных string-тестов не создавали. Structure: model не импортирует UI/catalog/transport.

## Checkpoint

Оба словаря полны, props/types не несут catalog DTO/React state, фактические контакты не продублированы.
