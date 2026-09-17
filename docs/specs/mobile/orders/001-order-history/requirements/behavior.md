# Mobile order history — business rules and scenarios

## Business rules

### R-001 — Dedicated order navigation

Історія доступна з окремої вкладки «Замовлення» між «Кошик» і «Профіль»;
деталі відкриваються поверх tab shell і повертають менеджера до незміненої
історії.

### R-002 — Authoritative order summary

Картка використовує один list item із Sales orders API і показує номер,
snapshot-назву клієнта, статус, кількість товарних рядків, загальну суму та
дату/час. Додатковий customer request для картки не виконується.

### R-003 — Ukrainian order presentation

Статус завжди має погоджену українську назву й compact chip; сума відображається
як UAH у `uk-UA`, дата — у `Europe/Kyiv`, а кількість позицій має правильну
українську форму. Колір не є єдиною ознакою статусу.

### R-004 — One customer filter

Менеджер обирає одного активного клієнта з повного searchable списку або
«Усі клієнти». Ім'я є видимим значенням, `counterpartyId` — точним API-фільтром;
«Усі клієнти» вилучає параметр.

### R-005 — Session-only filter memory

Вибраний клієнт зберігається під час переходів між вкладками та деталями в
одній запущеній сесії, але не записується у persistent storage і після cold
start повертається до «Усі клієнти».

### R-006 — Explicit page accumulation

Перша сторінка замінює список, «Показати ще» додає наступну сторінку без
дублікатів за `orderId`, а після останньої сторінки дія зникає. Зміна/очищення
клієнта та refresh починають з першої сторінки.

### R-007 — Recoverable server states

Initial loading, empty, first-page error/offline, next-page error та refresh
мають стабільні видимі стани. Помилка наступної сторінки не прибирає вже
показані замовлення; retry виконується лише явною дією користувача.

### R-008 — Read-only authoritative detail

Деталі показують повернуті API номер, дату, клієнта, рядки, total, sync status
та optional comment, 1С document number і accepted time. Жодне поле не
редагується, а відсутні optional sections не створюють порожніх блоків.

### R-009 — Established mobile visual language

Екрани використовують централізовану React Native Paper theme, стандартну
типографіку застосунку, FlashList для довгих списків, safe area, доступні touch
targets і light/dark theme. Screenshot визначає лише карткову композицію.

## Status vocabulary

| API value      | Ukrainian label             | Semantic treatment |
| -------------- | --------------------------- | ------------------ |
| Pending        | Очікує на відправлення в 1С | warning            |
| Sent           | Надіслано до 1С             | informational      |
| Accepted       | Прийнято в 1С               | success            |
| BusinessError  | Помилка обробки             | error              |
| TransportError | Помилка з’єднання           | error              |
| RetryScheduled | Повторну спробу заплановано | warning            |
| DeadLetter     | Не вдалося синхронізувати   | error              |

## Acceptance scenarios

### SC-001 — Open order history from its tab

**Covers:** R-001, R-002, R-009

Given застосунок відкрито у tab shell
When менеджер натискає вкладку «Замовлення» між «Кошик» і «Профіль»
Then відкривається екран «Історія замовлень»
And перша newest-first сторінка показує картки з усіма summary fields.

### SC-002 — Read localized order summary

**Covers:** R-002, R-003

Given API повернув замовлення з UTC date, `lineCount`, `totalAmount` і sync status
When картка відображена
Then менеджер бачить київські дату й час, суму на кшталт `25 000,00 грн.` та
українську форму кількості позицій
And compact status chip містить погоджену українську назву.

### SC-003 — Search and select one customer

**Covers:** R-004, R-009

Given менеджер відкрив кнопку вибору клієнта
And повний список активних клієнтів завантажено
When менеджер вводить частину назви без урахування регістру й обирає результат
Then bottom sheet закривається, кнопка показує вибране ім'я
And історія починається з першої сторінки точного `counterpartyId`.

### SC-004 — Clear the customer filter

**Covers:** R-004, R-006

Given історія обмежена одним клієнтом
When менеджер обирає «Усі клієнти» або дію «Очистити фільтр»
Then кнопка показує «Усі клієнти»
And історія починається з першої сторінки без customer filter.

