# Testing rules

Це єдине джерело стабільних правил вибору frontend-тестів і TDD. Feature та
task-файли посилаються на нього й містять лише конкретний test level, команди
та evidence.

## Фактичний tooling репозиторію

| Scope               | Tooling і доступні targets                                                                                                                                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin React         | Vitest 4, React Testing Library, `user-event`, jsdom і `@testing-library/jest-dom`. `admin:vite:test` перевіряє component/browser integration harness; `admin-shared-api-client:vite:test` виконує unit tests. `admin-e2e:e2e` запускає окремий Playwright Chromium project.       |
| Mobile React Native | Jest 29, `jest-expo` 56 і React Native Testing Library 13. `npm run test:mobile` послідовно запускає дев'ять Nx targets для app та libraries. Наявні unit, focused integration, storage/native boundary і component tests; app suite є infrastructure smoke для Expo Router/RN UI. |
| Storefront Angular  | `storefront:lint` і `storefront:build`; test target і тестові файли не виявлені.                                                                                                                                                                                                   |
| E2E                 | Web: Playwright 1.63, project `admin-e2e`, лише Chromium. Mobile: Detox, Maestro та Appium відсутні; mobile E2E потребує окремого `EN-*`, вибору device/build strategy і доступного Android/iOS середовища.                                                                        |

Package manager — npm, зафіксований `package-lock.json`. Репозиторій вимагає
Node 24.20.x через `.nvmrc`, `.node-version` та `engines`. Точні targets завжди перевіряй через
`npx nx show project <project> --json`.

Відсутній інструмент можна рекомендувати в `EN-*`. Не додавай його до
dependencies і не створюй конфігурацію без потреби конкретних сценаріїв та
дозволеного scope.

## Вибір test level за ризиком

- **Unit** — pure functions, validation, mapper-и, normalizers, reducers та
  детерміновані бізнес-правила.
- **Focused integration** — hooks, stores, providers, кешування, data fetching,
  transport/error mapping і взаємодія кількох модулів із контрольованою
  зовнішньою межею.
- **Component** — React/React Native UI, user interactions, accessibility та
  видимі `loading`/`empty`/`error`/`offline`/`forbidden` стани.
- **Integration** — navigation, deep links, permissions, storage, native і
  browser adapters, API-контракт на межі клієнта.
- **E2E** — лише критичні user journeys через запущений застосунок та
  інтегроване середовище.

Обирай найнижчий рівень, що доводить конкретний ризик. Не перетворюй кожен
`SC-*` на E2E і не повторюй повний сценарій на всіх рівнях. Кілька focused
тестів можуть підтримувати один сценарій, якщо кожен ловить окремий ризик.

## Red → Green → Refactor → Regression

Для кожної нової або зміненої тестованої поведінки:

1. **Red** — додай найменший поведінковий тест, запусти його й зафіксуй
   очікуваний failure через відсутню або неправильну поведінку.
2. **Green** — реалізуй найменшу повну зміну, яка робить focused test зеленим.
3. **Refactor** — покращ структуру в межах задачі й повторно запусти focused
   test.
4. **Regression** — запусти affected suite/targets і запиши результат.

Compilation error, broken fixture, неправильний mock, missing dependency,
помилка test setup або unrelated failure не є валідним Red. Спочатку віднови
працездатний test harness, за потреби окремим `EN-*`, а потім отримай
behavioral failure.

## Exceptions для EN-* і documentation work

Red-first може бути непридатним для documentation-only змін, генераторів,
налаштування test harness або platform prerequisite, до появи якого поведінку
неможливо спостерігати. Запиши причину, enabled `SC-*`, replacement check і
результат. Виняток не скасовує фінальну verification.

## Evidence

У `TS-*` зафіксуй назву/шлях тесту, Red failure, Green result, refactor note і
regression command/result. У `EN-*` — причину винятку та replacement check.
`traceability.md` містить тільки посилання на ці докази.

Команди залежать від project target:

- Admin unit/component: `npm run test:web`; окремо `npm run test:web:unit` і
  `npm run test:web:component`;
- Admin E2E: `npm run test:web:e2e`; Playwright сам запускає `admin:serve`;
- Admin coverage: `npm run test:web:coverage`; production regression —
  `npx nx lint admin`, `npx nx typecheck admin`, `npx nx build admin --configuration=production`;
- Mobile suites: `npm run test:mobile`; coverage — `npm run test:mobile:coverage`;
- test TypeScript: `npm run typecheck:tests` або platform-specific
  `typecheck:tests:web` / `typecheck:tests:mobile`;
- Mobile production regression: `npx nx lint mobile`, `npx nx typecheck mobile`,
  `npx nx export mobile`; native Android/iOS checks виконуються лише у доступному SDK;
- Storefront: `npx nx lint storefront`, `npx nx build storefront`; тестове
  покриття потребує окремого `EN-*`;
- Mobile E2E: не вказуй executable evidence, доки окремий target фактично не створено.

Infrastructure smoke доводить працездатність runner/setup, але не покриває
`R-*` або `SC-*`. Acceptance Given/When/Then є вимогою; executable test і його
результат вказуються окремо у traceability.

Failed або невиконану перевірку записуй з точною командою, failure point,
впливом поточних змін і наступним кроком. Не позначай її як passed.
