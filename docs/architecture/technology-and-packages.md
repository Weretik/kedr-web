# Технології та прямі npm-залежності Kedr Web

**Перевірено:** 2026-10-15. **Менеджер пакетів:** npm 11.6.2, Node >=24.20 <25.

Це довідник прямих залежностей із чотирьох manifest-файлів. Версія ліворуч оголошена в manifest; версія праворуч узята з відповідного lockfile. Транзитивні залежності тут не інвентаризуються. Рядок «перевірити» означає, що фактичне використання пакета ще не доведене конкретним імпортом або конфігурацією; у таблиці описано його призначення, а не підтверджено його активне застосування. Точні правила архітектури та межі модулів визначають [архітектура](frontend-inventory.md) і документи застосунків.

## Склад стека

| Клієнт     | Framework та runtime       | UI і навігація                                      | Стан, API та форми                                   | Збірка й перевірка                        |
| ---------- | -------------------------- | --------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Storefront | Angular 21, SSR, RxJS      | PrimeNG, Tailwind, Angular Router, Transloco        | Angular signals, NgRx Signals, HttpClient            | Nx Angular, Vite/Vitest, production build |
| Admin      | React 19                   | MUI 9, React Router 7                               | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx React/Vite, Vitest, Playwright         |
| Mobile     | Expo 57, React Native 0.86 | Expo Router, React Native Paper, native UI packages | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx Expo, Jest, Expo export                |

Склад клієнтів і фактичні Nx targets перевіряйте за [frontend inventory](frontend-inventory.md). Архітектурні наслідки Mobile описані в [його технологічному стеку](mobile/platform/technology-stack.md) та [UI-capabilities](mobile/platform/ui-capabilities.md).

## Узгодженість manifest та lockfile

- Кореневий `package-lock.json` містить Expo 57.0.24 і React Native 0.86.3, що відповідає оголошеним версіям кореневого manifest.
- `apps/mobile/package.json` оголошує Expo `^57.0.24` і React Native `0.86.3`; `apps/mobile/package-lock.json` після синхронізації фіксує Expo 57.0.29 і React Native 0.86.3. Різниця між Expo 57.0.24 у кореневому lockfile та 57.0.29 у мобільному lockfile дозволена діапазоном `^57.0.24`, але при окремій EAS-інсталяції обидва дерева слід перевіряти окремо.
- Два library manifest-файли нижче не мають власних lockfile; їхні вирішені версії наведено з кореневого lockfile. При перевірці інсталяції враховуйте точний режим npm workspaces/EAS, а не припускайте ідентичне дерево.

## Архітектурні рішення за групами

- **Storefront:** Angular SSR і hydration формують серверний та браузерний runtime; PrimeNG разом із Tailwind визначають UI-шар. Зміни перевіряють build Storefront і цільові тести; межі між `apps/storefront` і `libs/storefront` описані в [архітектурі Storefront](storefront/README.md).
- **Admin:** React і MUI відповідають за браузерний інтерфейс, React Router — за навігацію. RTK Query через спільний API client і Axios обслуговує server state; локальні форми використовують React Hook Form та Zod. Виняток auth transport описаний у [Admin ADR](admin/README.md).
- **Mobile:** Expo SDK, Expo Router і React Native визначають native runtime та маршрути; Paper і додаткові native UI-пакети застосовують у конкретних сценаріях. Native-пакети потребують перевірки сумісності SDK та development build; деталі у [Mobile architecture](mobile/README.md).
- **Contracts:** `@redocly/cli` перевіряє OpenAPI snapshot, `openapi-typescript` генерує TS-типи; джерело і workflow — [реєстр API-контрактів](../contracts/README.md).
- **Tooling:** Nx координує projects і targets; Angular/Vite/Expo/Jest/Playwright пакети діють у своїх клієнтах. Оголошення прямої залежності саме по собі не гарантує, що відповідний target чи тест існує.

## Повний реєстр

У таблицях наведено всі записи `dependencies` і `devDependencies`; повтор одного пакета у двох manifest-файлах залишено навмисно, бо діапазони та спосіб інсталяції можуть різнитися.

### Кореневий manifest — runtime

