# Feature specification: Mobile product catalog

**Створено:** 2026-07-28  
**Статус:** draft — API contract required before implementation  
**Домен:** `catalog`  
**Вхід:** мобільний каталог товарів із фото, пошуком, фільтрами, сортуванням і server-side pagination.

## User scenarios and testing

### User story 1 — Перегляд каталогу (Priority: P1)

Як покупець, я хочу переглядати товари у швидкому списку карток, щоб знайти потрібний товар на телефоні.

**Independent test:** у Expo Go відкрити «Каталог», прокрутити список товарів, відкрити наступну порцію і переконатися, що картки не дублюються та UI не зависає.

**Acceptance scenarios:**

1. Given API повертає товари, when користувач відкриває вкладку «Каталог», then бачить віртуалізований одноколонковий список `ProductCard` з фото, назвою, ціною та статусом наявності.
2. Given є наступна сторінка, when користувач натискає «Завантажити ще», then завантажується наступна порція без скидання вже показаних товарів.
3. Given API не повертає товарів, when завантаження завершено, then показується зрозумілий empty state українською.

### User story 2 — Пошук товарів (Priority: P2)

Як покупець, я хочу шукати товари за назвою або артикулом, щоб швидко знайти потрібну позицію.

**Independent test:** ввести запит у Searchbar, дочекатися debounce і перевірити, що показано лише server-side результат; очистити запит і перевірити перший список.

**Acceptance scenarios:**

1. Given каталог відкрито, when користувач вводить щонайменше погоджену кількість символів, then після debounce надсилається новий query і список починається з першої сторінки.
2. Given пошук не має збігів, when запит завершено, then показується empty state із дією «Очистити пошук».

### User story 3 — Фільтрація і сортування (Priority: P3)

Як покупець, я хочу застосувати фільтри та сортування, щоб звузити каталог до релевантних товарів.

**Independent test:** відкрити filters modal, застосувати категорію та один доступний filter; змінити sort; перевірити активні chips, query і reset pagination.

**Acceptance scenarios:**

1. Given доступні filter facets, when користувач застосовує значення, then список оновлюється server-side з першої сторінки, а активні фільтри показані Chip controls.
2. Given є активні фільтри або пошук, when користувач натискає «Скинути», then filters, search і pagination повертаються до default state.
3. Given користувач змінює sort, when вибір підтверджено, then список перезавантажується з першої сторінки та показує активне сортування.

## Edge cases

- Initial loading, loading next page, empty, error і offline мають окремі читабельні states; navigation і touch targets не перекриваються.
- Помилка наступної сторінки не прибирає вже завантажені картки; footer показує retry.
- Новий search/filter/sort query скасовує або ігнорує застарілу відповідь і скидає pagination.
- Дублікати товарів між сторінками дедуплікуються за `product.id`.
- Відсутнє фото показує погоджений fallback image; URL з API не обходить React Native image security patterns.
- Без API contract feature не реалізується: endpoint, facets, sort values і pagination cursor/page semantics мають бути погоджені.

## Requirements

- **FR-001**: Каталог використовує React Native `FlatList` і `ProductCard`, а не desktop table або Data Grid.
- **FR-002**: Картка показує лише погоджені domain fields: фото, назву, ціну, одиницю/формат ціни за наявності та availability state.
- **FR-003**: Search, filters, sort і pagination виконуються server-side; client не завантажує весь каталог для локальної фільтрації.
- **FR-004**: Searchbar, filter modal, active filter chips і sort menu використовують React Native Paper; icon-only controls мають українські accessible names.
- **FR-005**: Перший список і кожен змінений query завантажуються з початку; наступна сторінка додається до вже видимих карток без дублювання.
- **FR-006**: Route `/(tabs)/catalog` лишається thin Expo Router adapter до `@mobile/catalog/feature`.
- **FR-007**: DTO, API errors і pagination transport details не виходять із `@mobile/catalog/data-access`.

## Success criteria

- **SC-001**: Користувач у Expo Go може переглянути, знайти, відфільтрувати та відсортувати товари без desktop-table interaction.
- **SC-002**: На Samsung Galaxy A12 список із серверними сторінками прокручується без помітних пропусків або блокування touch interaction.
- **SC-003**: Search/filter/sort не створюють duplicate product cards і не показують застарілі результати.
- **SC-004**: Android Expo Go і web перевірки не містять console errors, перекритих safe areas або недоступних controls.

## Assumptions and dependencies

- `@mobile/core/shell` уже надає theme, store, connectivity, notification і tab route `/(tabs)/catalog`.
- Реальні API endpoint, filters, sort values, image fields, permissions і pagination semantics ще не надані — див. [API contract](contracts/api-contract.md).
- Detail product, cart, favorites, prices by customer group і analytics не входять у цю feature.
