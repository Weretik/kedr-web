# TS-008 — Архитектурный аудит и локальная декомпозиция

- **Status:** verified 2026-11-03.
- **Covers:** SC-004, SC-005, SC-011, href-часть SC-012; AF-001.
- **Depends on:** TS-007; EN-002 остаётся независимым publication gate.
- **Точные пути:** `libs/site/content/ui/src/lib/requisites/requisites-support.tsx`; новые `requisites-legal-links.tsx` и `requisites-contact-card.tsx` в той же директории; `docs/specs/site/content/001-requisites/code-audit/audit.md`; карточка/карта/traceability этой функции.
- **Test level:** existing component/server regression, fresh source/test types, static boundary checks.
- **Scope:** отдельный прямой запрос пользователя на аудит и исправления после внедрения; бизнес-сценарии и дизайн не меняются.

## Work

- [x] Провести scoped phases 00–06 по frontend-code-audit и правилам Site.
- [x] Подтвердить AF-001: смешанные legal/contact обязанности Support.
- [x] Вынести два server leaf с узкими props; Support оставить layout owner, public API не менять.
- [x] Сохранить DOM/aria/href/classes и исходные данные; не извлекать лишний hook или primitive.
- [x] Проверить source/test types с реальными options и explicit roots.
- [x] Проверить actual import edges и negative boundary cases.
- [x] Выполнить focused UI/server regression и lint.
- [x] Обновить audit, actual tree, SDD и traceability; сохранить соседние изменения.

## Evidence

[Отчёт AF-001](../code-audit/audit.md) содержит baseline, правила, split/keep и команды.

- Structural Red n/a: API и поведение сохраняются; существующие tests защищают перенос.
- UI target с skip-nx-cache: exit 0, 2 files / 18 tests.
- Feature target с skip-nx-cache: exit 0, 1 file / 5 tests.
- Fresh Compiler API: route/source 2 roots и test 7 roots, 0 diagnostics в обеих группах; no emit, options не ослаблялись.
- AST/validator: 17 production files, 16 positive project edges, 4 rejected negative cases, 0 scoped cycles.
- Scoped ESLint и Prettier трёх runtime файлов: exit 0.
- Model/SEO/sitemap runtime не повторялись без изменений; новая regression — 23 tests, не 43 заново.

## Checkpoint

AF-001 verified; два server block имеют самостоятельные props и ownership, Support отвечает только за раскладку/композицию. API/дизайн/данные сохранены, fresh focused evidence записан. EN-002 остаётся условием публикации и не маскируется архитектурным pass.
