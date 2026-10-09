---
name: kedr-remediation-plan
description: 'Use when systemic Kedr architecture findings span multiple files, libraries, features, or boundaries and require a separate remediation specification.'
---

# Kedr Remediation Plan

Перетвори підтверджені systemic findings на окремий, dependency-ordered remediation SDD. Не реалізуй план у цьому skill.

## Workflow

1. Прочитай source audit, кореневий `AGENTS.md`, frontend inventory, affected architecture docs і standards.
2. Прочитай `docs/specs/_templates/remediation/README.md`; використовуй canonical remediation templates без локальних дублікатів.
3. Підтвердь root cause та affected boundaries на коді. Відокрем symptoms від systemic cause і зафіксуй current та target structure.
4. Створи remediation spec у доречному architecture scope під `docs/specs/`. Збережи traceability між `AF-*`, architecture requirements `AR-*`, enablement `EN-*` і remediation tasks `RM-*`.
5. Для кожного task вкажи exact source/target paths, dependencies, migration order, compatibility constraints, verification і rollback considerations.
6. Перевір readiness checklist, unresolved decisions і ownership. Запроси окреме погодження до implementation.

## Guardrails

- Не створюй remediation spec для локального one-file fix без systemic impact.
- Не приховуй breaking changes усередині refactor wording.
- Не закривай source findings самим фактом створення плану.
- Не змінюй runtime code або generated artifacts у planning scope.

## Example

`Use $kedr-remediation-plan to turn AF-07 and AF-09 into a dependency-ordered Mobile architecture remediation specification.`
