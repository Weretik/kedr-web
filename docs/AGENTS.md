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
4. Перед нетривіальною можливістю або архітектурною зміною прочитай [SDD-процес Mobile](architecture/mobile/sdd-process.md), створи чи онови специфікацію в `docs/specs/mobile/<domain>/` і, за потреби, використай [шаблон Mobile feature](specs/_templates/mobile-feature/README.md).

Зберігай межі `feature`, `ui`, `data-access` і `model`, DTO залишай у `data-access`, а публічний API бібліотек — у `src/index.ts`. Запускай релевантні lint, Jest tests, type-check/build і ручну перевірку на пристрої; фіксуй точні результати.
