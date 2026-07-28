# Implementation plan: Mobile app shell and navigation

**Spec:** [spec.md](spec.md)  
**Дата:** 2026-07-28

## Summary

Додати thin Expo Router `(tabs)` adapters та shell-owned bottom navigation,
header і persisted theme preference. Domain feature libraries не створюються:
ця поставка належить `@mobile/core/shell`.

## Technical context

- **Stack:** Expo SDK 56, React Native, Expo Router, React Native Paper, Redux Toolkit, AsyncStorage.
- **Testing:** Jest + React Native Testing Library, Android Expo Go, web export за потреби.
- **Target platforms:** Android і web; iOS перевіряється, коли погоджено пристрій.
- **Constraints:** safe area, offline indicator, no native dependency або app config change.

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

- Route-файли лише підключають public exports із `@mobile/core/shell`.
- `core/shell` володіє global layout, preference, storage integration і navigation presentation.
- `shared/ui` не володіє providers, theme, navigation state або storage.
- Реальні Catalog і Profile screens переходять у domain `feature` libraries у власних specifications.

## Constitution check

- [x] Thin Expo Router routes, Nx boundaries і public `src/index.ts` дотримано.
- [x] Не додано provider, router, HTTP або storage access у route чи placeholder component.
- [x] Усі зміни залишаються в погодженому shell scope.
