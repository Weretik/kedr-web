# Шаблон Admin feature

Створіть `docs/specs/admin/<domain>/<NNN>-<feature-slug>/` і заповніть
артефакти в порядку `spec.md → plan.md → tasks.md`. Шаблон відокремлює
користувацькі вимоги від технічного рішення та задач реалізації.

```text
<NNN>-<feature-slug>/
├── spec.md                   # user stories, requirements, acceptance criteria
├── plan.md                   # technical context, architecture, real source paths
├── research.md               # рішення для відкритих технічних питань
├── data-model.md             # domain/view models, DTO boundary та інваріанти
├── quickstart.md             # lint, tests, build і ручна перевірка
├── contracts/
│   └── api-contract.md       # endpoint, DTO boundary, access
├── tasks/                    # окремі фази реалізації за user story
└── checklists/
    ├── requirements.md       # повнота та перевірюваність requirements
    └── delivery.md           # готовність delivery
```

Admin feature використовує `libs/admin/<domain>/{model,data-access,ui,feature}`.
`data-access` володіє DTO, mapper та RTK Query hooks; `ui` не викликає API або
router; `feature` збирає page і локальний UI-state. Усі міжбібліотечні імпорти
йдуть через публічний `src/index.ts`.

## Робота з API-контрактом

Якщо feature читає або змінює дані через HTTP, до створення `plan.md`:

1. Прочитайте [frontend-реєстр API-контрактів](../../../contracts/README.md) і
   [правила інтеграції](../../../contracts/integration.md).
2. Звірте точний OpenAPI-контракт у `KedrStore/docs/sdd/contracts/`: method,
   path, security, parameters, response, errors, pagination та idempotency.
3. Для вже описаної операції використайте її сторінку в
   `docs/contracts/<backend-module>/`. Для нової операції додайте там
   frontend-проекцію з source OpenAPI path, consumer, mapping, обмеженнями й
   compatibility notes, канонічним HTTP-запитом і канонічною формою
   JSON-відповіді; додайте посилання в `docs/contracts/README.md`.
4. У feature-local `contracts/api-contract.md` посилайтеся на реєстр і source
   OpenAPI; фіксуйте лише feature-specific рішення.
5. Для неуспішної відповіді використовуйте
   [спільні правила нормалізації помилок](../../../contracts/integration.md#нормалізація-та-обробка-помилок).
   Не парсьте raw HTTP error у feature або UI.

Не копіюйте OpenAPI YAML або transport DTO у feature-документи. Якщо contract
неповний, зафіксуйте blocker у `contracts/api-contract.md` і tasks, а не
вигадуйте endpoint, fields, enum, security або pagination semantics.

`tasks/` групує задачі за user story, а не за шарами. Кожна задача містить
стабільний ID, `[US#]`, за потреби `[P]`, точний шлях і перевірюваний результат.

## Порядок створення документів

1. Створіть [spec.md](spec.md): **що** отримує користувач — user stories,
   requirements, acceptance scenarios, edge cases і success criteria.
2. За наявності невизначеності створіть [research.md](research.md): питання,
   рішення, докази та відхилені альтернативи.
3. Створіть [plan.md](plan.md): **як** feature лягає в поточний Admin-код —
   libraries, public API, межі та точні source paths.
4. Якщо feature працює з даними, додайте [data-model.md](data-model.md) і,
   за потреби, [API contract](contracts/api-contract.md).
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
