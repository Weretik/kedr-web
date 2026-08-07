# Feature specification: Вибір категорії у mobile catalog

**Створено:** 2026-07-31  
**Статус:** draft  
**Домен:** `catalog`  
**Вхід:** підключити API категорій до каталогу, щоб користувач обирав категорію та server-side фільтрував товари.

## User scenarios and testing

### User story 1 — Вибрати категорію (Priority: P1)

Як покупець, я хочу побачити доступні категорії у фільтрах каталогу та обрати
одну з них, щоб переглядати лише релевантні товари.

**Independent test:** у Expo Go відкрити «Каталог» → «Фільтри», дочекатися
дерева категорій, вибрати category і застосувати фільтри; перевірити request
products з її `categoryId`, active chip і першу сторінку результатів.

**Acceptance scenarios:**

1. Given categories API повертає valid rows, when користувач відкриває filters modal, then бачить локалізований вкладений selector не глибше трьох рівнів.
2. Given користувач обрав категорію і натиснув «Застосувати», when products query виконується, then він містить лише її `categoryId`, pagination скинуто до `1`, а в UI є active category chip.
3. Given користувач змінює вибір або скидає фільтри, when дія підтверджена, then наступний products query відображає актуальний category filter або не містить category parameter.

### User story 2 — Зрозумілий стан джерела категорій (Priority: P2)

Як покупець, я хочу розуміти, чи категорії ще завантажуються, відсутні або не
вдалося їх отримати, щоб не сприйняти технічний стан за відсутність фільтрів.

**Independent test:** замокати loading, empty та normalized error responses
для categories API й перевірити відповідний стан у filters modal та retry.

**Acceptance scenarios:**

1. Given categories request pending, when filters modal відкрито, then selector показує loading state і не дає обрати category до отримання даних.
2. Given API повертає `[]`, when loading завершено, then показується empty state без статичного списку категорій; інші filters лишаються доступними.
3. Given categories request завершився network/server error, when filters modal відкрито, then показується читабельний error state з retry і без raw HTTP body.

## Edge cases

- Закриття modal не скасовує вже вибрану застосовану category; незастосований draft не змінює products query.
- Повторне відкриття modal використовує RTK Query cache, але retry має виконати `refetch`.
- За відсутності mobile locale застосувати чинний locale fallback; не показувати DTO `name` як припущений переклад.
- Некоректна tree-структура (`parentId`, cycle, `level`) або глибина понад 3 не має спричиняти crash чи некоректний product request.
- Error categories не прибирає вже завантажені product cards; доступні не-category filters лишаються придатними.

## Requirements

- **FR-001**: Система повинна отримувати category rows тільки через `GET /api/categories` із зафіксованого [frontend-контракту](../../../../contracts/admin/categories.md).
- **FR-002**: `data-access` повинен перетворювати private DTO у `CatalogCategoryOption[]` і впорядковувати sibling categories за `sortOrder`, потім `id`.
- **FR-003**: Selector має показувати локалізовану short name у згортаному tree до трьох рівнів у прокручуваному filters modal, loading, empty і normalized error/retry states; статичний список категорій заборонений.
- **FR-004**: Після Apply обрана category передається в наявний `GET /api/admin/products` тільки як valid `categoryId`; зміна або очищення category скидає products page до `1`.
- **FR-005**: Feature повинна зберегти чинні межі `model`, `data-access`, `ui`, `feature`, public `src/index.ts` і thin route `/(tabs)/catalog`.
- **FR-006**: Category controls мають українські accessible labels і не блокують застосування інших documented filters, коли categories list empty або unavailable.

## Success criteria

- **SC-001**: На Android Expo Go користувач може вибрати, змінити й очистити category filter без вручну введеного ID або статичних options.
- **SC-002**: Кожна застосована зміна category створює один server-side products query з `page=1` і без duplicate product cards.
- **SC-003**: Loading, empty, error та malformed-tree responses не спричиняють crash і мають перевірені UI states.

## Assumptions and dependencies

- Наявна feature `001-product-catalog` уже має `CatalogQuery`, category selector stub, reducer і products serialization з `categoryId`.
- `GET /api/categories` — адміністративний endpoint; backend-власник має підтвердити його access policy для mobile consumer до production rollout.
- Product query accepts `categoryId`; category detail page, deep links, persisted filters і public localized category tree не входять у scope.

## Історія змін

- 2026-07-31: Створено SDD з окремим contract projection для categories API; код не реалізовано.
- 2026-07-31: Category selector оновлено до scrollable accordion tree: parent nodes згортаються, а selection лишається окремою дією.
