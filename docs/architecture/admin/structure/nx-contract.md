# Admin Nx contract and public API

## Tags and aliases

New Admin libraries receive tags for scope, domain, and type:

```json
{ "tags": ["scope:admin", "domain:products", "type:feature"] }
```

Aliases follow this pattern:

```text
@admin/<domain>/<layer>
@admin/core/<area>
@admin/shared/<area>
```

## Library public API

Each library exposes its allowed API only through `src/index.ts`. Pages are not exported by default: the application connects route configuration, not the page implementation.

```ts
// Correct
import { productsRoutes } from '@admin/products/feature';
import { ProductCard } from '@admin/products/ui';

// Incorrect
import { ProductsPage } from '@admin/products/feature/src/pages/ProductsPage';
```

The target `@nx/enforce-module-boundaries` configuration checks `scope`, `domain`, and `type`. Until `domain:*`, `type:model`, and orchestration exceptions are fully configured, these rules are also checked during code review.
