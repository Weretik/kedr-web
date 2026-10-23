# Research: Mobile app shell and navigation

| Question                 | Decision                              | Rationale                                                                      | Rejected alternatives                            |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| Root navigation          | Expo Router group `(tabs)`            | It follows the existing file-based router and thin route rule.                 | Manual navigation state in the shell.            |
| Theme preference storage | AsyncStorage via `core/shell` adapter | The preference is not secret and must persist across restarts.                 | SecureStore: intended for secret data.           |
| Resolved theme           | `preference` + `useColorScheme`       | System theme responds to the system scheme without duplicated persisted state. | Store the resolved light/dark scheme separately. |
