# Запит для повного архітектурного аудиту

```text
Працюй за `docs/specs/_templates/code-audit/` і виконай фази 00–06.
Feature/SDD: `<точний шлях>`.
Scope: `<projects/libraries/files and dependencies>`.

Порівняй код із applicable Kedr architecture/standards та
`docs/architecture/frontend-inventory.md`. Перевір Nx graph/tags/constraints,
layers, public entry points, aliases/barrels/deep imports, approved data stack,
manual server lifecycle, DTO/domain mapping, UI ownership, source/test
typecheck, executable tests і dead/stale structure.

Створи AF-* для кожної розбіжності та зв'яжи з TS-*/EN-* або RM-*.
Не завершуй delivery зі статусом open, blocked або planned. Для системних
findings використай `docs/specs/_templates/remediation/`.
```

Для diagnostic-only scope не змінюйте implementation. Audit залишається
`blocked`, доки remediation scope не погоджено; це не delivery checkpoint.

# Code audit

```text
$kedr-code-audit

Scope: <feature або paths>.
Phases: <00–01 | 00–06>.
Лише audit; код не виправляй.
```

<!-- Previous verbose examples retained temporarily for safe local reconciliation.
-->
