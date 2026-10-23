# Data model: Mobile app shell and navigation

## Theme preference

```text
ThemePreference
└── value: system | light | dark

ResolvedTheme
└── value: light | dark
```

## Invariants

- `ThemePreference` stores only the user choice; `ResolvedTheme` is computed from the preference and `useColorScheme`.
- An invalid or unavailable storage value falls back to `system`.
- `ResolvedTheme` is not stored in AsyncStorage.

## Data boundary

AsyncStorage is available only through the `@mobile/core/shell` adapter; routes
and presentational components do not import it directly.
