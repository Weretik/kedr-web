# Фаза 13 — Applied query chips

## Мета

Показувати застосований search query і всі активні параметри як компактні, читабельні та точково removable Paper chips над списком товарів.

- [x] C066. Після explicit search застосований `search` показується в тій самій horizontal scroll strip, що й активні filters/category/sort, над product list.
- [x] C067. Використовувати саме `Chip` з `react-native-paper` для кожного query value, з `onClose` та окремою українською accessibility label для хрестика; не замінювати його саморобним Pressable або text button.
- [x] C068. Chips мають compact density: одна строка, min-height не більша за Paper default, невеликі горизонтальні відступи та gap 8dp; вони не розтягують row і не виглядають як великі action buttons.
- [x] C069. Search chip: одне коротке слово показувати повністю. Для кількох слів або довгого query застосувати одно-рядкове truncation з ellipsis та обмеження ширини, щоб chip не займав непропорційно багато екрана; повне значення доступне через accessibility label.
- [x] C070. Close search chip скидає лише `search`, не змінюючи category, sort або інші filter fields; інші close actions зберігають точкову поведінку.
- [x] C071. Оновити `CatalogActiveFilters` і UI/reducer tests для search chip, truncation та окремого close.
- [x] C072. Привести наявні Paper chips до узгодженого вигляду: `compact`, `mode="outlined"`, `onClose`, `textStyle` 13sp, `maxWidth` для text truncation і horizontal strip з `paddingHorizontal: 16`, `paddingVertical: 8`, `gap: 8`. Не використовувати інший npm package.

## Acceptance

- [x] C078. In the light theme, the floating bottom-navigation pill uses the white theme surface. The dark theme retains its translucent themed surface.
- [x] C077. Android chip labels use `includeFontPadding: false` and `textAlignVertical: 'center'`, so the text optical center aligns with the close icon.
- [x] C076. The custom tab bar is absolutely positioned and transparent. A dedicated rounded, clipping wrapper contains `BottomNavigation.Bar`; only its 78% opaque surface is visible, so content is visible around and underneath the floating pill.
- [x] C075. The horizontal active-filter `ScrollView` has an explicit 40dp height and `flexGrow: 0` / `flexShrink: 0`; it must not consume the available screen height. The strip is only the chip row, with no visual frame or empty vertical area.
- [x] C074. Override Paper MD3 label margins for the catalog chips: fixed visual height 28dp, `marginVertical: 0`, 12sp/16dp label and 6dp strip padding. `compact` alone is insufficient because Paper otherwise adds vertical label margins.
- [x] C073. The navigator tab-bar wrapper is transparent and has no top border, elevation, or shadow. Only the oval `BottomNavigation.Bar` is translucent; page content remains visible around and below it.

1. Після пошуку над товарами з'являється Paper `Chip` з пошуковою фразою та хрестиком.
2. Короткий однословний query не обрізається; довгий або багатослівний — вміщується в один рядок з ellipsis, не витісняючи інші chips.
3. Усі applied values виглядають як компактна узгоджена strip, а не великі кнопки.
4. Закриття search chip видаляє тільки search query.

## Checkpoint

Не переходити до final delivery, доки C066–C071 не виконані й не перевірені.
