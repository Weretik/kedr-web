# Data model: Mobile app shell and navigation

## Theme preference

```text
ThemePreference
└── value: system | light | dark

ResolvedTheme
└── value: light | dark
```

## Invariants

- `ThemePreference` зберігає лише user choice; `ResolvedTheme` обчислюється з preference та `useColorScheme`.
- Некоректне або недоступне storage value повертається до `system`.
- `ResolvedTheme` не зберігається в AsyncStorage.

## Data boundary

AsyncStorage доступний лише через adapter `@mobile/core/shell`; route і
presentational components не імпортують його напряму.