| Пакет                                       | Оголошено → lock       | Контекст            | Призначення                                                 | Код або конфігурація                               | Стан       |
| ------------------------------------------- | ---------------------- | ------------------- | ----------------------------------------------------------- | -------------------------------------------------- | ---------- |
| `@angular/common`                           | `21.2.22` → `21.2.22`  | Storefront          | Базові Angular API: директиви, pipes та стандартні сервіси. | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/compiler`                         | `21.2.22` → `21.2.22`  | Storefront          | Runtime-компілятор Angular-шаблонів.                        | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/core`                             | `21.2.22` → `21.2.22`  | Storefront          | Компоненти, DI та реактивність Angular.                     | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/forms`                            | `21.2.22` → `21.2.22`  | Storefront          | Reactive/template-driven форми Angular.                     | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/platform-browser`                 | `21.2.22` → `21.2.22`  | Storefront          | Браузерний рендеринг та hydration Angular.                  | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/platform-server`                  | `21.2.22` → `21.2.22`  | Storefront          | Серверний рендеринг Angular.                                | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/router`                           | `21.2.22` → `21.2.22`  | Storefront          | Маршрути та guards Storefront.                              | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@angular/ssr`                              | `21.2.23` → `21.2.23`  | Storefront          | Angular SSR server integration.                             | `apps/storefront; libs/storefront; project.json`   | перевірити |
| `@emotion/react`                            | `^11.14.0` → `11.14.0` | Admin               | React styling runtime для MUI.                              | `apps/admin; libs/admin`                           | перевірити |
| `@emotion/styled`                           | `^11.14.1` → `11.14.1` | Admin               | Styled components engine для MUI.                           | `apps/admin; libs/admin`                           | перевірити |
| `@expo/metro`                               | `~56.0.2` → `56.0.2`   | Mobile              | Metro bundler integration для Expo.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@expo/metro-runtime`                       | `~57.0.16` → `57.0.16` | Mobile              | Expo runtime bridge для Metro.                              | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@expo/vector-icons`                        | `~15.1.0` → `15.1.1`   | Mobile              | Іконки Expo/React Native.                                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@hookform/resolvers`                       | `^5.5.7` → `5.5.7`     | Admin / Mobile      | Підключення Zod-схем до React Hook Form.                    | `libs/admin; libs/mobile`                          | перевірити |
| `@jsverse/transloco`                        | `^8.4.0` → `8.4.0`     | Storefront          | Локалізація та завантаження перекладів Storefront.          | `apps/storefront; libs/storefront`                 | перевірити |
| `@mui/icons-material`                       | `^9.2.0` → `9.4.0`     | Admin               | Іконки Material Design для Admin.                           | `apps/admin; libs/admin`                           | перевірити |
| `@mui/material`                             | `^9.2.0` → `9.4.0`     | Admin               | Базові компоненти MUI для Admin.                            | `apps/admin; libs/admin`                           | перевірити |
| `@mui/x-charts`                             | `^9.10.1` → `9.13.0`   | Admin               | Графіки MUI X.                                              | `apps/admin; libs/admin`                           | перевірити |
| `@mui/x-data-grid`                          | `^9.10.1` → `9.13.0`   | Admin               | Таблиці даних MUI X.                                        | `apps/admin; libs/admin`                           | перевірити |
| `@ngrx/operators`                           | `^21.1.1` → `21.1.1`   | Storefront          | Оператори для NgRx потоків.                                 | `apps/storefront; libs/storefront`                 | перевірити |
| `@ngrx/signals`                             | `^21.1.1` → `21.1.1`   | Storefront          | Signal stores та reactive state Storefront.                 | `apps/storefront; libs/storefront`                 | перевірити |
| `@primeuix/themes`                          | `^2.0.3` → `2.0.3`     | Storefront          | Тема та design tokens PrimeNG.                              | `apps/storefront; libs/storefront; styles`         | перевірити |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0`      | Mobile              | Локальне незахищене key-value storage.                      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@react-native-community/netinfo`           | `^12.0.1` → `12.0.1`   | Mobile              | Стан підключення мережі пристрою.                           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@reduxjs/toolkit`                          | `^2.12.0` → `2.12.0`   | Admin / Mobile      | Redux store, RTK Query та async data cache.                 | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `@shopify/flash-list`                       | `^2.0.2` → `2.0.2`     | Mobile              | Продуктивний список товарів.                                | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@tailwindcss/postcss`                      | `^4.3.3` → `4.3.3`     | Storefront / styles | PostCSS plugin Tailwind.                                    | `apps/storefront; apps/storefront; tools/tokens`   | перевірити |
| `axios`                                     | `^1.18.1` → `1.20.0`   | Admin / Mobile      | HTTP-клієнт API adapters Admin/Mobile.                      | `libs/admin; libs/mobile`                          | перевірити |
| `expo`                                      | `^57.0.24` → `57.0.24` | Mobile              | Expo SDK та запуск Mobile-застосунку.                       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-image`                                | `~57.0.5` → `57.0.5`   | Mobile              | Оптимізоване відображення зображень Expo.                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-router`                               | `~57.0.22` → `57.0.22` | Mobile              | File-based маршрутизація Mobile.                            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-splash-screen`                        | `~57.0.9` → `57.0.9`   | Mobile              | Керування splash screen Expo.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-status-bar`                           | `~57.0.1` → `57.0.1`   | Mobile              | Керування status bar Expo.                                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-system-ui`                            | `~57.0.4` → `57.0.4`   | Mobile              | Системна тема та UI-параметри Expo.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `express`                                   | `^4.22.2` → `4.22.2`   | Storefront SSR      | Node HTTP-сервер для Angular SSR.                           | `apps/storefront`                                  | перевірити |
| `ngxtension`                                | `^7.2.0` → `7.3.0`     | Storefront          | Angular utility extensions.                                 | `apps/storefront; libs/storefront`                 | перевірити |
| `postcss`                                   | `^8.5.22` → `8.5.28`   | Storefront / styles | PostCSS pipeline для обробки стилів.                        | `apps/storefront; apps/storefront; tools/tokens`   | перевірити |
| `primeicons`                                | `^7.0.0` → `7.0.0`     | Storefront          | Іконки PrimeNG.                                             | `apps/storefront; libs/storefront; styles`         | перевірити |
| `primeng`                                   | `^21.1.9` → `21.1.9`   | Storefront          | Компоненти PrimeNG.                                         | `apps/storefront; libs/storefront; styles`         | перевірити |
| `react`                                     | `19.2.3` → `19.2.3`    | Admin / Mobile      | React-компоненти й hooks.                                   | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `react-dom`                                 | `19.2.3` → `19.2.3`    | Admin / Mobile      | DOM-рендеринг React або web-адаптер Mobile.                 | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `react-hook-form`                           | `^7.83.0` → `7.83.0`   | Admin / Mobile      | Керування полями та станом форм React.                      | `libs/admin; libs/mobile`                          | перевірити |
| `react-native`                              | `0.86.3` → `0.86.3`    | Mobile              | React Native runtime і native components.                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-actions-sheet`                | `^0.9.7` → `0.9.8`     | Mobile              | Нижня панель дій Mobile.                                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-gesture-handler`              | `~2.32.0` → `2.32.0`   | Mobile              | Native gesture handling.                                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-paper`                        | `^5.15.3` → `5.15.3`   | Mobile              | Компоненти Material Design для Mobile.                      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-reanimated`                   | `4.5.1` → `4.5.1`      | Mobile              | Native animations.                                          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-reanimated-carousel`          | `^5.1.1` → `5.1.1`     | Mobile              | Карусель поверх Reanimated.                                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-safe-area-context`            | `~5.7.0` → `5.7.0`     | Mobile              | Safe-area insets для екранів Mobile.                        | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-svg`                          | `15.15.4` → `15.15.4`  | Mobile              | SVG rendering у React Native.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-svg-transformer`              | `~1.5.1` → `1.5.3`     | Mobile              | Metro transformer SVG imports.                              | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-web`                          | `~0.21.0` → `0.21.2`   | Mobile              | Web-адаптер React Native.                                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-worklets`                     | `0.10.1` → `0.10.1`    | Mobile              | Worklets runtime для native animations.                     | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-redux`                               | `^9.3.0` → `9.3.0`     | Admin / Mobile      | React bindings для Redux store.                             | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `react-router-dom`                          | `^7.18.1` → `7.18.3`   | Admin               | Маршрути браузерного Admin.                                 | `apps/admin`                                       | перевірити |
| `remixicon`                                 | `^4.9.1` → `4.9.1`     | Storefront          | Альтернативний набір іконок UI.                             | `apps/storefront; libs/storefront; styles`         | перевірити |
| `rxjs`                                      | `~7.8.2` → `7.8.2`     | Storefront          | Базові потоки Observable для Angular.                       | `apps/storefront; libs/storefront`                 | перевірити |
| `tailwindcss`                               | `^4.3.3` → `4.3.3`     | Storefront / styles | Utility CSS framework.                                      | `apps/storefront; apps/storefront; tools/tokens`   | перевірити |
| `tailwindcss-primeui`                       | `^0.6.1` → `0.6.1`     | Storefront          | Tailwind integration для PrimeNG.                           | `apps/storefront; libs/storefront; styles`         | перевірити |
| `zod`                                       | `^4.4.3` → `4.5.4`     | Admin / Mobile      | Runtime-схеми валідації даних і форм.                       | `libs/admin; libs/mobile`                          | перевірити |
| `zone.js`                                   | `0.16.3` → `0.16.3`    | Storefront          | Контекст виконання Angular change detection.                | `apps/storefront; libs/storefront`                 | перевірити |

