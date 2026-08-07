# Робочий контекст AI: Admin і Mobile

Прочитай цей файл перед нетривіальною зміною в `apps/admin` або `libs/admin`. Пов'язані документи є джерелом істини.

1. Почни з [архітектури Admin](architecture/admin/README.md): домени, залежності, Nx-контракт, стан і API.
2. Обов'язково прочитай [стандарт організації коду Admin](standards/admin-code-organization.md). Зверни особливу увагу на декомпозицію, одну відповідальність модуля та структуру внутрішнього коду; це правило діє для будь-якої library, feature і компонента.
3. Для UI-змін прочитай [стандарт інтерфейсу Admin](standards/admin-ui.md).
4. Перед нетривіальною можливістю або архітектурною зміною прочитай [SDD-процес Admin](architecture/admin/sdd-process.md), створи чи онови специфікацію в `docs/specs/admin/<domain>/` і, за потреби, використай [шаблон Admin feature](specs/_templates/admin-feature/README.md).

Зберігай межі `feature`, `ui`, `data-access` і `model`, DTO залишай у `data-access`, а публічний API бібліотек — у `src/index.ts`. Запускай релевантні lint, tests і build та фіксуй точні результати.

## Mobile (React Native + Expo)

Прочитай цей розділ перед нетривіальною зміною в `apps/mobile` або `libs/mobile`. Пов'язані документи є джерелом істини.

1. Почни з [архітектури Mobile](architecture/mobile/README.md): обрана domain-first схема, домени, залежності, Nx-контракт, стан/API, offline-стратегія та ADR.
2. Обов'язково прочитай [стандарт організації коду Mobile](standards/mobile-code-organization.md). Зверни особливу увагу на декомпозицію, одну відповідальність модуля, тонкі Expo Router route-файли та ізоляцію platform API; це правило діє для будь-якої library, feature і компонента.
3. Для UI-змін прочитай [стандарт інтерфейсу Mobile](standards/mobile-ui.md).
   Перед вибором UI-бібліотеки, списку, жесту або device API звірся з [каталогом UI та platform-можливостей](architecture/mobile/ui-capabilities.md): він визначає дозволені пакети та умови їх підключення.
4. Перед нетривіальною можливістю або архітектурною зміною прочитай [SDD-процес Mobile](architecture/mobile/sdd-process.md), створи чи онови специфікацію в `docs/specs/mobile/<domain>/` і, за потреби, використай [шаблон Mobile feature](specs/_templates/mobile-feature/README.md).
5. Перед додаванням або зміною HTTP-операції прочитай [frontend-реєстр API-контрактів](contracts/README.md) і [правила інтеграції](contracts/integration.md). Для нової операції додай frontend-проекцію в `docs/contracts/<backend-module>/` та посилання на неї у feature-local `contracts/api-contract.md`: вона є джерелом істини для mobile. Backend/OpenAPI-джерела можна використати як довідку, коли вони доступні, але їх пошук, доступність і актуалізація належать backend-власникам та не є blocker для mobile. Сторінка операції обов'язково містить канонічний HTTP-запит і канонічну форму JSON-відповіді без секретів, PII або вигаданих полів. Для помилок використовуй нормалізований `ApiError`, `fieldErrors` і правила з `contracts/integration.md`; не парсь raw HTTP response у feature або UI.
6. Перед додаванням native library, Android permission, config plugin, зміною `app.json` або Expo SDK прочитай [Expo Go та Development Build](architecture/mobile/development-build.md). Не додавай `expo-dev-client` і не створюй EAS build без native-потреби; після такої зміни зафіксуй потребу повторної binary у feature quickstart.

Зберігай межі `feature`, `ui`, `data-access` і `model`, DTO залишай у `data-access`, а публічний API бібліотек — у `src/index.ts`. Запускай релевантні lint, Jest tests, type-check/build і ручну перевірку на пристрої; фіксуй точні результати.

## Створення стандартної структури

Для застосунків, бібліотек, компонентів, route-файлів та інших артефактів із
підтримуваним generator використовуйте відповідну консольну команду (Nx, Expo
тощо). Не створюйте такий scaffold вручну; після генерації вносіть лише
необхідні предметні зміни.
