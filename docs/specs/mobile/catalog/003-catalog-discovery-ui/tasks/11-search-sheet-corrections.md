# Фаза 11 — Коригування search sheet

## Мета

Зробити історію пошуку керованою та усунути перекриття контенту клавіатурою, не змінюючи API або контракт збереження історії.

- [x] C053. Entries «Нещодавні пошуки» відображаються як нейтральні темні/`onSurface` рядки, а не green action buttons; кожен entry має доступний control з іконкою хрестика для видалення лише цієї фрази.
- [x] C054. Біля заголовка «Нещодавні пошуки» розмістити action «Очистити», який видаляє всю локальну історію після натискання.
- [x] C055. Виправити keyboard layout search sheet: поле, історія та control запуску пошуку лишаються у межах scrollable sheet, без білого overlay/frame над історією або нижніми actions.
- [x] C056. Прибрати окрему кнопку «Застосувати». Додати у search input trailing search icon кольору `primary`; натискання на неї та Submit з клавіатури запускають той самий explicit search.
- [x] C056a. Використати варіант 1 «спокійна search bar»: filled `surfaceVariant` container 52–56dp з великою скругленістю і без помітної outline; нейтральна leading лупа, звичайний `onSurface` текст, primary trailing submit icon. Якщо є введений текст — показати окремий control `×` для очищення input.
- [x] C057. Додати до history storage/controller/reducer точкове видалення phrase і clear-all, оновити UI tests/mocks.

## Acceptance

1. Користувач може видалити один recent search хрестиком або всю історію «Очистити».
2. Після фокусу input та появи клавіатури немає білого перекриття; історія доступна через scroll, а поле лишається usable.
3. Окремої Apply-кнопки немає. Primary search icon у полі та клавіатурний Submit застосовують той самий запит.
4. Search bar не виглядає як form field: це м'яка filled surface без outline, з нейтральною лупою зліва та primary submit справа.
5. Історія зберігає чинні правила: нормалізація, case-insensitive deduplicate, максимум 10 лише після explicit search.

## Checkpoint

Не переходити до наступного delivery, доки C053–C057 не виконані й не перевірені.
