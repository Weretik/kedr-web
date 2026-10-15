# Архітектура Mobile

**Область:** наявний мобільний застосунок `apps/mobile` у Nx-монорепозиторії KEDR.

**Підхід:** domain-first архітектура, узгоджена з Admin, з Expo Router як тонким шаром маршрутизації та спільними TypeScript-контрактами там, де це виправдано.

## Призначення

Цей розділ фіксує архітектурний контракт мобільного застосунку. [Карта наявних модулів](structure/modules.md) показує поточний код; інші документи можуть описувати також цільові межі та майбутні можливості. Перед реалізацією звіряй їх із фактичним станом репозиторію.

Мобільний застосунок є окремим клієнтом. Він не переносить UI-код React Admin або Angular Storefront, але може використовувати ті самі бекенд-API та спільні доменні контракти.

## Обрана архітектура

Mobile повторює **domain-first** підхід Admin: бізнес-домен ізольований, а його
код розділений на `feature`, `data-access`, `model` і `ui`. Це не означає
перенесення web-коду: Mobile має власні React Native/Expo UI та platform-adapters.

```text
apps/mobile/src/app/                 Expo Router: routes і layouts
              │
              ▼
libs/mobile/<domain>/feature/        screen і user flow
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
     ui/        data-access/       model/     mobile/shared/
  presentation   RTK Query/API    pure TS     Axios, config, UI
```

```text
libs/mobile/
├── core/                            shell, connectivity
├── shared/                          api-client, config, model
├── catalog/                         feature, data-access, model, ui
├── cart/                            feature, data-access, model, ui
├── orders/                          feature, data-access, model, ui
└── customers/                       data-access, model, ui
```

`apps/mobile/src/app` — технічний шар Expo Router. Route-файли не містять HTTP
чи бізнес-логіки: вони підключають публічний screen із domain `feature`. Між
бібліотеками дозволені лише aliases і `src/index.ts`; DTO не виходять за межі
`data-access`, а `ui` не залежить від API або router.

## Карта документів

### Структура й залежності

- [Наявні модулі та маршрути](structure/modules.md)
- [Домени та структура бібліотек](structure/domains.md)
- [Правила залежностей](structure/dependencies.md)
- [Nx-контракт і публічний API](structure/nx-contract.md)

### Робота застосунку

- [Застосунок і маршрутизація](runtime/application.md)
- [Стан, API та форми](runtime/state-and-api.md)
- [Online-first та майбутній офлайн](runtime/offline-strategy.md)

### Платформа Expo та пристрої

- [Технологічний стек і межі відповідальності](platform/technology-stack.md)
- [Каталог UI та platform-можливостей](platform/ui-capabilities.md)
- [Expo Go та Development Build](platform/development-build.md)

### Процес і рішення

- [Стратегія тестування](workflow/testing.md)
- [SDD-процес](workflow/sdd-process.md)
- [ADR Mobile](adr/)

Пов'язані стандарти:

- [Індекс frontend rules](../../standards/README.md)
- [Організація коду Mobile](../../standards/mobile/mobile-code-organization.md)
- [Інтерфейс Mobile](../../standards/mobile/mobile-ui.md)
- [API та data rules](../../standards/shared/api-data-rules.md)
- [Testing rules](../../standards/shared/testing-rules.md)
- [Delivery rules](../../standards/shared/delivery-rules.md)
