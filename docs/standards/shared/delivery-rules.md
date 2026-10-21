# Delivery rules

Це джерело readiness, traceability та definition of done для frontend
feature. Порядок виконання визначають граф задач, evidence конкретної feature
та [правила тестування](testing-rules.md).

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
- architecture baseline порівнює фактичні Nx projects/tags/constraints,
  dependency graph, aliases/public APIs, approved data stack і test targets із
  applicable rules; кожна розбіжність має `AF-*` та prerequisite `EN-*`/`RM-*`.
- `design/frontend.md` містить компактну заплановану карту ключових файлів і
  каталогів фічі: точні шляхи, одну роль кожного, стан `наявний` чи
  `запланований` і рішення щодо поділу зачеплених перевантажених файлів за
  [правилами організації Admin](../admin/admin-code-organization.md), якщо це Admin-фіча.

## Traceability

`traceability.md` містить тільки зв'язок `SC → TS/EN → tests → evidence` і
статус. Бізнес-правила живуть у `requirements/`, технічний зміст — у task та
design-файлах, докладні результати — у відповідному task-файлі.

Після прийняття ID стабільні. Не перенумеровуй завершені legacy tasks і не
переписуй історичне evidence без необхідності. Для зміненої старої feature
мігруй лише новий/змінений scope, зберігаючи завершені ID, task-файли
та історичне evidence.

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
- нова реалізована фіча має коротку архітектурну сторінку з Mermaid-схемою зв'язків, деревом фактичних каталогів і основних файлів із поясненням ролей та запис у [каталозі фіч](../../features/README.md); істотна зміна маршруту, стану, API або меж модулів оновлює відповідну сторінку, схему, дерево та індекс;
- мінімальні перевірки змінених частин за [правилами обсягу](testing-rules.md#обсяг-перевірок-під-час-реалізації)
  пройшли або мають точну перешкоду; повний прогін проєкту, coverage, production
  build, E2E та повний аудит виконують лише за прямим запитом користувача;
- infrastructure smoke позначено як перевірку harness, а не як evidence
  бізнес-сценарію;
- `traceability.md` посилається на фактичні tests/evidence;
- delivery report містить scope, змінені файли, evidence, невиконані перевірки
  та реальні residual risks.
- зачеплені архітектурні межі переглянуто після останньої implementation-зміни;
  повний code audit проводять лише за прямим запитом користувача, а підтверджені
  in-scope `AF-*` мають статус `verified` або явно описану перешкоду.
- нові й змінені файли фічі переглянуто за відповідальностями: самостійні
  форми, таблиці, діалоги, стан, запити й мапінг мають відповідних власників;
  заплановану карту звірено з фактичним деревом на сторінці фічі. Розмір файла
  сам собою не вимагає поділу.

`open`, `blocked` або `planned` architecture finding блокує delivery. Статус
`deferred-approved` допустимий лише з явним погодженням, owner, окремою SDD/task
і доказом, що finding не є prerequisite поточного dependency chain. `fixed` до
final regression не є завершеним статусом.
