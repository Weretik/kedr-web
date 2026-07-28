# Research: Mobile app shell and navigation

| Питання | Рішення | Причина | Відхилені альтернативи |
| --- | --- | --- | --- |
| Root navigation | Expo Router group `(tabs)` | Він узгоджується з існуючим file-based router та thin route rule. | Ручний navigation state у shell. |
| Theme preference storage | AsyncStorage через `core/shell` adapter | Preference не є секретом і має переживати restart. | SecureStore: призначений для секретних даних. |
| Resolved theme | `preference` + `useColorScheme` | System theme реагує на системну схему без дубльованого persisted state. | Окремо зберігати resolved light/dark scheme. |
