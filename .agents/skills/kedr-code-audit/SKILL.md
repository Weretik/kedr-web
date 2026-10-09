---
name: kedr-code-audit
description: 'Use when performing a Kedr Web architecture and code audit, or when feature delivery requires its baseline or final audit phases.'
---

# Kedr Code Audit

Проводь evidence-based audit без реалізації виправлень, якщо користувач окремо не попросив їх внести.

## Workflow

1. Визнач scope і прочитай кореневий `AGENTS.md`, frontend inventory, client architecture, applicable standards та feature specification.
2. Прочитай `docs/specs/_templates/code-audit/README.md`. Виконай потрібні phases `00`–`06`; для delivery baseline обов'язкові `00`–`01`, після implementation — повний audit.
3. Перевір boundaries, dependency direction, public APIs, state ownership, data access, contract usage, error handling, tests і docs на фактичному коді та конфігурації.
4. Створи або онови feature-local `code-audit/audit.md`. Кожен finding має стабільний `AF-*`, severity, status, exact path, evidence, impact, owner, target location, task, dependencies і verification command.
5. Класифікуй finding як feature-local або systemic. Systemic findings, що охоплюють кілька feature/lib boundaries, маршрутизуй через `$kedr-remediation-plan`.
6. Підсумуй findings за severity та status. Open, blocked або planned in-scope findings явно познач як delivery blockers.

## Guardrails

- Не роби висновок лише з назв файлів; перевір implementation і project configuration.
- Не занижуй severity через відсутність готового fix.
- Не закривай `AF-*` без нового evidence.
- Не змінюй runtime code під час audit-only запиту.

## Example

`Use $kedr-code-audit to run phases 00–06 for the Admin catalog feature and record actionable findings.`