Джерела: [manifest](../../package.json) (`dependencies`), [lockfile](../../package-lock.json).

### Кореневий manifest — development

| Пакет                                    | Оголошено → lock        | Контекст                   | Призначення                                                | Код або конфігурація                                    | Стан       |
| ---------------------------------------- | ----------------------- | -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| `@analogjs/vite-plugin-angular`          | `2.7.2` → `2.7.2`       | Storefront / tests         | Vite plugin для Angular compilation.                       | `apps/storefront; libs/storefront/*/vite.config.*`      | tooling    |
| `@analogjs/vitest-angular`               | `2.7.2` → `2.7.2`       | Storefront / tests         | Angular fixtures та інтеграція Vitest.                     | `apps/storefront; libs/storefront/*/vite.config.*`      | tooling    |
| `@angular-devkit/core`                   | `21.2.23` → `21.2.23`   | Storefront / tooling       | Angular CLI DevKit: workspace/configuration API.           | `project.json; apps/storefront; nx.json`                | tooling    |
| `@angular-devkit/schematics`             | `21.2.23` → `21.2.23`   | Storefront / tooling       | DevKit API для генераторів і schematics.                   | `project.json; apps/storefront; nx.json`                | tooling    |
| `@angular-eslint/builder`                | `21.4.0` → `21.4.0`     | Storefront / lint          | Запуск Angular ESLint builder.                             | `eslint.config.cjs`                                     | tooling    |
| `@angular-eslint/eslint-plugin`          | `21.4.0` → `21.4.0`     | Storefront / lint          | ESLint-правила для Angular TypeScript.                     | `eslint.config.cjs`                                     | tooling    |
| `@angular-eslint/eslint-plugin-template` | `21.4.0` → `21.4.0`     | Storefront / lint          | ESLint-правила для Angular HTML-шаблонів.                  | `eslint.config.cjs`                                     | tooling    |
| `@angular-eslint/template-parser`        | `21.4.0` → `21.4.0`     | Storefront / lint          | Parser Angular-шаблонів для ESLint.                        | `eslint.config.cjs`                                     | tooling    |
| `@angular/build`                         | `21.2.23` → `21.2.23`   | Storefront / tooling       | Nx/Angular build pipeline.                                 | `project.json; apps/storefront; nx.json`                | tooling    |
| `@angular/cli`                           | `21.2.23` → `21.2.23`   | Storefront / tooling       | CLI-команди Angular.                                       | `project.json; apps/storefront; nx.json`                | tooling    |
| `@angular/compiler-cli`                  | `21.2.22` → `21.2.22`   | Storefront / tooling       | Ahead-of-time компіляція Angular.                          | `project.json; apps/storefront; nx.json`                | tooling    |
| `@angular/language-service`              | `21.2.22` → `21.2.22`   | Storefront / tooling       | Мовний сервіс Angular для редактора.                       | `project.json; apps/storefront; nx.json`                | tooling    |
| `@babel/core`                            | `^7.29.7` → `7.29.7`    | Workspace / build          | Babel core transformation API.                             | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@babel/preset-react`                    | `^7.29.7` → `7.29.7`    | Workspace / build          | Babel preset для React JSX.                                | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@eslint/js`                             | `^9.39.5` → `9.39.5`    | Workspace / lint           | Базові рекомендовані ESLint rules.                         | `eslint.config.cjs`                                     | tooling    |
| `@expo/cli`                              | `^57.0.26` → `57.0.26`  | Mobile                     | CLI для запуску та збірки Expo.                            | `apps/mobile; libs/mobile; apps/mobile/app.json`        | перевірити |
| `@expo/ngrok`                            | `^4.1.0` → `4.1.3`      | Mobile                     | Тунель ngrok для локального Expo development.              | `apps/mobile; libs/mobile; apps/mobile/app.json`        | перевірити |
| `@nx/angular`                            | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin: Angular targets та generators.                  | `nx.json; project.json; tools`                          | tooling    |
| `@nx/devkit`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx API для генераторів та project graph.                   | `nx.json; project.json; tools`                          | tooling    |
| `@nx/docker`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Docker targets.                              | `nx.json; project.json; tools`                          | tooling    |
| `@nx/esbuild`                            | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для esbuild targets.                             | `nx.json; project.json; tools`                          | tooling    |
| `@nx/eslint`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx інтеграція ESLint.                                      | `nx.json; project.json; tools`                          | tooling    |
| `@nx/eslint-plugin`                      | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx ESLint rules та module boundaries.                      | `nx.json; project.json; tools`                          | tooling    |
| `@nx/expo`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Expo targets.                                | `nx.json; project.json; tools`                          | tooling    |
| `@nx/jest`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Jest targets.                                | `nx.json; project.json; tools`                          | tooling    |
| `@nx/js`                                 | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для JavaScript/TypeScript.                       | `nx.json; project.json; tools`                          | tooling    |
| `@nx/node`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Node targets.                                | `nx.json; project.json; tools`                          | tooling    |
| `@nx/playwright`                         | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Playwright targets.                          | `nx.json; project.json; tools`                          | tooling    |
| `@nx/react`                              | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для React targets.                               | `nx.json; project.json; tools`                          | tooling    |
| `@nx/vite`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Vite targets.                                | `nx.json; project.json; tools`                          | tooling    |
| `@nx/vitest`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для Vitest targets.                              | `nx.json; project.json; tools`                          | tooling    |
| `@nx/web`                                | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin для web targets.                                 | `nx.json; project.json; tools`                          | tooling    |
| `@nx/workspace`                          | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx workspace commands та project graph.                    | `nx.json; project.json; tools`                          | tooling    |
| `@playwright/test`                       | `^1.63.0` → `1.63.0`    | Admin E2E / tooling        | Playwright browser E2E runner.                             | `apps/admin-e2e; playwright.config.*`                   | tooling    |
| `@react-native/jest-preset`              | `0.86.3` → `0.86.3`     | Mobile                     | React Native Jest preset.                                  | `apps/mobile; libs/mobile; apps/mobile/app.json`        | перевірити |
| `@redocly/cli`                           | `^2.53.2` → `2.53.2`    | API contracts              | Валідація OpenAPI документа.                               | `tools/contracts; package.json scripts; docs/contracts` | tooling    |
| `@rolldown/plugin-babel`                 | `0.2.4` → `0.2.4`       | Workspace / build          | Babel transform plugin для Rolldown.                       | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@schematics/angular`                    | `21.2.23` → `21.2.23`   | Storefront / tooling       | Схеми генерації Angular-коду.                              | `project.json; apps/storefront; nx.json`                | tooling    |
| `@swc-node/register`                     | `~1.12.1` → `1.12.1`    | Workspace / build          | SWC registration для Node TS-файлів.                       | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@swc/core`                              | `~1.15.46` → `1.15.47`  | Workspace / build          | SWC transpiler.                                            | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@swc/helpers`                           | `~0.5.23` → `0.5.23`    | Workspace / build          | Runtime helpers згенерованого SWC-коду.                    | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@testing-library/dom`                   | `10.4.1` → `10.4.1`     | Workspace / tests          | DOM testing utilities.                                     | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@testing-library/jest-dom`              | `7.0.1` → `7.0.1`       | Workspace / tests          | DOM matchers для Jest/Vitest.                              | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@testing-library/react`                 | `16.3.3` → `16.3.3`     | Workspace / tests          | React component testing utilities.                         | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@testing-library/react-native`          | `~13.2.0` → `13.2.2`    | Workspace / tests          | React Native component testing utilities.                  | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@testing-library/user-event`            | `14.6.7` → `14.6.7`     | Workspace / tests          | User interaction simulation у DOM-тестах.                  | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@types/express`                         | `^4.17.25` → `4.17.25`  | Workspace / TypeScript     | Type definitions для Express.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@types/jest`                            | `29.5.14` → `29.5.14`   | Workspace / TypeScript     | Type definitions для Jest.                                 | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@types/node`                            | `24.10.13` → `24.10.13` | Workspace / TypeScript     | Type definitions для Node.js.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@types/react`                           | `^19.2.17` → `19.2.18`  | Workspace / TypeScript     | Type definitions для React.                                | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@types/react-dom`                       | `^19.2.3` → `19.2.7`    | Workspace / TypeScript     | Type definitions для React DOM.                            | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@types/supertest`                       | `^6.0.3` → `6.0.3`      | Workspace / TypeScript     | Type definitions для Supertest.                            | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@typescript-eslint/eslint-plugin`       | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript ESLint rules.                                   | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@typescript-eslint/parser`              | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript parser для ESLint.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@typescript-eslint/utils`               | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript ESLint utility API.                             | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `@vitejs/plugin-react`                   | `6.1.1` → `6.1.1`       | Workspace / build          | Vite plugin React і Fast Refresh.                          | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `@vitest/coverage-v8`                    | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest V8 coverage provider.                               | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@vitest/ui`                             | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest browser UI.                                         | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `angular-eslint`                         | `21.4.0` → `21.4.0`     | Storefront / lint          | Узгоджена конфігурація Angular ESLint.                     | `eslint.config.cjs`                                     | tooling    |
| `babel-jest`                             | `~29.7.0` → `29.7.0`    | Workspace / build          | Babel transform у Jest.                                    | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `babel-plugin-react-compiler`            | `^1.0.0` → `1.0.0`      | Workspace / build          | Babel plugin React Compiler.                               | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `babel-preset-expo`                      | `~57.0.12` → `57.0.12`  | Workspace / build          | Babel preset Expo/React Native.                            | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `chroma-js`                              | `^3.2.0` → `3.2.0`      | Storefront / design tokens | Зміна кольорів у генераторі дизайн-токенів.                | `tools/tokens`                                          | tooling    |
| `cross-env`                              | `^10.1.0` → `10.1.0`    | Workspace / tooling        | Кросплатформне встановлення env vars у scripts.            | `.husky; package.json scripts; .prettierrc*`            | tooling    |
| `esbuild`                                | `^0.28.1` → `0.28.2`    | Workspace / build          | Швидкий JS/TS bundler.                                     | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `eslint`                                 | `^9.39.5` → `9.39.5`    | Workspace / lint           | ESLint runner.                                             | `eslint.config.cjs`                                     | tooling    |
| `eslint-config-prettier`                 | `^10.1.8` → `10.1.8`    | Workspace / lint           | Вимкнення ESLint style rules, що конфліктують із Prettier. | `eslint.config.cjs`                                     | tooling    |
| `eslint-plugin-import`                   | `^2.32.0` → `2.32.0`    | Workspace / lint           | ESLint rules для import statements.                        | `eslint.config.cjs`                                     | tooling    |
| `eslint-plugin-jsx-a11y`                 | `6.10.2` → `6.10.2`     | Workspace / lint           | ESLint rules доступності JSX.                              | `eslint.config.cjs`                                     | tooling    |
| `eslint-plugin-playwright`               | `^1.8.3` → `1.8.3`      | Admin E2E / tooling        | ESLint rules для Playwright тестів.                        | `apps/admin-e2e; playwright.config.*`                   | tooling    |
| `eslint-plugin-prettier`                 | `^5.5.6` → `5.5.6`      | Workspace / lint           | ESLint integration Prettier.                               | `eslint.config.cjs`                                     | tooling    |
| `eslint-plugin-react`                    | `7.37.5` → `7.37.5`     | Workspace / lint           | ESLint rules для React.                                    | `eslint.config.cjs`                                     | tooling    |
| `eslint-plugin-react-hooks`              | `5.2.0` → `5.2.0`       | Workspace / lint           | ESLint rules для React hooks.                              | `eslint.config.cjs`                                     | tooling    |
| `husky`                                  | `^9.1.7` → `9.1.7`      | Workspace / tooling        | Git hook runner.                                           | `.husky; package.json scripts; .prettierrc*`            | tooling    |
| `jest`                                   | `~29.7.0` → `29.7.0`    | Workspace / tests          | Jest test runner.                                          | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jest-environment-jsdom`                 | `~29.7.0` → `29.7.0`    | Workspace / tests          | DOM-середовище Jest.                                       | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jest-environment-node`                  | `~29.7.0` → `29.7.0`    | Workspace / tests          | Node-середовище Jest.                                      | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jest-expo`                              | `~57.0.5` → `57.0.5`    | Workspace / tests          | Expo Jest preset.                                          | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jest-util`                              | `~29.7.0` → `29.7.0`    | Workspace / tests          | Допоміжні Jest utilities.                                  | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jiti`                                   | `2.7.0` → `2.7.0`       | Workspace / lint           | Завантаження TS/ESM конфігурації в Node.                   | `eslint.config.cjs`                                     | tooling    |
| `jsdom`                                  | `~22.1.0` → `22.1.0`    | Workspace / tests          | DOM-емулятор для unit tests.                               | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jsonc-eslint-parser`                    | `^2.4.2` → `2.4.2`      | Workspace / lint           | Parser JSON/JSONC для ESLint.                              | `eslint.config.cjs`                                     | tooling    |
| `lint-staged`                            | `^16.4.0` → `16.4.0`    | Workspace / tooling        | Запуск перевірок для staged файлів.                        | `.husky; package.json scripts; .prettierrc*`            | tooling    |
| `nx`                                     | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx workspace commands та project graph.                    | `nx.json; project.json; tools`                          | tooling    |
| `openapi-typescript`                     | `^7.13.0` → `7.13.0`    | API contracts              | Генерація TypeScript types із OpenAPI.                     | `tools/contracts; package.json scripts; docs/contracts` | tooling    |
| `prettier`                               | `~3.9.6` → `3.9.6`      | Workspace / tooling        | Форматування Markdown і коду.                              | `.husky; package.json scripts; .prettierrc*`            | tooling    |
| `react-test-renderer`                    | `19.2.3` → `19.2.3`     | Workspace / tests          | React renderer для snapshot/component тестів.              | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `supertest`                              | `^7.2.2` → `7.2.2`      | Workspace / tests          | HTTP assertions для Express tests.                         | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `ts-jest`                                | `^29.4.7` → `29.4.12`   | Workspace / TypeScript     | TypeScript transform для Jest.                             | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `ts-node`                                | `10.9.2` → `10.9.2`     | Workspace / TypeScript     | Запуск TypeScript у Node.js.                               | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `tslib`                                  | `^2.8.1` → `2.8.1`      | Workspace / TypeScript     | TypeScript runtime helpers.                                | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `typescript`                             | `5.9.3` → `5.9.3`       | Workspace / TypeScript     | TypeScript compiler.                                       | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `typescript-eslint`                      | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | Узгоджена TypeScript ESLint конфігурація.                  | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `vite`                                   | `8.2.2` → `8.2.2`       | Workspace / build          | Vite build/dev/test infrastructure.                        | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling    |
| `vitest`                                 | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest test runner.                                        | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |

