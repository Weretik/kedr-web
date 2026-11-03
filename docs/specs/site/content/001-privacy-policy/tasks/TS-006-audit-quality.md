# TS-006 — Качество статических проверок после аудита

- **Covers:** AF-001, AF-002; regression SC-001…SC-009.
- **Depends on:** TS-001…TS-005.
- **Status:** complete, verified 2026-11-03.
- **Owner:** frontend privacy feature.
- **Paths:** ui/privacy/privacy-content.spec.tsx, privacy-content.tsx; model/privacy-dictionary.ts, privacy-policy-sections.spec.ts.
- **Test level:** scoped ESLint + test TypeScript + существующий UI component regression.
- **Scope:** типы DOM queries и порядок импортов, без изменения поведения или new split.

## Work

- [x] Зафиксированы исходные 4 TS2345 и 5 import/order diagnostics.
- [x] DOM queries теста заменены семантическими getByRole без casts/ослабления типов.
- [x] Import groups трёх файлов приведены к существующему ESLint правилу.
- [x] Проверены границы и решения keep/split по действующей Site-архитектуре.
- [x] Выполнены scoped static checks и UI regression; сохранены соседние изменения.
- [x] Обновлены [аудит](../code-audit/audit.md), traceability и evidence.

## Evidence и checkpoint

[Before](../code-audit/checks-before.json) / [after](../code-audit/checks-after.json): 19 TS/TSX lint — 0 errors/warnings; UI spec types — 0 errors. Остальные spec группы прошли первоначальную проверку и семантически не изменены. 12 UI cases passed, exit 0. Все AF-001/AF-002 verified; source roles и dependency targets сохранены.

Исправления структурные/type-only: искусственный behavioral Red не нужен по audit phase 06 и правилам проекта. Полный suite/build/browser не запускался.
