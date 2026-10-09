---
name: kedr-feature-delivery
description: 'Use when implementing or continuing an accepted Kedr Web feature specification at whole-feature, phase, scenario, task, or enablement scope.'
---

# Kedr Feature Delivery

Реалізуй лише погоджений scope scenario-first SDD і підтримуй evidence синхронним із кодом.

## Workflow

1. Прочитай кореневий `AGENTS.md`, усі artifacts обраної feature, `docs/specs/_templates/ai-feature-workflow/README.md` та workflow-файли `01`–`04`.
2. Прочитай frontend inventory, client architecture, standards і всі вкладені `AGENTS.md`, що діють для змінюваних файлів.
3. Зафіксуй authorized scope: whole feature, phase, `SC-*`, `TS-*` або `EN-*`. Не розширюй його без явної потреби й погодження.
4. Перед task selection виконай обов'язкові baseline audit phases `00`–`01`. Вибирай лише dependency-ready tasks. Architecture findings записуй як `AF-*`; системні порушення маршрутизуй у remediation plan.
5. Для кожного behavior change виконай Red → Green → Refactor → Regression відповідно до `docs/standards/testing-rules.md`. Не встановлюй відсутній tooling без погодженого `EN-*`.
6. Після кожного task онови status, traceability та exact evidence у feature artifacts. Не позначай task завершеним без команди, результату або явного blocker.
7. Після останньої implementation-зміни виконай релевантну verification і повний code audit phases `00`–`06`. Open, blocked або planned in-scope findings блокують delivery completion.

## Guardrails

- Не реалізуй незатверджені requirements і не обходь readiness gates.
- Не редагуй OpenAPI snapshot або generated TypeScript вручну.
- Не коміть, не push і не створюй PR без прямого запиту.
- Відокремлюй свої зміни від уже наявних user changes.

## Example

`Use $kedr-feature-delivery to implement SC-03 from the accepted Mobile checkout specification.`
