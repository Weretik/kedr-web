# Expo Go та Development Build

**Статус:** чинний workflow для `apps/mobile`  
**Пов'язані документи:** [технологічний стек](technology-stack.md),
[тестування](testing.md), [apps/mobile README](../../../apps/mobile/README.md)

## Поточний режим: Expo Go

Поки застосунок не потребує власного native runtime, щоденна розробка
залишається в Expo Go.

```powershell
cd apps/mobile
npx expo start
```

Відскануйте QR-код через Expo Go на Android. Команда `npx nx start mobile` з
кореня workspace також запускає Metro, але для QR-коду використовуйте
інтерактивний `npx expo start`: Nx може приховати QR-інтерфейс Expo.

Expo Go достатній для screens, styles, React/TypeScript, RTK Query, звичайних
JavaScript-залежностей і Fast Refresh.

## Коли потрібен Development Build

Перейдіть на Development Build, коли потрібно виконати код, який Expo Go не
містить у своєму native runtime, або коли змінюється native configuration:

- додано або оновлено library з native code;
- змінено `app.json`/app config, Android permissions, config plugin або native
  build configuration;
- оновлено Expo SDK;
- треба перевірити власну native capability на пристрої.

Не створюйте нову binary після звичайної зміни screen, стилів, RTK Query або
TypeScript-коду: вони надходять у вже встановлений Development Build через
Metro і Fast Refresh.

## Одноразовий перехід на Android Development Build

Цей репозиторій уже містить `apps/mobile/eas.json` з профілем `development`:
`developmentClient: true` і `distribution: internal`. Не запускайте
`eas build:configure`, поки не потрібно змінити цю конфігурацію.

1. Перевірте native dependencies перед першою binary:

   ```powershell
   cd apps/mobile
   npx expo-doctor
   ```

2. Встановіть development client у mobile application:

   ```powershell
   npx expo install expo-dev-client
   ```

3. Увійдіть до Expo та відправте cloud build. Якщо EAS CLI не встановлено
   глобально, використовуйте `npx`:

   ```powershell
   npx eas-cli@latest login
   npx eas-cli@latest build --profile development --platform android
   ```

4. Після завершення EAS Build відкрийте надане Expo посилання або QR-код та
   встановіть internal Android build на пристрій. Це буде власний development
   client застосунку, а не Expo Go.

EAS Build збирає Android binary у хмарі; Android Studio не потрібна для цього
cloud workflow. Android Studio потрібна лише для локальної native-збірки через
`npx expo run:android`.

## Щоденна робота після встановлення

```powershell
cd apps/mobile
npx expo start --dev-client
```

Відскануйте QR-код камерою пристрою або відкрийте посилання у встановленому
Development Build. Застосунок під'єднається до локального Metro server і
оновлюватиметься через Fast Refresh.

## Коли повторно збирати binary

Повторіть EAS Build лише після зміни native runtime: native library,
permissions, app/native config, config plugin або Expo SDK. Для UI, domain
logic, HTTP-клієнта, RTK Query та TypeScript повторна cloud binary не потрібна.

## Вартість і межі

EAS Build має безкоштовний план, але доступні build credits, швидкість черги та
умови можуть змінюватися. Перед регулярними cloud builds перевірте актуальні
ліміти в Expo; не фіксуйте в feature-spec кількість безкоштовних builds як
гарантію.

## Джерела

- [Expo: Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo: Switch from Expo Go to a development build](https://docs.expo.dev/develop/development-builds/expo-go-to-dev-build/)
- [Expo: Configure EAS Build with eas.json](https://docs.expo.dev/build/eas-json/)
- [Expo pricing](https://expo.dev/pricing)
