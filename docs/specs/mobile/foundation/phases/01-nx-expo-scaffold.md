# Фаза 01: Nx та Expo scaffold

**Статус:** completed  
**Залежить від:** —  
**Блокує:** фази 02–06

## Мета

Додати до workspace офіційний Nx Expo plugin і згенерувати TypeScript Expo app,
не створюючи каркас вручну.

## Команди

```powershell
npx nx add @nx/expo
npx nx g @nx/expo:app apps/mobile --name=mobile --displayName="KEDR Mobile" --linter=eslint --unitTestRunner=jest --tags="scope:mobile,type:app" --useProjectJson
npx nx show project mobile
```

Перед виконанням генератора перевірити його доступні параметри у встановленій
версії, а не припускати їх:

```powershell
npx nx g @nx/expo:app --help
```

## Межі

- Генератор створює `apps/mobile` і сумісні Expo залежності.
- Не редагувати вручну згенеровані native проєкти: їх у цій фазі не створюємо.
- Не додавати Router, domain libraries або API-код.

## Критерії приймання

- [x] `@nx/expo` має ту саму версію, що й Nx workspace.
- [x] Є `apps/mobile`, `app.json` і Nx project configuration.
- [x] `npx nx show project mobile` показує Expo targets.
- [x] `npx expo-doctor` з каталогу app не повідомляє про несумісні залежності.

## Перевірка

- **Lint:** `npx nx lint mobile`
- **Unit:** `npx nx test mobile`
- **Run:** `npx nx start mobile`
- **Ручна:** Expo Go відкриває generated starter на Android-пристрої.

## Результат виконання

- Додано `@nx/expo` 23.1.0, що відповідає версії Nx workspace, і згенеровано
  TypeScript-застосунок `apps/mobile` з тегами `scope:mobile,type:app`.
- Генератор створив Expo targets, ESLint та Jest starter без native-проєктів,
  Router, domain libraries або API-коду.
- Сумісність Expo SDK 56 зафіксована для `react` 19.2.3,
  `react-native-svg` 15.15.4 і `react-test-renderer` 19.2.3.
- Успішно виконано `npx nx show project mobile`, `npx nx lint mobile`,
  `npx nx test mobile` (1 test suite, 1 test) та `npx expo install --check`.
- `npx expo-doctor` не виявив несумісних залежностей. Єдине повідомлення —
  відсутність lock-файлу в `apps/mobile`: у workspace використовується спільний
  кореневий `package-lock.json`, який ця перевірка з каталогу app не знаходить.
- Ручний Android-запуск відкладено: на пристрої встановлено Expo Go 54.0.8,
  що підтримує лише SDK 54. Для перевірки starter потрібен Expo Go для SDK 56.
