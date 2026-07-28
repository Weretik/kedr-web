# Mobile UI rules

## Components and theme

- Видимі рядки, accessible names і feature specs пишіть українською.
- Використовуйте React Native Paper для складних controls і стандартні React Native components для простого layout.
- Theme, colors, typography та spacing належать централізованій Paper theme; feature не створює локальні design tokens або providers.
- Для списків використовуйте `FlatList` і mobile cards; не переносіть desktop Admin tables на mobile screen.

## States and accessibility

- Екран із server data визначає застосовні `loading`, `success`, `empty`, `error` та `offline` states.
- Error/offline state показує зрозуміле повідомлення та retry-дію, якщо вона можлива.
- Враховуйте safe area, keyboard, touch targets, TalkBack/VoiceOver та accessibility label для icon-only controls.
- Перевіряйте погоджені Android, iOS і web відмінності; не припускайте однакову поведінку платформ.
