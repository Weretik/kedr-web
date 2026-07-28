# Quickstart: Mobile product catalog

## Щоденна розробка через Expo Go

```text
npx nx start mobile
```

Відкрити Expo Go на Samsung Galaxy A12 у тій самій LAN мережі. Якщо LAN
недоступний, зафіксувати tunnel failure або використати погоджений network workaround.

## Автоматичні перевірки

```text
npx nx test mobile
npx nx test catalog
cd apps/mobile
npx expo-doctor
npx expo export --platform web
```

## Ручна перевірка в Expo Go

1. Відкрити Каталог; перевірити initial loading, `ProductCard`, safe area та scroll.
2. Завантажити наступну порцію; перевірити відсутність duplicate cards і footer retry error state.
3. Ввести/очистити search; застосувати/скинути filter і sort; перевірити reset pagination.
4. Вимкнути мережу; перевірити offline indicator і читабельний existing-data/error state.
5. Повторити у web і перевірити console errors, keyboard interaction та два стовпці, якщо вони погоджені.

## Коли Expo Go недостатньо

P1 не додає native dependency або config plugin; Expo Go достатній. Якщо після
profiling погоджено FlashList або іншу native capability, перевірити її Expo Go
сумісність і за потреби створити development build.
