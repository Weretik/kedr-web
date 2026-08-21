# Testing rules

Ці правила застосовуються до Admin, Mobile і Storefront. Точні проєкти та
targets визначаються `project.json`/`npx nx show project <project>`, а не
припущенням за назвою папки.

## Наявний стек і межі

| Scope      | Наявні інструменти та targets                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Admin      | React, React Testing Library, Vitest. Admin libraries з `tsconfig.spec.json` мають Nx target `vite:test` (наприклад, `admin-products-feature`); сам `admin` має `lint`, `typecheck` і `build`, але не має test target.                                 |
| Mobile     | Expo/React Native, Jest (`jest-expo`) і React Native Testing Library. Є app target `mobile:test` та Jest targets для частини libraries (наприклад, `mobile-catalog-feature`).                                                                          |
| Storefront | Angular; lint і build targets існують для `storefront`. У поточній конфігурації окремого Storefront test target не виявлено.                                                                                                                           |
| E2E        | `@playwright/test` і Nx Playwright plugin встановлені, але e2e project, Playwright config і запущена інфраструктура відсутні. Для Mobile в архітектурі визначено Maestro після першого критичного наскрізного сценарію, але Maestro ще не підключений. |

Деталі Mobile доповнює [стратегія тестування Mobile](../architecture/mobile/testing.md).

## Вибір рівня за ризиком

- **Unit** — чисті domain rules, Zod validation, DTO mapper, normalizer помилок,
  reducer, storage adapter. Це базовий рівень для детермінованої логіки.
- **Integration** — RTK Query endpoint разом з Axios base query/transport,
  interceptor, auth refresh, API error mapping, router guard або взаємодія
  кількох library boundaries. Використовуйте контрольований mock transport, а
  не мережу.
- **Component/feature** — користувацька дія, accessibility role/name,
  navigation adapter, форма та `loading`/`empty`/`error`/`offline`/`forbidden`
  states. Для Admin це RTL + Vitest; для Mobile — RNTL + Jest.
- **E2E** — критичний шлях через запущений застосунок, реальний router і
  інтегроване середовище. Не замінюйте ним unit або component тести.

Обирайте найнижчий рівень, який достовірно ловить ризик. Підвищуйте рівень, коли
зміна перетинає transport, providers, route/access control, залежні бібліотеки
або незворотну дію. Один сценарій може мати unit тест для правила і feature/e2e
перевірку для інтеграції.

## Якість тестів, моків і даних

- Тест перевіряє observable behavior, а не приватну реалізацію; назва описує
  ризик або сценарій.
- Дані є мінімальними, читабельними і детермінованими. Не використовуйте
  production PII, токени, cookies, паролі або повні відповіді API з логів.
- Mock має лишатися на зовнішній межі (Axios/HTTP, native module, clock), бути
  типізованим і відтворювати лише потрібний контракт. Не мокуйте модуль, який
  є предметом тесту; не приховуйте його error path.
- Для API перевіряйте request shape, нормалізацію 400/401/403/5xx та безпечний
  user-facing state там, де це змінюється. Snapshot не є заміною поведінкового
  тесту.
- Кожен тест очищує стан, таймери й mocks; він не залежить від порядку запуску,
  зовнішньої мережі або локальних секретів.

## Коли E2E обов'язковий

E2E потрібен для нового або істотно зміненого критичного бізнес-шляху, що
поєднує route і API/auth: login/session renewal, доступ до захищеного ресурсу,
checkout/payment, створення або підтвердження замовлення, фінансові зміни,
масовий чи destructive workflow. Він також обов'язковий після зміни shared
auth/route guard/transport, якщо ця зміна впливає на критичний шлях.

Якщо E2E target або середовище ще не існує, до **першої** такої функціональної
feature створюється readiness-задача: обрати Playwright (web) або Maestro
(Mobile згідно з `docs/architecture/mobile/testing.md`), створити Nx e2e
project/config, стабільні test identities і безпечні test data, спосіб запуску
app/API та одну smoke-перевірку. До виконання readiness-задачі feature не може
позначати e2e як виконаний; у spec фіксується blocker і owner. Для feature поза
цими умовами допускається `E2E: n/a` лише з конкретним обґрунтуванням ризику.

## Обов'язкові команди та evidence

У `plan.md` і `quickstart.md` наведіть точні проєкти/targets. Запускайте лише
релевантні змінам команди, але не пропускайте залежний app build або test.

- Admin: `npx nx lint <admin-project>`, `npx nx vite:test <admin-library>`
  для library з цим target, `npx nx typecheck <admin-project>` і для app-зміни
  `npx nx build admin`. Якщо test target відсутній, зафіксуйте `n/a` та
  readiness-задачу на його додавання до першої feature у цьому scope.
- Mobile: `npx nx lint mobile`, `npx nx test mobile`; для зміненої library —
  її `npx nx test <mobile-library>` за наявності target. Для змін, що входять у
  web deliverable, запускайте `npx nx export mobile`; для native behavior
  документуйте ручну перевірку на погодженому Android/iOS пристрої. За потреби
  використовуйте `npx expo-doctor`.
- Storefront: `npx nx lint storefront` і `npx nx build storefront`; test target
  наразі `n/a` з readiness-задачею перед першою функціональною Storefront feature.
- E2E: команда може бути вказана лише після створення відповідного target;
  сьогодні універсальної команди e2e в репозиторії немає.

У handoff зазначайте виконані команди й результат. Для невиконаної або failed
перевірки вкажіть дослівну команду, failing test/step, ключове повідомлення,
чи failure pre-existing (із доказом) та наступний крок/owner. Не маскуйте
непов'язані failures і не позначайте їх як passed.
