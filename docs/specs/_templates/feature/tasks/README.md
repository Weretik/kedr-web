# <Назва feature> — task graph

Phase-файли нижче тільки групують і впорядковують малі задачі. Реалізація
відбувається за `Depends on` у task-файлах і не вимагає завершення всього
технічного шару.

## Identifiers

- `TS-*` — одна implementation або verification responsibility;
- `EN-*` — один shared prerequisite чи technical enabler.

Створи окремий файл із [TS template](TS-NNN-task.template.md) або
[EN template](enablers/EN-NNN-enabler.template.md). Не додавай checklist steps
інших responsibilities до того самого task-файлу.

Останнім пунктом `Work` у кожному `TS-*` та `EN-*` залишай перевірку змінених
implementation-файлів на цілісність відповідальності. Якщо файл поєднує кілька
незалежних відповідальностей або став завеликим для зрозумілої підтримки й
тестування, задача має розділити його за чинними архітектурними межами. Малий
цілісний файл не діли лише через кількість рядків.

## Planning phases

- [00 — Readiness](00-readiness.md)
- [01 — Shared behavior](01-shared-behavior.md)
- [02 — State and data fetching](02-state-and-data.md)
- [03 — React Web UI](03-react-web-ui.md)
- [04 — React Native UI](04-react-native-ui.md)
- [05 — Angular UI](05-angular-ui.md)
- [06 — Navigation and platform](06-navigation-and-platform.md)
- [07 — API integration](07-api-integration.md)
- [08 — Verification](08-verification.md)

Залиши UI-фазу тільки обраного application variant. Для великої фази створи
підфази/задачі, кожна з однією відповідальністю.

## Task index

| ID     | Responsibility       | Covers/enables | Depends on | File                                 | Status  |
| ------ | -------------------- | -------------- | ---------- | ------------------------------------ | ------- |
| TS-001 | <one responsibility> | SC-001         | EN-001     | [task](<area>/TS-001-<slug>.md)      | planned |
| EN-001 | <one prerequisite>   | SC-001         | none       | [enabler](enablers/EN-001-<slug>.md) | planned |