Джерела: [manifest](../../package.json) (`devDependencies`), [lockfile](../../package-lock.json).

### Mobile manifest — runtime

| Пакет                                       | Оголошено → lock       | Контекст | Призначення                                 | Код або конфігурація                               | Стан       |
| ------------------------------------------- | ---------------------- | -------- | ------------------------------------------- | -------------------------------------------------- | ---------- |
| `@expo/metro`                               | `~56.0.0` → `56.0.2`   | Mobile   | Metro bundler integration для Expo.         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@expo/vector-icons`                        | `~15.1.0` → `15.1.1`   | Mobile   | Іконки Expo/React Native.                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@hookform/resolvers`                       | `^5.5.7` → `5.5.7`     | Mobile   | Підключення Zod-схем до React Hook Form.    | `libs/admin; libs/mobile`                          | перевірити |
| `@react-native-assets/slider`               | `^11.0.12` → `11.0.12` | Mobile   | Native slider control.                      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0`      | Mobile   | Локальне незахищене key-value storage.      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@react-native-community/netinfo`           | `12.0.1` → `12.0.1`    | Mobile   | Стан підключення мережі пристрою.           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `@reduxjs/toolkit`                          | `^2.12.0` → `2.12.0`   | Mobile   | Redux store, RTK Query та async data cache. | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `@shopify/flash-list`                       | `2.0.2` → `2.0.2`      | Mobile   | Продуктивний список товарів.                | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `axios`                                     | `^1.18.1` → `1.18.1`   | Mobile   | HTTP-клієнт API adapters Admin/Mobile.      | `libs/admin; libs/mobile`                          | перевірити |
| `expo`                                      | `^57.0.24` → `57.0.29` | Mobile   | Expo SDK та запуск Mobile-застосунку.       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-blur`                                 | `~57.0.3` → `57.0.3`   | Mobile   | Розмиття native UI.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-constants`                            | `~57.0.19` → `57.0.22` | Mobile   | Доступ до конфігурації та констант Expo.    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-font`                                 | `~57.0.4` → `57.0.4`   | Mobile   | Завантаження кастомних шрифтів Expo.        | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-image`                                | `~57.0.5` → `57.0.5`   | Mobile   | Оптимізоване відображення зображень Expo.   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-linking`                              | `~57.0.10` → `57.0.13` | Mobile   | Deep linking і URL handling Expo.           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-router`                               | `~57.0.22` → `57.0.27` | Mobile   | File-based маршрутизація Mobile.            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-secure-store`                         | `~57.0.4` → `57.0.4`   | Mobile   | Захищене зберігання device secrets.         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-splash-screen`                        | `~57.0.9` → `57.0.10`  | Mobile   | Керування splash screen Expo.               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-status-bar`                           | `~57.0.1` → `57.0.1`   | Mobile   | Керування status bar Expo.                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `expo-system-ui`                            | `~57.0.4` → `57.0.4`   | Mobile   | Системна тема та UI-параметри Expo.         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react`                                     | `19.2.3` → `19.2.3`    | Mobile   | React-компоненти й hooks.                   | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `react-dom`                                 | `19.2.3` → `19.2.3`    | Mobile   | DOM-рендеринг React або web-адаптер Mobile. | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `react-hook-form`                           | `^7.83.0` → `7.83.0`   | Mobile   | Керування полями та станом форм React.      | `libs/admin; libs/mobile`                          | перевірити |
| `react-native`                              | `0.86.3` → `0.86.3`    | Mobile   | React Native runtime і native components.   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-actions-sheet`                | `^0.9.7` → `0.9.8`     | Mobile   | Нижня панель дій Mobile.                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-gesture-handler`              | `~2.32.0` → `2.32.0`   | Mobile   | Native gesture handling.                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-paper`                        | `^5.15.3` → `5.15.3`   | Mobile   | Компоненти Material Design для Mobile.      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-reanimated`                   | `4.5.1` → `4.5.1`      | Mobile   | Native animations.                          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-reanimated-carousel`          | `^5.1.1` → `5.2.0`     | Mobile   | Карусель поверх Reanimated.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-safe-area-context`            | `~5.7.0` → `5.7.0`     | Mobile   | Safe-area insets для екранів Mobile.        | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-screens`                      | `~4.26.0` → `4.26.2`   | Mobile   | Native screen primitives для навігації.     | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-svg`                          | `15.15.4` → `15.15.4`  | Mobile   | SVG rendering у React Native.               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-svg-transformer`              | `~1.5.1` → `1.5.3`     | Mobile   | Metro transformer SVG imports.              | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-tree-multi-select`            | `^3.0.2` → `3.0.6`     | Mobile   | Деревоподібний multiple-select у Mobile.    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-web`                          | `~0.21.0` → `0.21.2`   | Mobile   | Web-адаптер React Native.                   | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-native-worklets`                     | `0.10.1` → `0.10.1`    | Mobile   | Worklets runtime для native animations.     | `apps/mobile; libs/mobile; apps/mobile/app.json`   | перевірити |
| `react-redux`                               | `^9.3.0` → `9.3.0`     | Mobile   | React bindings для Redux store.             | `apps/admin; apps/mobile; libs/admin; libs/mobile` | перевірити |
| `zod`                                       | `^4.4.3` → `4.4.3`     | Mobile   | Runtime-схеми валідації даних і форм.       | `libs/admin; libs/mobile`                          | перевірити |

