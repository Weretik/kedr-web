# Фаза 02 — User story P2: Theme preference

**Goal:** користувач обирає System, Light або Dark; вибір відновлюється після restart.  
**Independent test:** змінити preference, перезапустити Expo Go і перевірити resolved Paper theme.

- [x] T008 [US2] Додати ThemePreference state та selectors у `libs/mobile/core/shell/src/state/`.
- [x] T009 [US2] Додати ізольований AsyncStorage adapter у `libs/mobile/core/shell/src/storage/`.
- [x] T010 [US2] Додати preference-to-theme mapping і bootstrap у `libs/mobile/core/shell/src/theme/` та `providers/`.
- [x] T011 [US2] Додати header theme control із accessible label у `libs/mobile/core/shell/src/components/`.
- [x] T012 [US2] Додати unit tests для preference, restore fallback і resolved scheme.

## Checkpoint

Theme змінюється негайно, зберігається після restart, а storage failure повертає до System без блокування navigation.
