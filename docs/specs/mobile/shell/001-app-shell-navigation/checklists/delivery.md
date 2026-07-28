# Delivery checklist: Mobile app shell and navigation

- [x] P1 tab navigation працює незалежно в Expo Go.
- [x] P2 theme preference зберігається та має storage-failure fallback.
- [x] P3 loading, empty, error і offline states не перекривають navigation або touch targets.
- [x] Route-файли лишаються thin; providers, storage і API не дубльовані.
- [x] Виконані `npx nx test mobile` і `npx expo-doctor` або причина записана.
- [x] Ручна Android Expo Go та застосовна web verification зафіксована.

## Recorded residual risk

`expo-doctor` виявив дві версії `react-native-safe-area-context` (`5.7.0` і `5.8.0`). Потрібна дедуплікація залежностей перед native production build.
