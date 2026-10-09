---
name: kedr-pr-handoff
description: 'Use when completed Kedr Web work needs a review-ready branch name, PR title, description, test evidence, and residual-risk handoff.'
---

# Kedr PR Handoff

Підготуй точний review-ready handoff. Не створюй, не push і не merge PR без прямого запиту користувача.

## Workflow

1. Переглянь `git status`, scoped diff, diff stat і recent log. Відокрем зміни завдання від pre-existing та unrelated worktree changes.
2. Прочитай in-scope SDD artifacts, audit status і verification evidence. Якщо свіже evidence відсутнє, спочатку застосуй `$kedr-change-verification`.
3. Переконайся, що completion gates не мають прихованих blockers: unresolved clarifications, open in-scope `AF-*`, incomplete tasks або unverified generated output.
4. Запропонуй branch name з префіксом `codex/`, стислий imperative PR title і description з секціями Summary, Scope, Verification, Documentation та Residual risks.
5. Наведи exact commands і результати; не перетворюй warnings або skipped checks на passing evidence.
6. Переліч reviewers' focus areas, migration/rollback notes та сторонні зміни, які не належать PR.

## Guardrails

- Не включай секрети, локальні абсолютні шляхи або неперевірені claims у PR description.
- Не заявляй clean diff, якщо worktree містить невраховані зміни.
- Використовуй GitHub integration лише коли користувач явно просить створити або оновити PR.

## Example

`Use $kedr-pr-handoff to prepare a review-ready handoff for the completed Admin refund work.`
