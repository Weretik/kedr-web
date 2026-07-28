# Feature specification: Mobile app shell and navigation

**Створено:** 2026-07-28  
**Статус:** completed  
**Домен:** `shell`  
**Залежність:** завершена Mobile foundation

## User scenarios and testing

### User story 1 — Tab navigation (Priority: P1)

Як користувач, я хочу відкривати Головну, Каталог і Профіль через нижню
навігацію, щоб швидко переходити між кореневими розділами застосунку.

**Independent test:** у Expo Go відкрити root route, перейти на кожну вкладку
та переконатися, що active state і safe area не ламаються.

**Acceptance scenarios:**

1. Given застосунок відкрито, when root route завантажується, then показується Головна всередині tab shell.
2. Given tab shell відкрито, when користувач натискає Каталог або Профіль, then відкривається відповідний placeholder та active tab.

### User story 2 — Theme preference (Priority: P2)

Як користувач, я хочу вибрати System, Light або Dark theme, щоб інтерфейс
відповідав моїм системним або персональним налаштуванням.

**Independent test:** змінити theme preference, перезапустити застосунок і
перевірити, що вибір збережено.

**Acceptance scenarios:**

1. Given root tab screen, when користувач вибирає Light або Dark, then Paper theme змінюється негайно.
2. Given збережено preference, when застосунок перезапускається, then bootstrap відновлює її без flash неправильної теми.

### User story 3 — Resilient shell states (Priority: P3)

Як користувач, я хочу бачити зрозумілі shell states, щоб offline, loading або
порожні placeholders не перекривали navigation.

**Independent test:** вимкнути мережу або змоделювати bootstrap state і
перевірити header, content та tab bar у Expo Go і web.

## Edge cases

- AsyncStorage недоступний або повертає помилку: застосунок переходить на `system` і navigation не блокується.
- Під час відновлення preference shell показує стабільний loading state.
- Майбутні detail, auth та modal routes не показують root tab bar.

## Requirements

- **FR-001**: Root navigation повинна використовувати Expo Router group `(tabs)` із Головною, Каталогом і Профілем.
- **FR-002**: Tabs повинні мати українські labels, active state, icons і accessible names.
- **FR-003**: Theme preference повинна підтримувати `system | light | dark` та зберігатися через shell-owned adapter.
- **FR-004**: Header і tab bar повинні враховувати safe area та не конфліктувати з offline indicator.
- **FR-005**: Route-файли не повинні містити API, storage або domain business logic.

## Success criteria

- [x] **SC-001**: Користувач може відкрити кожну root tab і повернутися на Головну без помилок navigation.
- [x] **SC-002**: Theme preference відновлюється після restart без помітного неправильного theme flash.
- [x] **SC-003**: У погоджених Android Expo Go і web перевірках немає console errors або перекритих touch targets.

## Assumptions and dependencies

- `@mobile/core/shell` уже володіє `AppProviders`, Paper theme, Redux store і connectivity indicator.
- Реальні catalog, profile, cart, auth, analytics і deep links належать окремим feature specifications.

## Історія змін

- **2026-07-28 — implemented:** додано Expo Router group `(tabs)` з Головною, Каталогом і Профілем; shell-owned AsyncStorage adapter та bootstrap для налаштування теми `system | light | dark`; placeholder-екрани й доступні назви для tab controls. Перевірено TypeScript і unit-тести `shell`; ручну перевірку Expo Go/web ще не виконано.
- **2026-07-28 — in progress:** додано shell states для loading, empty і error, повторну дію для error та інтеграцію з наявним Snackbar. Залишилась ручна перевірка offline indicator на Android Expo Go і web.
- **2026-07-28 — completed:** ручна Android Expo Go та web verification підтверджені користувачем; `nx test shell`, `nx test mobile` і web export успішні. `expo-doctor` виявив дубль залежності `react-native-safe-area-context`, що зафіксовано як residual risk перед native production build.
