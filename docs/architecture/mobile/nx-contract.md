# Nx-контракт і публічний API Mobile

## Теги та aliases

Кожна нова Mobile-бібліотека отримує тег області, домену й типу:

```json
{ "tags": ["scope:mobile", "domain:catalog", "type:feature"] }
```

Для спільної mobile infrastructure використовується окрема область:

```json
{ "tags": ["scope:mobile-shared", "type:ui"] }
```

Цільові aliases:

```text
@mobile/core/<area>
@mobile/shared/<area>
@mobile/<domain>/<layer>
```

Приклади:

```text
@mobile/core/auth
@mobile/shared/api-client
@mobile/catalog/feature
@mobile/catalog/data-access
@mobile/catalog/model
@mobile/catalog/ui
```

Правила `@nx/enforce-module-boundaries` додаються разом зі створенням першої
Mobile-бібліотеки. До цього контракт є обов'язковим для code review; глобальні
обмеження Admin не послаблюються.

## Публічний API бібліотек

Кожна бібліотека розкриває дозволені exports лише через `src/index.ts`.

```ts
// Правильно
import { CatalogScreen } from '@mobile/catalog/feature';
import { ProductCard } from '@mobile/catalog/ui';

// Неправильно
import { CatalogScreen } from '@mobile/catalog/feature/src/screens/catalog-screen';
```

`apps/mobile/src/app` є винятком лише за місцем розташування route-файлів Expo
Router, а не за правилами імпорту: route використовує публічний API feature.

## Спільний код між Admin і Mobile

Спільна бібліотека створюється окремим рішенням і отримує нейтральний `scope`.
Вона може містити лише platform-agnostic TypeScript: контракти, DTO, Zod-схеми,
чисті мапери та утиліти. Вона не може містити UI, HTTP runtime, router або storage.

Mobile не імпортує `@admin/*`, а Admin не імпортує `@mobile/*`.
