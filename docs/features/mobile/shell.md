# Mobile shell and navigation

**Scenario:** app launch, tabs, theme, and network state. [SDD](../../specs/mobile/shell/001-app-shell-navigation/spec.md).

- [Root layout](../../../apps/mobile/src/app/_layout.tsx) and [tabs layout](../../../apps/mobile/src/app/%28tabs%29/_layout.tsx) define the Expo Router structure; React Native Paper renders navigation.
- [AppProviders](../../../libs/mobile/core/shell/src/providers/app-providers.tsx), [app-store](../../../libs/mobile/core/shell/src/state/app-store.ts), and [theme preference storage](../../../libs/mobile/core/shell/src/storage/theme-preference-storage.ts) provide shared state. The [connectivity adapter](../../../libs/mobile/core/connectivity/src/lib/connectivity-adapter.ts) tracks network status.
- Route files remain thin; business logic and API access belong to domain libraries. The initial tab is currently a placeholder.

## Structure diagram

```mermaid
flowchart LR
Root["Root layout"] --> Providers["AppProviders"]
Providers --> Store["app-store"]
Providers --> Theme["theme preference storage"]
Providers --> Network["Connectivity adapter"]
Root --> Tabs["tabs layout"]
Tabs --> Routes["Feature route files"]
```

## Code structure

Actual entry points and main feature files (other files in these directories are omitted):

```text
apps/mobile/src/app/
├── (tabs)/_layout.tsx  # route entry point
└── _layout.tsx  # route entry point

libs/mobile/core/connectivity/
└── src/lib/connectivity-adapter.ts  # feature implementation

libs/mobile/core/shell/
└── src/
    ├── providers/app-providers.tsx  # feature implementation
    ├── state/app-store.ts  # state and data interactions
    └── storage/theme-preference-storage.ts  # local persistence
```
