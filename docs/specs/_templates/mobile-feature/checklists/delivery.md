# <назва Mobile feature> — delivery checklist

- [ ] Реалізовані погоджені сценарії та loading/empty/error/offline стани.
- [ ] Route тонкий; межі `model`, `data-access`, `ui` і `feature` дотримано.
- [ ] DTO не виходять із `data-access`; немає deep imports або дубльованих providers.
- [ ] Перевірені safe area, accessible names, focus і platform behavior.
- [ ] Виконані `npx nx test mobile`, `npx expo-doctor` та, за потреби, `npx expo export --platform web`; причина пропуску записана.
- [ ] Виконана ручна перевірка на погоджених Android/iOS/web середовищах.
- [ ] Зазначені ручні перевірки та залишкові ризики.
