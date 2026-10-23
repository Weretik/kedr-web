# Implementation plan: Mobile app shell and navigation

**Spec:** [spec.md](spec.md)  
**Date:** 2026-07-28

## Summary

Add thin Expo Router `(tabs)` adapters and shell-owned bottom navigation,
header, and persisted theme preference. No domain feature libraries are created:
this delivery belongs to `@mobile/core/shell`.

## Technical context

- **Stack:** Expo SDK 56, React Native, Expo Router, React Native Paper, Redux Toolkit, AsyncStorage.
- **Testing:** Jest + React Native Testing Library, Android Expo Go, web export as needed.
- **Target platforms:** Android and web; iOS will be checked when a device is available.
- **Constraints:** safe area, offline indicator, no native dependency or app config change.

## Architecture and source paths

```text
apps/mobile/src/app/
├── _layout.tsx                 # existing root provider + Stack adapter
└── (tabs)/
    ├── _layout.tsx             # thin Tabs adapter
    ├── index.tsx               # Home route adapter
    ├── catalog.tsx             # Catalog placeholder adapter
    └── profile.tsx             # Profile placeholder adapter

libs/mobile/core/shell/src/
├── components/                 # header, tab presentation, placeholders
├── providers/                  # AppProviders and preference bootstrap
├── state/                      # preference state/selectors
├── storage/                    # AsyncStorage adapter
└── theme/                      # preference → resolved Paper theme mapping
```

- Route files only connect public exports from `@mobile/core/shell`.
- `core/shell` owns the global layout, preference, storage integration, and navigation presentation.
- `shared/ui` does not own providers, theme, navigation state, or storage.
- Actual Catalog and Profile screens move into domain `feature` libraries under their own specifications.

## Constitution check

- [x] Thin Expo Router routes, Nx boundaries, and public `src/index.ts` are respected.
- [x] No provider, router, HTTP, or storage access was added to a route or placeholder component.
- [x] All changes stay within the agreed shell scope.
