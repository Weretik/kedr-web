# Стратегія тестування Mobile

## Фактичний test stack

Mobile працює на Expo SDK 56, React Native 0.85, Expo Router, Redux Toolkit/RTK
Query та Axios. Тести використовують Jest 29, `jest-expo` 56 і React Native
Testing Library 13. Конфіги app і libraries є окремими `jest.config.cjs`;
platform mocks живуть лише на реальних межах Expo, storage, network і native UI.

| Рівень              | Target                                                                               | Що перевіряємо                                                   |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Unit                | відповідний `*:test`                                                                 | pure functions, Zod validation, mapper-и, reducers               |
| Focused integration | відповідний `*:test`                                                                 | state, providers, RTK Query/Axios boundary, connectivity         |
| Component           | `mobile:test`, `mobile-catalog-ui:test`, `mobile-catalog-feature:test`, `shell:test` | екрани, доступні ролі/назви та дії користувача                   |
| Integration         | відповідний `*:test`                                                                 | Expo Router boundary, storage, connectivity та native adapters   |
| Mobile E2E          | відсутній                                                                            | критичний journey на зібраному застосунку після окремого enabler |

Основні команди:

```text
npm run typecheck:tests:mobile
npm run test:mobile
npm run test:mobile:coverage
npx nx export mobile
```

`apps/mobile/src/__tests__/` містить infrastructure component smoke для Expo
Router/RN harness. Він доводить працездатність setup, але не є evidence для
бізнес-сценарію.

## Правила для feature

- pure logic і validation перевіряй unit-рівнем;
- hooks, state, providers і data fetching — focused integration;
- screens та user actions — component;
- navigation, deep links, permissions, storage і native adapters — integration;
- E2E використовуй лише для критичного journey, не дублюй повний `SC-*` на
  кожному рівні;
- тести route-файлів розміщуй у `apps/mobile/src/__tests__`, а library tests —
  біля коду поза `apps/mobile/src/app`.

Для нового behavior виконуй Red → Green → Refactor → Regression за
[testing rules](../../standards/testing-rules.md). Compilation/setup failure не
є валідним Red.

## Enabler для Mobile E2E

Detox, Maestro й Appium зараз не встановлені, а Android SDK у поточному
середовищі не виявлено. Коли feature потребує mobile E2E, створи один `EN-*`
task із відповідальністю вибору та запуску runner:

1. Зафіксуй critical `SC-*`, тип збірки (Expo development build/EAS або local
   native build), Android/iOS targets і CI device strategy.
2. Порівняй runner за сумісністю з Expo Router, native modules, Windows/Linux
   CI та потрібними permissions/deep links. Не обирай інструмент лише за назвою.
3. Додай мінімальний smoke, Nx target, setup/cache/artifact paths і команду CI.
4. На Android виконай test на emulator/device; iOS перевіряй лише на macOS з
   Xcode. Невиконану платформу запиши як blocker.
5. Після стабільного smoke створи окремі `TS-*` для critical journeys і зв'яжи
   їх через `traceability.md`.

До завершення enabler mobile E2E має статус `planned`; Jest component tests не
можна називати device E2E evidence.
