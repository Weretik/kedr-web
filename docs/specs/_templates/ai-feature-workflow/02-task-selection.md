# Ready task selection

Задача ready, коли:

- `Covers` або `Enables` входить у дозволений scope;
- усі `Depends on` завершені або також готові в дозволеному scope;
- responsibility одна й не дублюється;
- exact paths і test level конкретні;
- checkpoint можна перевірити наявним tooling або documented replacement check.

Обирай dependency-ready `EN-*`, потім найменший `TS-*`, що дає поведінковий
результат. Технічні області не задають обов'язковий waterfall: shared behavior,
state/data, UI, navigation/platform, API і verification можуть чергуватися за
залежностями сценарію.

Якщо дозволено `SC-*`, виконай усі required `TS-*` та `EN-*` з його рядка
traceability. Якщо дозволена фаза чи вся feature, після checkpoint одразу
переходь до наступної ready in-scope задачі.
