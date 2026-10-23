# Mobile code rules

## Libraries and routing

- Place domain code in `libs/mobile/<domain>/{model,data-access,ui,feature}`.
- A route file in `apps/mobile/src/app` is a thin Expo Router adapter: it connects a public screen from `feature` and contains no HTTP, storage, or domain logic.
- Root providers, theme, store, connectivity, and shell belong to `@mobile/core/shell`; features must not duplicate them.
- `model` does not depend on React, HTTP, Expo Router, or platform APIs.
- `data-access` owns private DTOs, mappers, and RTK Query hooks; DTOs and transport errors do not leave the library.
- `ui` receives domain data and callbacks through props; it does not import API hooks, router, or storage.

## Structure and platform APIs

- Give each file, screen, and component one cohesive responsibility.
- A screen orchestrates the feature; split lists, cards, toolbars, and complex `renderItem` implementations by independent responsibility.
- For screens with server queries, separate a thin `screens/*` adapter, `hooks/use-*-controller.ts` for RTK Query/debounce/pagination, a pure reducer in `state/`, `components/*-query-controls.tsx` for controls, and `components/*-results.tsx` for loading/error/empty/list states. A screen must not contain effects, reducers, transport hooks, or state conditionals.
- Do not create `common`, `misc`, `helpers`, `utils`, or `types` without a domain purpose.
- RTK Query owns server data, loading, and API errors; do not duplicate them in a reducer.
- Isolate platform APIs: NetInfo belongs in the connectivity adapter, and SecureStore belongs in the relevant storage/auth adapter.
- Add `*.ios.tsx`, `*.android.tsx`, or `*.native.tsx` only for real platform differences; do not duplicate shared logic.
