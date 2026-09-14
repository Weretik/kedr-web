# Delivery rules

Це єдине джерело readiness, traceability та definition of done для frontend
feature. Детальний порядок виконання містить
[AI feature workflow](../specs/_templates/ai-feature-workflow/README.md).

## Specification readiness

Feature готова до реалізації, коли:

- scope і observable outcome погоджені;
- бізнес-правила мають стабільні `R-*` ID;
- acceptance-сценарії мають стабільні `SC-*` ID та Given/When/Then без назв
  компонентів, hooks, stores, бібліотек або файлів;
- відкриті product decisions позначені як blockers, а не вигадані;
- кожен сценарій має risk-based test level або обґрунтоване `n/a`;
- роботу поділено на `TS-*` з однією implementation/verification
  responsibility та `EN-*` для shared prerequisites;
- кожна задача має `Covers` або `Enables`, `Depends on`, точні шляхи, test
  level, `Work`, `Evidence` і `Checkpoint`;
- `traceability.md` пов'язує весь scope без сирітських сценаріїв або задач.

## Traceability

`traceability.md` містить тільки зв'язок `SC → TS/EN → tests → evidence` і
статус. Бізнес-правила живуть у `requirements/`, технічний зміст — у task та
design-файлах, докладні результати — у відповідному task-файлі.

Після прийняття ID стабільні. Не перенумеровуй завершені legacy tasks і не
переписуй історичне evidence без необхідності. Для зміненої старої feature
мігруй лише новий/змінений scope за
[migration guide](../specs/_templates/MIGRATION.md).

## Execution readiness

`TS-*` або `EN-*` готова, якщо її dependencies завершені, responsibility не
перетинається з іншою задачею, paths існують або однозначно заплановані, а
checkpoint можна перевірити доступним tooling. Велика фаза є orchestration
файлом; вона не замінює малі task-файли.

Якщо користувач дозволив усю feature, фазу або набір `SC-*`, AI сам переходить
між усіма готовими task-файлами цього scope. Окрема команда для кожної
підфази не потрібна.

## Definition of done

Scope завершено, коли:

- усі in-scope `SC-*` verified або явно deferred із причиною й owner;
- усі required `TS-*`/`EN-*` пройшли checkpoint;
- для нового testable behavior записано Red → Green → Refactor → Regression;
- contracts, docs і фактична поведінка узгоджені;
- релевантні lint, typecheck/build, tests і ручні platform checks пройшли або
  мають точний blocker;
- для React Web виконані потрібні `test:web`, `typecheck:tests:web`, production
  build і, для критичного journey, `test:web:e2e`;
- для React Native виконані потрібні `test:mobile`, `typecheck:tests:mobile`,
  coverage та доступний export/native compile check; iOS evidence не заявляється
  без macOS/Xcode;
- infrastructure smoke позначено як перевірку harness, а не як evidence
  бізнес-сценарію;
- `traceability.md` посилається на фактичні tests/evidence;
- delivery report містить scope, змінені файли, evidence, невиконані перевірки
  та реальні residual risks.
