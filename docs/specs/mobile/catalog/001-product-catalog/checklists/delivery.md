# Mobile product catalog — delivery checklist

- [x] Реалізовані погоджені P1–P3 сценарії та loading/empty/error/offline стани.
- [x] Route тонкий; межі `model`, `data-access`, `ui` і `feature` дотримано.
- [x] DTO не виходять із `data-access`; немає deep imports або дубльованих providers.
- [ ] Перевірені safe area, accessible names, keyboard focus і Android/web behavior.
- [x] Виконані `npx nx test mobile`, `npx nx test mobile-catalog-model`, `npx nx test mobile-catalog-data-access`, `npx expo-doctor`, `npx expo export --platform web`; причина пропуску записана.
- [ ] Виконана ручна перевірка на Samsung Galaxy A12 і web.
- [x] API contract, manual checks і залишкові ризики зафіксовано.
