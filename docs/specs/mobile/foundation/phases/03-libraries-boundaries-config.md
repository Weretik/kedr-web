# Фаза 03: Libraries, boundaries та config

**Статус:** completed  
**Залежить від:** фаза 02  
**Блокує:** фази 04–06

## Мета

Згенерувати базові Mobile libraries через Nx та закріпити їхні aliases, tags і
допустимі залежності.

## Команди

```powershell
npx nx g @nx/expo:lib libs/mobile/shared/api-client --name=api-client --importPath=@mobile/shared/api-client --linter=eslint --unitTestRunner=jest --tags="scope:mobile-shared,type:data-access"
npx nx g @nx/expo:lib libs/mobile/shared/config --name=config --importPath=@mobile/shared/config --linter=eslint --unitTestRunner=jest --tags="scope:mobile-shared,type:config"
npx nx g @nx/expo:lib libs/mobile/shared/ui --name=ui --importPath=@mobile/shared/ui --linter=eslint --unitTestRunner=jest --tags="scope:mobile-shared,type:ui"
npx nx g @nx/expo:lib libs/mobile/shared/util --name=util --importPath=@mobile/shared/util --linter=eslint --unitTestRunner=jest --tags="scope:mobile-shared,type:util"
npx nx g @nx/expo:lib libs/mobile/core/connectivity --name=connectivity --importPath=@mobile/core/connectivity --linter=eslint --unitTestRunner=jest --tags="scope:mobile,domain:core,type:core"
```

Перед запуском першої library-команди перевірити актуальні опції через
`npx nx g @nx/expo:lib --help`.

## Рішення

- Додати `scope:mobile` і `scope:mobile-shared` до існуючих ESLint module-boundary
  правил за контрактом Mobile; не змінювати правила Admin.
- `shared/config` читає лише `EXPO_PUBLIC_*`, валідує значення і експортує typed
  `appConfig`; решта коду не читає environment напряму.
- `core/connectivity` інкапсулює NetInfo; feature не підписується на NetInfo напряму.

## Критерії приймання

- [x] Усі бібліотеки згенеровані, мають aliases, tags і public `src/index.ts`.
- [x] Недопустимий import порушує ESLint boundary; допустимі aliases працюють.
- [x] Конфігурація не містить секретів і має зрозумілу помилку для некоректного API URL.

## Перевірка

- **Lint:** `npx nx lint mobile` і lint нових libraries.
- **Unit:** Jest tests для config parsing та connectivity adapter.

## Результат виконання

- Згенеровано `shared/api-client`, `shared/config`, `shared/ui`, `shared/util`
  і `core/connectivity` з aliases, tags та public `src/index.ts`.
- Через наявні у workspace Nx projects `config`, `ui` і `util` використано
  унікальні project names `mobile-shared-config`, `mobile-shared-ui` і
  `mobile-shared-util`; публічні aliases лишилися без змін.
- `@mobile/shared/config` експортує typed `appConfig` і `parseAppConfig`, читає
  лише `EXPO_PUBLIC_API_BASE_URL`, не потребує секретів та пояснює некоректний URL.
- `@mobile/core/connectivity` інкапсулює NetInfo у public connectivity adapter.
- Demo-компоненти та demo-тести Nx generator видалено з порожніх `api-client`,
  `shared/ui` і `shared/util`; їхні public entry points лишаються порожніми до
  появи першої реальної відповідальності.
- Додано Mobile dependency constraints. Негативна перевірка підтвердила, що
  `scope:mobile-shared` не може імпортувати `@mobile/core/connectivity`.
- Успішно виконано lint для app і п'яти Mobile libraries, а також Jest tests:
  3 для config parsing і 2 для connectivity adapter.
