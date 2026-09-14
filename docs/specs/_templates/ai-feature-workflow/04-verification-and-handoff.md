# Verification and handoff

## Verification

1. Перевір checkpoint кожної in-scope задачі.
2. Запусти affected tests та Nx lint/typecheck/build/export targets за
   [testing rules](../../../standards/testing-rules.md).
3. Для завершеного `SC-*` перевір acceptance evidence й постав `verified` у
   `traceability.md`.
4. Для full-feature scope виконай delivery checklist.
5. Переглянь git diff і переконайся, що сторонні зміни збережено.

Platform baseline для delivery:

- React Web: `npm run typecheck:tests:web`, `npm run test:web`, relevant lint і
  production build; `npm run test:web:e2e` для критичного browser journey;
- React Native: `npm run typecheck:tests:mobile`, `npm run test:mobile`, relevant
  lint і export/native compile check; mobile E2E лише за наявності configured target;
- coverage запускай окремою командою і посилайся на фактичний report path.

Не позначай iOS, Android або mobile E2E як passed, якщо відповідний SDK/runner
у середовищі відсутній.

Failure записуй із точною командою, failing test/step, ключовою причиною,
походженням failure та наступним кроком.

## Stop conditions

Зупинись, коли дозволений scope завершений або є конкретний blocker: невідоме
product decision, незакрита зовнішня залежність, недоступне середовище чи дія
поза дозволеним scope. Не зупиняйся лише через перехід між файлами або фазами.

## Handoff

Повідом:

- завершені `SC-*`, `TS-*`, `EN-*`;
- delivered observable behavior;
- змінені файли;
- Red/Green/Refactor/Regression або `EN-*` replacement evidence;
- невиконані перевірки та точні blockers;
- реальні residual risks.