### SC-005 — Preserve and reset the session filter

**Covers:** R-005

Given менеджер вибрав клієнта
When він переходить до деталей чи іншої вкладки й повертається в тій самій
сесії
Then вибраний клієнт залишається активним
But після cold start видно «Усі клієнти».

### SC-006 — Load another order page

**Covers:** R-006

Given поточна сторінка менша за `totalPages` і завантаження не триває
When менеджер натискає «Показати ще»
Then наступна сторінка додається після наявних карток без дублікатів за
`orderId`
And після останньої сторінки дія «Показати ще» зникає.

### SC-007 — Retry a failed next page

**Covers:** R-006, R-007

Given історія вже містить замовлення
When наступна сторінка завершується network або server error
Then наявні картки залишаються видимими й footer пропонує повторити
And успішний retry додає саме потрібну сторінку без дублікатів.

### SC-008 — Refresh the active result set

**Covers:** R-004, R-006, R-007

Given історія відкрита з вибраним клієнтом або без нього
When менеджер виконує pull-to-refresh
Then завантажується перша сторінка з тим самим customer filter
And накопичений список замінюється свіжою першою сторінкою.

### SC-009 — Show an empty history

**Covers:** R-004, R-007

Given перша сторінка не містить замовлень
When customer filter відсутній
Then видно «Замовлень ще немає»
But з активним клієнтом видно «Для цього клієнта замовлень не знайдено» та
дію «Очистити фільтр».

### SC-010 — Recover from initial loading failure

**Covers:** R-007

Given першу сторінку не вдалося отримати або пристрій offline
When менеджер переглядає історію
Then видно безпечний український error/offline state з дією retry
And raw transport details або customer data не показуються.

### SC-011 — Recover customer selection

**Covers:** R-004, R-007

Given список клієнтів завантажується, порожній або завершився помилкою
When менеджер відкриває вибір клієнта
Then bottom sheet показує відповідний loading, empty або safe error state
And помилку можна повторити без зміни поточного order filter.

### SC-012 — Open one order detail

**Covers:** R-001, R-008

Given картка замовлення видима
When менеджер натискає картку
Then відкривається read-only екран цього `orderId` поверх tab shell
And системна дія «Назад» повертає до історії зі збереженим filter state.

### SC-013 — Read complete and sparse order details

**Covers:** R-003, R-008, R-009

Given API повернув деталі замовлення
When detail screen відображено
Then видно номер, київські дату/час, клієнта, український status chip, кожну
позицію з quantity та line amount і загальну суму
And непорожні comment, 1С document number та accepted time показуються, а
відсутні optional values не створюють порожніх секцій.

### SC-014 — Keep detail read-only

**Covers:** R-008

Given менеджер переглядає деталі
When він взаємодіє з позиціями та summary
Then немає дій зміни кількості, видалення, редагування, скасування чи sync retry
And server data лишається незміненою.

### SC-015 — Handle unavailable order details

**Covers:** R-007, R-008

Given detail request завантажується, завершився network/server error або
повернув not-found
When екран показує результат
Then loading має стабільний стан, retry доступний для recoverable error
And not-found показує «Замовлення не знайдено або воно більше недоступне» з
дією повернення до історії.

## Examples

| Input/state                               | Expected observable result                  |
| ----------------------------------------- | ------------------------------------------- |
| `totalAmount=25000`                       | `25 000,00 грн.`                            |
| `createdAtUtc=2026-09-17T11:35:00Z`       | `17.09.2026, 14:35` in `Europe/Kyiv`        |
| `lineCount=1`                             | `1 позиція`                                 |
| `lineCount=2`                             | `2 позиції`                                 |
| `lineCount=5`                             | `5 позицій`                                 |
| selected `counterpartyId=cp-1`            | first-page request contains exact `cp-1`    |
| «Усі клієнти»                             | request omits `counterpartyId`              |
| `comment=null`, `oneCDocumentNumber=null` | comment and 1С document sections are absent |

## Deferred scenarios

- Status/date/number/amount filters and custom sorting.
- Order editing, cancellation, duplication and sync retry.
- Automatic sync-status polling.
- Persistent customer filter across cold starts.
- Automated Mobile E2E until a separate runner/build/device enabler is approved.