Джерела: [manifest](../../apps/mobile/package.json) (`dependencies`), [lockfile](../../apps/mobile/package-lock.json).

### Mobile manifest — development

| Пакет                           | Оголошено → lock      | Контекст               | Призначення                                                 | Код або конфігурація                                    | Стан       |
| ------------------------------- | --------------------- | ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| `@testing-library/react-native` | `~13.2.0` → `13.2.2`  | Mobile / tests         | React Native component testing utilities.                   | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `@react-native/jest-preset`     | `0.86.3` → `0.86.3`   | Mobile / tests         | React Native Jest preset для сумісного native test runtime. | `apps/mobile; jest.config.*`                            | перевірити |
| `@types/jest`                   | `29.5.14` → `29.5.14` | Workspace / TypeScript | Type definitions для Jest.                                  | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling    |
| `jest`                          | `~29.7.0` → `29.7.0`  | Mobile / tests         | Jest test runner.                                           | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |
| `jest-expo`                     | `~57.0.5` → `57.0.6`  | Mobile / tests         | Expo Jest preset.                                           | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling    |

Джерела: [manifest](../../apps/mobile/package.json) (`devDependencies`), [lockfile](../../apps/mobile/package-lock.json).

### Mobile catalog feature — runtime

| Пакет                                       | Оголошено → lock  | Контекст | Призначення                            | Код або конфігурація                             | Стан       |
| ------------------------------------------- | ----------------- | -------- | -------------------------------------- | ------------------------------------------------ | ---------- |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0` | Mobile   | Локальне незахищене key-value storage. | `apps/mobile; libs/mobile; apps/mobile/app.json` | перевірити |

Джерела: [manifest](../../libs/mobile/catalog/feature/package.json) (`dependencies`), [lockfile](../../package-lock.json).

### Mobile catalog UI — runtime

| Пакет                            | Оголошено → lock       | Контекст | Призначення                              | Код або конфігурація                             | Стан       |
| -------------------------------- | ---------------------- | -------- | ---------------------------------------- | ------------------------------------------------ | ---------- |
| `@react-native-assets/slider`    | `^11.0.12` → `11.0.12` | Mobile   | Native slider control.                   | `apps/mobile; libs/mobile; apps/mobile/app.json` | перевірити |
| `@shopify/flash-list`            | `2.0.2` → `2.0.2`      | Mobile   | Продуктивний список товарів.             | `apps/mobile; libs/mobile; apps/mobile/app.json` | перевірити |
| `react-native-actions-sheet`     | `^0.9.7` → `0.9.8`     | Mobile   | Нижня панель дій Mobile.                 | `apps/mobile; libs/mobile; apps/mobile/app.json` | перевірити |
| `react-native-tree-multi-select` | `^3.0.2` → `3.0.6`     | Mobile   | Деревоподібний multiple-select у Mobile. | `apps/mobile; libs/mobile; apps/mobile/app.json` | перевірити |

Джерела: [manifest](../../libs/mobile/catalog/ui/package.json) (`dependencies`), [lockfile](../../package-lock.json).

## Оновлення

При зміні будь-якого `package.json` або lockfile повторно звірте всі шість таблиць, фактичні imports/config/scripts і застосовні документи клієнтів. Для пакета зі статусом `перевірити` знайдіть імпорт або конфігурацію, визначте власника рішення і лише тоді змініть статус. Нативні залежності також перевіряйте Expo Doctor та відповідним build. У документації не зберігайте вивід `npm ls` як джерело істини.
