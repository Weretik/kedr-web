# Quickstart: <назва Mobile feature>

## Щоденна розробка через Expo Go

```text
npx nx start mobile
```

Відскануйте QR-код у Expo Go на Android або камерою iPhone. Пристрій і
комп'ютер мають бути в одній мережі. Після зміни TypeScript/JavaScript коду
Metro і Fast Refresh оновлюють застосунок без native rebuild.

Якщо LAN-з'єднання недоступне, запустіть Expo з tunnel із папки застосунку:

```text
cd apps/mobile
npx expo start --tunnel
```

## Автоматичні перевірки

```text
npx nx test mobile
cd apps/mobile
npx expo-doctor
```

За потреби перевірки web export:

```text
cd apps/mobile
npx expo export --platform web
```

## Ручна перевірка в Expo Go

1. <P1 user story — дія та очікуваний результат>
2. <loading / empty / error / offline state>
3. <Android/iOS safe area, TalkBack/VoiceOver, deep-link або web check>

## Коли Expo Go недостатньо

Зміна native dependency, Expo config або config plugin потребує development
build; не використовуйте Expo Go для такої перевірки. Зафіксуйте окремо спосіб
створення development build і погоджену платформу.

Порядок переходу, EAS cloud build, повторна збірка native binary та щоденний
запуск через `--dev-client` описані в
[Expo Go та Development Build](../../../architecture/mobile/development-build.md).
