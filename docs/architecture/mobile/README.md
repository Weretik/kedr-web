# Архітектура Mobile

**Область:** майбутній мобільний застосунок у Nx-монорепозиторії KEDR.  
**Підхід:** domain-first архітектура, узгоджена з Admin, з Expo Router як тонким шаром маршрутизації та спільними TypeScript-контрактами там, де це виправдано.

## Призначення

Цей розділ фіксує архітектурний контракт мобільного застосунку до початку його реалізації. Він визначає технологічний стек, межі відповідальності та рішення, що мають бути однаково зрозумілі команді.

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
├── core/                            shell, auth (коли з'явиться), connectivity
├── shared/                          api-client, config, ui, util
└── catalog/
    ├── feature/                     screens, orchestration, local state
    ├── data-access/                 endpoint, DTO, mapper, RTK Query hooks
    ├── model/                       entities, queries, invariants
    └── ui/                          presentational React Native-компоненти
```

`apps/mobile/src/app` — технічний шар Expo Router. Route-файли не містять HTTP
чи бізнес-логіки: вони підключають публічний screen із domain `feature`. Між
бібліотеками дозволені лише aliases і `src/index.ts`; DTO не виходять за межі
`data-access`, а `ui` не залежить від API або router.

## Карта документів

- [Технологічний стек і межі відповідальності](technology-stack.md)
- [Застосунок і маршрутизація](application.md)
- [Домени та структура бібліотек](domains.md)
- [Правила залежностей](dependencies.md)
- [Nx-контракт і публічний API](nx-contract.md)
- [Стан, API та форми](state-and-api.md)
- [Online-first та майбутній офлайн](offline-strategy.md)
- [Стратегія тестування](testing.md)
- [Expo Go та Development Build](development-build.md)
- [SDD-процес](sdd-process.md)
- [ADR Mobile](adr/)

Пов'язані стандарти:

- [Індекс frontend rules](../../standards/README.md)
- [Організація коду Mobile](../../standards/mobile-code-organization.md)
- [Інтерфейс Mobile](../../standards/mobile-ui.md)
- [API та data rules](../../standards/api-data-rules.md)
- [Testing rules](../../standards/testing-rules.md)
- [Delivery rules](../../standards/delivery-rules.md)
