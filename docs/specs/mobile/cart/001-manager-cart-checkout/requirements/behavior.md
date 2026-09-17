# Mobile manager cart checkout — business rules and scenarios

## Business rules

### R-001 — Persisted cart

Товарні рядки зберігаються між перезапусками застосунку, доки менеджер не
видалить їх або backend не підтвердить створення замовлення.

### R-002 — Quantity and stock boundary

Кількість є додатним цілим числом, не перевищує останній відомий залишок;
зменшення нижче одного не відбувається, а видалення є окремою явною дією.

### R-003 — Deterministic totals

Ціна одиниці не редагується. Сума рядка дорівнює `unitPrice × quantity`, а
загальна сума — сумі всіх рядків без доставки, податків чи інших нарахувань.

### R-004 — Complete local customer search

Перед пошуком застосунок отримує повний набір активних клієнтів доступними
сторінками. Пошук за назвою ігнорує регістр та крайні пробіли.

### R-005 — Minimal checkout input

Для оформлення менеджер обирає одного клієнта і може додати коментар до 1000
символів. Технічні поля рядків формуються з кошика і не редагуються вручну.

### R-006 — Idempotent order creation

Одна незмінена create action має один UUID idempotency key. Паралельна відправка
неможлива; безпечний retry того самого payload використовує той самий ключ.

### R-007 — Backend-authoritative errors

Frontend виконує лише мінімальні перевірки, а normalized backend field і
business errors показуються без raw transport details та без втрати введених
даних.

### R-008 — Confirmed success cleanup

Лише підтверджений `200` або `201` показує номер замовлення і `Pending`, очищає
кошик та закриває форму. Помилка локального очищення не повторює HTTP create.

### R-009 — Established mobile interaction

Екран і нижні панелі використовують корпоративну тему, доступні touch targets,
безпечну роботу клавіатури й готові mobile controls без перенесення доставки,
податків або оплати з візуального референсу.

## Acceptance scenarios

### SC-001 — Restore persisted cart

**Covers:** R-001

Given менеджер раніше додав товари до кошика
When застосунок запускається повторно і локальний стан відновлено
Then у вкладці «Кошик» видно ті самі товарні рядки та кількість
And загальна сума відповідає відновленим даним.

### SC-002 — Show an empty cart

**Covers:** R-001, R-009

Given збережених товарних рядків немає
When менеджер відкриває вкладку «Кошик»
Then видно український empty state
And оформлення замовлення недоступне.

### SC-003 — Change quantity within stock

**Covers:** R-002, R-003

Given рядок має quantity менше останнього відомого stock
When менеджер збільшує або зменшує quantity
Then quantity змінюється на одну одиницю в допустимих межах
And сума рядка та загальна сума одразу перераховуються і зберігаються.

### SC-004 — Stop at the stock boundary

**Covers:** R-002

Given quantity дорівнює останньому відомому stock
When менеджер переглядає control збільшення
Then збільшення недоступне і причина доступна assistive technology
And quantity та суми не змінюються.

### SC-005 — Remove a cart line

**Covers:** R-001, R-003

Given кошик містить кілька товарів
When менеджер видаляє один рядок
Then цей товар зникає з кошика
And загальна сума та persisted cart містять лише решту рядків.

### SC-006 — Find and select a customer

**Covers:** R-004, R-005

Given повний список активних клієнтів завантажено
When менеджер вводить частину назви без урахування регістру
Then список показує лише відповідні назви
And вибір одного результату заповнює поле клієнта та закриває selector.

### SC-007 — Handle customer loading failure

**Covers:** R-004, R-007

Given список клієнтів не вдалося завантажити або пристрій offline
When менеджер відкриває вибір клієнта
Then видно безпечний error або offline state з retry
And створення замовлення без клієнта недоступне.

### SC-008 — Validate checkout locally

**Covers:** R-005, R-007

Given кошик не порожній, але клієнт не вибраний або коментар довший за 1000
символів
When менеджер намагається створити замовлення
Then запит не відправляється
And відповідне поле має зрозумілу українську помилку.

### SC-009 — Submit one order once

**Covers:** R-003, R-005, R-006

Given кошик валідний, клієнт вибраний і мережа доступна
When менеджер підтверджує оформлення
Then відправляється один запит із клієнтом, коментарем, cart lines і одним
idempotency key
And submit залишається недоступним до завершення відповіді.

### SC-010 — Retry the same failed action safely

**Covers:** R-006, R-007

Given результат create невідомий через network або server failure
And manager не змінив клієнта, коментар чи кошик
When менеджер повторює відправлення
Then повторюється той самий payload із тим самим idempotency key
And форма та кошик залишаються заповненими до підтвердженого успіху.

### SC-011 — Show backend validation or conflict

**Covers:** R-007

Given backend повертає validation, not-found або idempotency conflict
When відповідь нормалізовано
Then field error прив'язаний до відомого поля або видно безпечне загальне
повідомлення
And кошик, клієнт і коментар не втрачаються.

### SC-012 — Complete a created order

**Covers:** R-008

Given backend повернув `200` replay або `201` created
When результат оброблено
Then менеджер бачить `orderNumber` і статус `Pending`
And форма закривається, а in-memory і persisted cart очищаються без повторного
create.

### SC-013 — Preserve success when local cleanup fails

**Covers:** R-008

Given backend уже підтвердив створення замовлення
When локальне очищення storage завершується помилкою
Then результат замовлення лишається успішним і повторна відправка недоступна
And менеджер бачить безпечне повідомлення про локальне очищення.

## Examples

| Input/state                          | Expected observable result     |
| ------------------------------------ | ------------------------------ |
| `unitPrice=125`, `quantity=2`        | line amount `250 грн.`         |
| `quantity=stock`                     | increase disabled              |
| search `  кліЄнТ  `                  | names containing `клієнт`      |
| `201`, `SO-20260917-0001`, `Pending` | success, receipt, cart cleared |
| retry unchanged payload              | same idempotency key           |
| payload changed before retry         | new create action and new key  |

## Deferred scenarios

- Перерахунок цін за вибраним клієнтом.
- Ручне редагування ціни або line amount.
- Backend-authoritative stock validation.
- Production Mobile authentication and authorization.
- Order history, details, sync polling and manual 1C retry.
