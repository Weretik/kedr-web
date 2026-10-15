# SDD process for Storefront Angular

Storefront у цьому репозиторії є Angular SSR застосунком, а не React. Створюй
нову feature у `docs/specs/storefront/<domain>/<NNN>-<feature-slug>/` за [правилами постачання](../../standards/shared/delivery-rules.md). У design застосовуй Angular-specific рішення з [архітектури Storefront](README.md).

У design зафіксуй Angular/SSR, locale, route, state/API та browser risks.
Для `libs/storefront/data-access` діє focused Vitest harness:
`npm run test:storefront` і `npm run typecheck:tests:storefront`.
Три наявні spec-файли перевіряють контракти й mapper-и; це не означає повного
покриття Storefront. Для поведінки поза цим harness додай відповідний тест
або окремий `EN-*` для розширення test setup. Lint/build не замінюють
behavioral tests.

Застосовуй [testing rules](../../standards/shared/testing-rules.md) і
[delivery rules](../../standards/shared/delivery-rules.md).
