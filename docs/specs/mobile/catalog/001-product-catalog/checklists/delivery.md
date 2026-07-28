# Mobile product catalog — delivery checklist

- [ ] Реалізовані погоджені P1–P3 сценарії та loading/empty/error/offline стани.
- [ ] Route тонкий; межі `model`, `data-access`, `ui` і `feature` дотримано.
- [ ] DTO не виходять із `data-access`; немає deep imports або дубльованих providers.
- [ ] Перевірені safe area, accessible names, keyboard focus і Android/web behavior.
- [ ] Виконані `npx nx test mobile`, `npx nx test catalog`, `npx expo-doctor`, `npx expo export --platform web`; причина пропуску записана.
- [ ] Виконана ручна перевірка на Samsung Galaxy A12 і web.
- [ ] API contract, manual checks і залишкові ризики зафіксовано.
