# Фаза 04: Theme, providers та shell

**Статус:** completed  
**Залежить від:** фаза 03  
**Блокує:** фази 05–06

## Мета

Створити corporate light/dark тему React Native Paper на основі кольорів Admin,
підключити всі глобальні providers і сформувати мінімальний app shell.

## Рішення

- За референс береться `apps/admin/src/app/theme/palette.ts`: primary
  `#18b125`, light `#87d68e` / `#a3e0a8`, dark `#12871c` і відповідні text,
  surface та background кольори.
- Створюється Mobile theme mapping до Paper MD3 у `@mobile/core/shell`; MUI theme
  і CSS не імпортуються. `shared/ui` містить лише presentational-компоненти.
- `AppProviders` із `@mobile/core/shell` послідовно підключає `SafeAreaProvider`,
  Redux `Provider`, Paper `Provider` і глобальний Snackbar/error notifier.
- Root `_layout.tsx` містить лише `AppProviders` і Expo Router navigator.

## Архітектурна межа

`AppScreen` є частиною shell, оскільки застосовує global Paper theme і керує
safe area всього екрана. Тому `AppScreen`, `AppProviders`, theme mapping, Redux
store, notifier та їхні test mocks розміщуються у `@mobile/core/shell`.
`@mobile/shared/ui` призначений лише для повторно використовуваних
presentational-компонентів і не містить цих application-level налаштувань.

## Команди

```powershell
npx nx g @nx/expo:lib libs/mobile/core/shell --name=shell --importPath=@mobile/core/shell --linter=eslint --unitTestRunner=jest --tags="scope:mobile,domain:core,type:core"
npx nx g @nx/expo:component libs/mobile/core/shell/src/components/app-screen --name=app-screen --export
```

Генератор створює library і screen shell component; theme mapping, providers та
Expo Router layout пишуться вручну, оскільки для них немає окремого Nx generator.

## Критерії приймання

- [ ] App запускається з Paper theme і Safe Area.
- [ ] Є light/dark corporate palette без копіювання MUI component overrides.
- [ ] Стартовий screen показує назву застосунку та перевіряє navigation shell.
- [ ] Icon-only controls мають accessible name.

## Перевірка

- **Unit:** component test `AppProviders` / `AppScreen`.
- **Ручна:** light/dark режим, safe area і поворот/клавіатура на Android.
