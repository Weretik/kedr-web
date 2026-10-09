---
name: kedr-change-verification
description: 'Use when runtime code, tests, examples, API contracts, documentation, or build and test configuration changed and completion needs fresh evidence.'
---

# Kedr Change Verification

Підбери найменший risk-adequate набір перевірок і надай свіже evidence перед заявою про completion.

## Workflow

1. Переглянь `git status`, scoped diff і diff stat. Відокрем зміни поточного завдання від сторонніх змін; не приписуй собі весь dirty worktree.
2. Визнач affected projects за `project.json`, import graph і `npx nx show project <name>`. Прочитай `docs/standards/testing-rules.md` та relevant client rules.
3. Запусти найвужчі релевантні checks, потім потрібний regression level. За потреби використовуй repository scripts:
   - Admin: `npm run test:web`, `npm run typecheck:tests:web`.
   - Mobile: `npm run test:mobile`, `npm run typecheck:tests:mobile`.
   - Storefront: `npm run test:storefront`, `npm run typecheck:tests:storefront`.
   - All test types: `npm run typecheck:tests`.
   - Contracts: `npm run contracts:lint`, `npm run contracts:generate`, `npm run contracts:check`.
   - Architecture: `npm run architecture:boundaries`, `npm run architecture:boundaries:fixtures`.
   - Docs: `npm run docs:check`, `npm run docs:format:check`.
4. Для changed behavior перевір Red → Green → Refactor → Regression evidence. Для generated artifacts перевір, що regeneration не залишає неочікуваного diff.
5. Повідом exact commands, exit codes, кількість tests за наявності та всі skipped або unavailable checks. Не називай роботу passing, якщо потрібна перевірка не виконана.

## Guardrails

- Не запускай unrelated full-suite лише заради видимості повноти; масштабуй перевірки за ризиком.
- Не виправляй сторонні failures без окремого scope; локалізуй і чітко опиши їх.
- Не приховуй platform limitations, flaky results або warnings.

## Example

`Use $kedr-change-verification to verify the current Storefront checkout changes and report exact evidence.`
