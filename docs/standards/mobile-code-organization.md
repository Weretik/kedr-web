# Mobile code rules

## Libraries and routing

- Розміщуйте domain-код у `libs/mobile/<domain>/{model,data-access,ui,feature}`.
- Route-файл у `apps/mobile/src/app` є thin Expo Router adapter: він підключає public screen із `feature` і не містить HTTP, storage або domain logic.
- Root providers, theme, store, connectivity і shell належать `@mobile/core/shell`; feature не створює їхні дублікати.
- `model` не залежить від React, HTTP, Expo Router або platform API.
- `data-access` володіє private DTO, mapper і RTK Query hooks; DTO та transport errors не виходять із library.
- `ui` отримує domain data й callbacks через props; він не імпортує API hooks, router або storage.

## Structure and platform APIs

- Один файл, screen і компонент має одну цілісну відповідальність.
- Screen оркеструє feature; список, card, toolbar і complex `renderItem` розділяйте за незалежною відповідальністю.
- Не створюйте `common`, `misc`, `helpers`, `utils` або `types` без доменного призначення.
- Server data, loading і API errors належать RTK Query; не дублюйте їх у reducer.
- Ізолюйте platform APIs: NetInfo — у connectivity adapter, SecureStore — у відповідному storage/auth adapter.
- Додавайте `*.ios.tsx`, `*.android.tsx` або `*.native.tsx` лише за реальною platform-відмінністю; не дублюйте shared logic.
