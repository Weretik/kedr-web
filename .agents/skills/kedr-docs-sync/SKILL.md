---
name: kedr-docs-sync
description: 'Use when checking or repairing drift between Kedr Web code and versioned architecture, standards, contracts, inventory, or feature documentation.'
---

# Kedr Documentation Sync

Знайди й усунь лише підтверджений drift між repository truth та versioned documentation.

## Workflow

1. Визнач scope через `git status`, scoped diff і запит користувача. Прочитай кореневий `AGENTS.md` та relevant docs indexes.
2. Встанови canonical source для кожного твердження: `project.json` і Nx metadata для targets, package/config files для tooling, source public APIs для boundaries, OpenAPI snapshot для operations, feature artifacts для accepted behavior.
3. Порівняй canonical source з `docs/architecture/`, `docs/standards/`, `docs/contracts/` і relevant `docs/specs/`. Класифікуй drift як stale, missing, contradictory або historical-only.
4. Якщо запит лише на audit, надай findings з exact paths і proposed correction без edits. Якщо requested scope включає repair, внеси мінімальні зміни в canonical docs і виправ усі залежні посилання.
5. Не редагуй generated artifacts вручну. Для contract drift маршрутизуй regeneration через `$kedr-api-contract-sync`.
6. Запусти `npm run docs:check` і `npm run docs:format:check`, а для structural boundary docs також relevant architecture checks. Повідом exact results.

## Guardrails

- Не переписуй historical evidence, completed task records або stable IDs лише для стилістичної уніфікації.
- Не документуй плановану поведінку як уже реалізовану.
- Не роби широкого rewrite, коли drift виправляється локально.
- Зберігай сторонні user changes.

## Example

`Use $kedr-docs-sync to compare the current Nx targets with the frontend inventory and repair confirmed drift.`
