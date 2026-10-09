# Як створити remediation SDD

```text
Використай `docs/specs/_templates/remediation/`.
Створи SDD у `<destination>` для `<scope>`.
Перевір inventory, graph/tags/constraints, imports/public APIs, approved tools,
DTO boundary, tests і git diff. Створи AF-*/AR-*, as-is inventory, target tree,
dependency matrix, ordered EN-*/RM-*, traceability, readiness і initial audit.
Кожне finding має owner, task, dependencies, exact paths, verification і target
state. Код не реалізовуй до окремого погодження.
```

# Architecture remediation

```text
$kedr-remediation-plan

Findings: <AF-* або path до audit>.
Створи remediation specification. Код не реалізовуй.
```

<!-- Previous verbose examples retained temporarily for safe local reconciliation.
-->
