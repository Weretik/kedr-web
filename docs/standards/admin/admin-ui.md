# Admin UI rules

Композицію списків, деталей і посилань повернення визначає [єдиний стиль сторінок Admin](list-detail-pages.md).

## Language and components

- Видимі рядки, accessible names, empty/error messages і feature specs пишіть українською.
- Локалізуйте всі MUI controls і MUI X Data Grid мовою застосунку централізовано
  в `apps/admin/src/app/theme/admin-theme.ts`: зараз це `materialUkUA` та
  `dataGridUkUA`, передані в `createTheme`; відсутні в локалі підписи доповнюйте
  там само (зараз `columnMenuAriaLabel`). `AppProviders` підключає цю тему до
  всіх сторінок Admin. Заголовки колонок і власні кнопки залишаються українськими;
  не дублюйте `localeText` у кожній таблиці. Кореневий `apps/admin/index.html`
  має `lang="uk"` для мови документа й допоміжних технологій.
- Використовуйте наявні MUI patterns і theme; не створюйте локальні design tokens без потреби.
- Для table, dialog, select, pagination та інших складних business controls використовуйте наявні MUI components.
- Не змінюйте глобальні стилі, theme або routing заради локальної feature.

## States and accessibility

- Кожен екран із server data визначає застосовні `loading`, `success`, `empty`, `error` та `forbidden` states.
- Error state показує зрозуміле повідомлення без transport details і доступну retry-дію, якщо вона можлива.
- Інтерактивні елементи мають semantic HTML, keyboard navigation, visible focus і доступне ім'я.
- Icon-only control має `aria-label` або наявний еквівалент.
- Звіряйте layout, світлу й темну схеми та breakpoints за кодом теми і компонентів.
  Відкривати браузер для перевірки можна лише після окремого запитання й прямого
  дозволу користувача на конкретну браузерну перевірку.
