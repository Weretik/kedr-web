# Scenario-first frontend SDD templates

Цей каталог містить канонічну структуру нової frontend feature та workflow для
її виконання. Стабільні правила залишаються у
[standards](../../standards/README.md).

## Як створити специфікацію

1. Створи `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/` зі спільних
   файлів `feature/`, не переносячи `USAGE.md` і каталог `variants/`.
2. Обери один варіант усередині `feature/variants/`:
   [React](feature/variants/react/README.md),
   [React Native](feature/variants/react-native/README.md) або
   [Angular](feature/variants/angular/README.md).
3. Не копіюй `USAGE.md`: це інструкції користувачу.
4. Заповни scope, `R-*` і observable Given/When/Then `SC-*`.
5. Залиши тільки змістовні optional design/contract документи.
6. Визнач фактичні Nx projects, targets, test files і tooling з репозиторію.
7. Створи малі `TS-*`/ `EN-*` task-файли з generic templates; phase-файли
   використовуй тільки для orchestration.
8. Заповни `traceability.md` і base/variant readiness checklists. Не починай
   реалізацію коду під час підготовки специфікації.

Якщо користувач не вказав тип застосунку, AI до створення файлів має поставити
одне питання: `React, React Native чи Angular?`. Не визначай варіант лише за
назвою feature.

```text
<NNN>-<feature-slug>/
├── README.md
├── requirements/
│   ├── overview.md
│   └── behavior.md
├── design/frontend.md
├── contracts/api-contract.md
├── traceability.md
├── tasks/
│   ├── README.md
│   ├── 00-readiness.md
│   ├── 01-shared-behavior.md
│   ├── 02-state-and-data.md
│   ├── 03-react-web-ui.md
│   ├── 04-react-native-ui.md
│   ├── 05-angular-ui.md
│   ├── 06-navigation-and-platform.md
│   ├── 07-api-integration.md
│   ├── 08-verification.md
│   └── <area>/TS-NNN-<slug>.md або enablers/EN-NNN-<slug>.md
└── checklist/
    ├── spec-readiness.md
    └── delivery-readiness.md
```

Додай файли вибраного variant у відповідні `design/`, `checklist/`,
`research/` та `verification/` каталоги створеної feature. Залиши лише одну
UI-фазу: React, React Native або Angular. Фази не задають порядок реалізації:
порядок визначають `Depends on` та scenario scope.

Запити для створення всіх трьох варіантів є у
[feature/USAGE.md](feature/USAGE.md). Прийняту специфікацію виконуй за
[AI feature workflow](ai-feature-workflow/README.md).

Існуючі специфікації оновлюй за
[incremental migration guide](MIGRATION.md). Не перенумеровуй завершені задачі
й не переписуй історичне evidence без необхідності.
