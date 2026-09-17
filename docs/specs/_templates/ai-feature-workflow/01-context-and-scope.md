# Context and authorized scope

## Resolve scope

Використовуй найширший scope, який явно дозволив користувач: повна feature,
фаза, перелік `SC-*` або `TS-*`/`EN-*`. Не звужуй feature-level дозвіл до
одного файла й не розширюй named-task scope.

## Read before changes

1. Знайди всі applicable `AGENTS.md` від repository root до paths змін.
2. Прочитай feature `README.md`, `requirements/`, `traceability.md`,
   `tasks/README.md`, in-scope task-файли та релевантні design/contracts.
3. Прочитай applicable architecture/standards, особливо
   `testing-rules.md` і `delivery-rules.md`.
4. Перевір package manager, Nx projects/targets, installed dependencies,
   configs і наявні tests без припущень про tooling.
5. Перевір git diff і збережи сторонні зміни.
6. Для API scope знайди operation у `docs/contracts/openapi/openapi.yaml`,
   consumer projection у `docs/contracts/` і generated type у
   `@shared/api-contracts`. Якщо operation відсутня, спочатку синхронізуй
   versioned snapshot із чистого backend checkout через CLI.
7. Для React Web перевір `admin:vite:test` і `admin-e2e:e2e`; для React Native
   перевір фактичні Jest targets через `npx nx show projects --with-target test`.
   Відсутній mobile E2E оформлюй як `EN-*`, не встановлюй важкий runner автоматично.

Невідоме бізнес-правило познач
`[NEEDS CLARIFICATION: <конкретне питання>]`; не вигадуй поведінку, API fields,
permissions або platform guarantees.
