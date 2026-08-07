# Шаблон Mobile feature

Створіть `docs/specs/mobile/<domain>/<NNN>-<feature-slug>/` і заповніть
артефакти в порядку `spec.md → plan.md → tasks.md`. Шаблон відокремлює
користувацькі вимоги від технічного рішення та задач реалізації.

```text
<NNN>-<feature-slug>/
├── spec.md                   # user stories, requirements, acceptance criteria
├── plan.md                   # technical context, architecture, real source paths
├── research.md               # рішення для відкритих технічних питань
├── data-model.md             # domain/view models, DTO boundary та інваріанти
├── quickstart.md             # lint, Jest, build/export і device checks
├── contracts/
│   └── api-contract.md       # endpoint, DTO boundary і navigation
├── tasks/                    # окремі фази реалізації за user story
└── checklists/
    ├── requirements.md       # повнота та перевірюваність requirements
    └── delivery.md           # готовність delivery
```

Mobile feature використовує `libs/mobile/<domain>/{model,data-access,ui,feature}`.
Route-файли в `apps/mobile/src/app` лишаються тонкими Expo Router adapters:
вони імпортують public screen із `feature` і не викликають API, storage або
business logic. `@mobile/core/shell` володіє providers, theme, store і shell.

Для server-driven screen плануйте thin `screens/*` adapter, controller hook для RTK Query/debounce/pagination, pure reducer у `feature/src/state/`, а query controls і results/state views — окремими feature components. Не зберігайте effects, query hooks або умовний рендеринг loading/error/list у screen-файлі.

## Робота з API-контрактом

Якщо feature читає або змінює дані через HTTP, до створення `plan.md` виконайте
такі кроки:

1. Прочитайте [frontend-реєстр API-контрактів](../../../contracts/README.md) і
   [правила інтеграції](../../../contracts/integration.md).
2. Знайдіть точний машиночитаний контракт у `KedrStore/docs/sdd/contracts/`
   та перевірте method, path, security, parameters, response, errors і
   pagination semantics.
3. Якщо сторінка операції вже є в `docs/contracts/<backend-module>/`, оновіть
   її лише за потреби. Якщо її немає, додайте туди frontend-проекцію з точним
   source OpenAPI path, consumer, mapping, обмеженнями та compatibility notes;
   обов'язково додайте канонічний HTTP-запит і канонічну форму JSON-відповіді;
   додайте посилання в `docs/contracts/README.md`.
4. У `contracts/api-contract.md` нової feature додайте посилання на сторінку
   реєстру й source OpenAPI, а також лише feature-specific рішення: domain
   mapping, navigation, pagination/reset і відомі обмеження.
5. Не копіюйте OpenAPI YAML і transport DTO у feature-документи. Private DTO,
   serialization та mapping залишаються в `data-access`.
6. Для неуспішної відповіді використовуйте
   [спільні правила нормалізації помилок](../../../contracts/integration.md#нормалізація-та-обробка-помилок).
   Не парсьте raw HTTP error у feature або UI.

Якщо contract відсутній або не визначає потрібну поведінку, зафіксуйте blocker
у `contracts/api-contract.md` і tasks. Не вигадуйте endpoint, fields, enum,
security або pagination semantics.

`tasks/` групує задачі за user story, а не за шарами. Кожна задача містить
стабільний ID, `[US#]`, за потреби `[P]`, точний шлях і перевірюваний результат.

## Порядок створення документів

1. Створіть [spec.md](spec.md): **що** отримує користувач — user stories,
   requirements, acceptance scenarios, edge cases і success criteria.
2. За наявності невизначеності створіть [research.md](research.md): питання,
   рішення, докази та відхилені альтернативи.
3. Створіть [plan.md](plan.md): **як** feature лягає в поточний Mobile-код —
   Expo Router route, libraries, public API, межі та точні source paths.
4. Якщо feature працює з даними, додайте [data-model.md](data-model.md) і,
   за потреби, [API та navigation contract](contracts/api-contract.md).
5. Заповніть [requirements checklist](checklists/requirements.md) до коду.
6. Створіть фази в [tasks/](tasks/): спочатку plan gate і foundation, потім
   кожна user story окремою independently testable поставкою.
7. Після реалізації заповніть [quickstart.md](quickstart.md), результати фаз
   і [delivery checklist](checklists/delivery.md).

## Зв'язок артефактів

```text
spec.md ──► research.md (за потреби) ──► plan.md
   │                                      │
   ├──► data-model.md / contracts/ ◄──────┤
   │                                      ▼
   └──────────────────────────────► tasks/ ──► quickstart.md ──► delivery checklist
```
