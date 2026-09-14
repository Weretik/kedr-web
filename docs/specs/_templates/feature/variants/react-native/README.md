# React Native feature variant

Використовуй цей варіант для React Native/Expo feature. У поточному
репозиторії це Mobile у `apps/mobile` і `libs/mobile`.

Під час створення feature додай усі потрібні файли цього каталогу до базової
структури, зберігаючи відносні шляхи:

- `design/react-native.md`;
- `design/visual-interaction.md`;
- `research/visual-references.md`;
- `verification/device-qa.md`;
- `verification/visual-qa.md`;
- React Native і visual readiness/delivery checklists.

Visual design та interaction є частиною React Native feature, а не окремим
типом feature. Заповнюй visual documents пропорційно зміні: для невізуальної
platform/integration задачі познач незадіяні поля `n/a` з причиною або видали
непотрібний optional reference-файл.

Варіант охоплює Expo Router, React Native UI, visual states, safe area,
keyboard, gestures, deep links, permissions, storage, native adapters,
Expo Go/development build, Jest/RNTL і device QA.
