# Mobile Nx contract and public API

## Tags and aliases

Each new Mobile library receives scope, domain, and type tags:

```json
{ "tags": ["scope:mobile", "domain:catalog", "type:feature"] }
```

Mobile infrastructure shared within the app uses a separate scope:

```json
{ "tags": ["scope:mobile-shared", "type:ui"] }
```

Target aliases:

```text
@mobile/core/<area>
@mobile/shared/<area>
@mobile/<domain>/<layer>
```

Examples:

```text
@mobile/core/auth
@mobile/shared/api-client
@mobile/catalog/feature
@mobile/catalog/data-access
@mobile/catalog/model
@mobile/catalog/ui
```

`@nx/enforce-module-boundaries` rules already apply to Mobile libraries. The [frontend inventory](../../frontend-inventory.md) records actual coverage and known gaps; a code audit also checks the documented direction before AF-001 is closed.

## Library public API

Each library exposes allowed exports only through `src/index.ts`.

```ts
// Correct
import { CatalogScreen } from '@mobile/catalog/feature';
import { ProductCard } from '@mobile/catalog/ui';

// Incorrect
import { CatalogScreen } from '@mobile/catalog/feature/src/screens/catalog-screen';
```

`apps/mobile/src/app` is an exception only for Expo Router route-file placement, not for import rules: a route uses the feature's public API.

## Code shared between Admin and Mobile

Create a shared library through a separate decision and give it a neutral `scope`. It may contain only platform-agnostic TypeScript: contracts, DTOs, Zod schemas, pure mappers, and utilities. It must not contain UI, HTTP runtime, a router, or storage.

Mobile does not import `@admin/*`, and Admin does not import `@mobile/*`.
