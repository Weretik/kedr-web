# Стратегія тестування Mobile

## Інструменти

Mobile використовує Jest з `jest-expo` та React Native Testing Library. Це
рекомендована Expo-конфігурація для тестів, що потребують mock нативних модулів.
Vitest залишається тестовим інструментом наявних web-застосунків і не є
підставою змішувати їхню конфігурацію з Expo.

| Рівень | Інструмент | Що перевіряємо |
| --- | --- | --- |
| Unit | Jest | Zod-схеми, mapper-и, domain інваріанти, error normalization |
| Component | Jest + React Native Testing Library | поведінка UI, доступні ролі/назви, callbacks, loading/empty/error/offline стани |
| Route integration | `expo-router/testing-library` | переходи й route guards після їх появи |
| E2E | Maestro, після першого повного критичного сценарію | запуск на пристрої, каталог, пошук, екран товару |

Тести не розміщуються в `apps/mobile/src/app`: кожен файл у цій папці Expo Router
трактує як маршрут. Тести розміщуються в `__tests__` або біля коду поза `app`.

## Мінімум для нової feature

- unit-тест mapper-а або Zod validation на API boundary;
- component-тест ключового стану або дії користувача;
- ручна перевірка на Android-пристрої для навігації, safe area й keyboard;
- E2E додається для критичного бізнес-сценарію, а не для кожного компонента.

Snapshot-тести не є обов'язковим критерієм: вони додаються лише коли сигнал від
такого тесту буде корисним для конкретного UI.
