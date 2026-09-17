# Execution and evidence

Для testable `TS-*` виконай правила
[testing-rules.md](../../../standards/testing-rules.md):

1. отримай очікуваний behavioral Red;
2. реалізуй Green тільки для task responsibility;
3. Refactor у тих самих межах і повтори focused test;
4. запусти affected Regression.

Compilation error, broken fixture або missing dependency спочатку виправляється
як prerequisite; це не Red evidence.

Для `EN-*` виконай одну prerequisite responsibility і запиши причину
test-first exception, replacement check та enabled tasks/scenarios.

Після checkpoint:

- запиши детальне evidence у поточний task-файл;
- онови тільки mapping/status відповідного рядка `traceability.md`;
- познач task status у `tasks/README.md`;
- продовж наступну ready in-scope задачу.

Не додавай incidental refactors, upgrades або інші сценарії.

Для API-змін не створюй handwritten transport DTO, якщо schema вже є в
snapshot. Запусти `npm run contracts:generate`, імпортуй operation/component
type лише в transport або data-access і додай mapper до domain model. Онови
consumer projection у `docs/contracts/<module>/`; YAML snapshot змінюй тільки
через `npm run contracts:sync -- <path-to-KedrStore>`.

Для поточного repository використовуй перевірені entrypoints:

- React Web: `npm run test:web:unit`, `npm run test:web:component`, за потреби
  `npm run test:web:e2e` і `npm run test:web:coverage`;
- React Native: focused `npx nx test <project> --runInBand`, regression
  `npm run test:mobile`, coverage `npm run test:mobile:coverage`;
- test types: `npm run typecheck:tests:web` або `npm run typecheck:tests:mobile`.

Web/RN infrastructure smoke записуй як `EN-*` replacement check. Він не є
Green/Regression evidence для acceptance behavior.
