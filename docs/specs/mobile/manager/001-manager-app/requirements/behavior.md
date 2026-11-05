# Kedr Manager — rules and scenarios

Visible strings are Ukrainian; this document is English like the rest of the repository.

## Rules

### R-001 — Same accounts as the Kedr Admin

Staff (Manager, Admin) sign in with the Admin email and password. Other accounts see «Немає доступу» and can only sign out.

### R-002 — Work starts from a customer

Until a customer is chosen, «Товари», «Розрахунок» and «Замовлення» are locked; «Клієнт» and «Кабінет» are open. The chosen customer is visible on every working screen and can be changed at any time. The last chosen customer is restored after a restart.

### R-003 — Customer search

Customers are found while typing by name, phone or code; the list also offers recent customers and an A–Я list. Search works offline.

### R-004 — Customer card and debt placeholder

The card shows name, phone, email, default price type and category price rules, «Заборгованість» and «Взаєморозрахунки», and the customer's orders and drafts. While 1C sends no debt data both values show «—» with one line saying they will come from 1C; nothing else depends on them.

### R-005 — Customer prices everywhere

Product list, detail and calculation show only the chosen customer's price: the price type of the customer's rule on the product's category, else on the nearest parent category, else the default price type (as KedrStore R-001 of `sales/008`). A product without a price shows «Ціну уточнюйте» and cannot be added.

### R-006 — Out of stock cannot be added

A product with zero stock shows «немає в наявності» and its add buttons are disabled in the list and the detail. A quantity above stock is limited to the stock and explained.

### R-007 — Products

Products can be searched by name or code, narrowed by category and subcategory, filtered by «лише в наявності», and sorted by name or price. Product detail shows name, code, category, stock, description and characteristics, without SEO texts.

### R-008 — Photos and scheme are large and clear

Detail shows all product photos and the scheme on a white frame at the largest size the screen allows; the scheme is labeled «Схема» and never cropped. Any photo or the scheme opens full screen with pinch zoom, double tap zoom and swipe between images. Thumbnails of all products and all schemes are available offline; a large photo is available offline after it was opened once or after «Завантажити всі фото».

### R-009 — Calculation per customer

Each customer has its own calculation. Lines have quantity and a per-unit discount or markup in UAH (minus = discount in red, plus or bare number = markup in green). A discount may not take the unit price below 1 UAH; the line says why. The footer shows the adjustment total and the total.

### R-010 — Drafts

A calculation can be saved as a named draft of that customer, opened, changed, deleted, or turned into an order. Saving works offline and goes through the send queue.

### R-011 — Send to 1C

«Відправити в 1С» sends the calculation as an order. Online, the server quote is checked first and the order is created with an idempotency key. Offline, the order enters the send queue, shows «У черзі», and is sent automatically when the network returns. A retry never creates a second order.

### R-012 — Server rejections are explained

If the server rejects a queued or online order or draft (price changed, stock changed, discount below minimum, customer unavailable), the calculation returns to the manager with the server's reason and the changed lines highlighted; nothing is lost and nothing is sent silently with other numbers.

### R-013 — Orders

For the chosen customer the manager sees orders (number, date, 1C status, sum) and drafts; an order opens with its lines and adjustments. Who sees which orders follows the Admin rules.

### R-014 — Offline mode

Without network the manager can sign in with the saved session (up to 7 days since the last successful refresh), choose a customer, browse products, photos and schemes, build calculations, save drafts and queue orders. The app shows «Без мережі · дані від HH:MM» and the queue size; it does not show a red error for normal offline work.

### R-015 — Sync

Catalog, prices, customers and the customer's recent orders refresh on sign-in, on start, when the network returns, every 15 minutes while online, and on «Оновити дані зараз». The first sync shows progress; later syncs never block work.

### R-016 — Cabinet

Everyone sees their photo (or initials), name, role and email and can change their photo and name. An Admin can also change email and password with the current password, as in the Admin. The cabinet shows the last sync time, the send queue, theme choice, quick unlock and «Вийти». Signing out with a non-empty queue asks for confirmation.

### R-017 — Tablet

On tablets the app works in both orientations: a side rail instead of the tab bar; list and detail side by side; on wide screens the calculation is always visible next to the products, and photo and scheme stand side by side on product detail.

## Scenarios

### SC-001 — Sign in with Admin credentials

**Covers:** R-001

Given a manager account that works in the Kedr Admin
When the manager enters the same email and password and taps «Увійти»
Then the customer choice screen opens and «Товари», «Розрахунок», «Замовлення» show a lock

### SC-002 — Non-staff account

**Covers:** R-001

Given an account without Manager or Admin role
When it signs in
Then «Немає доступу» is shown with «Вийти» only

### SC-003 — Customer gate

**Covers:** R-002

Given no customer is chosen
When the manager taps «Товари»
Then nothing opens and the customer choice stays on screen

### SC-004 — Choose a customer by typing

**Covers:** R-002, R-003

Given customers «ТОВ «Будмаркет»» and «Будсервіс-Захід» are synced
When the manager types «буд» (offline or online)
Then both appear; tapping «ТОВ «Будмаркет»» shows it in the customer bar and unlocks the tabs

### SC-005 — Customer card with placeholder debt

**Covers:** R-004, R-013

Given a chosen customer
When the manager opens the customer card
Then name, phone, email, price type and rules are shown, «Заборгованість» and «Взаєморозрахунки» show «—» with the 1C note, and the segmented control switches between orders and drafts

### SC-006 — Customer price by category rule

**Covers:** R-005

Given a customer with default «Опт 2» and a rule «Ручки → Опт 3»
When the manager opens a product of a subcategory of «Ручки»
Then the price shown is the «Опт 3» price, and products outside «Ручки» show the «Опт 2» price

### SC-007 — Out of stock product

**Covers:** R-006

Given a product with zero stock
When it appears in the list or detail
Then it says «немає в наявності» and its add buttons are disabled

### SC-008 — Find a product

**Covers:** R-007

Given the catalog is synced
When the manager types a code or part of a name, picks a category and turns on «лише в наявності»
Then only matching in-stock products of that category and its subcategories are listed

### SC-009 — Scheme full screen

**Covers:** R-008

Given a product with three photos and a scheme
When the manager taps «Схема» and then the full-screen button
Then the scheme fills the screen on white, can be zoomed with two fingers and by double tap, and swiping goes back to the photos

### SC-010 — Photos offline

**Covers:** R-008, R-014

Given thumbnails and schemes were downloaded on Wi‑Fi
When the manager opens a product without network
Then the thumbnail and scheme are shown; a large photo never opened before shows the thumbnail with «Фото буде доступне з мережею»

### SC-011 — Discount and markup

**Covers:** R-009

Given a line at 412 ₴ × 4
When the manager enters −10 in «± ₴/шт»
Then the line shows −10 in red and 1 608 ₴, and the footer adjustment total shows −40 ₴

### SC-012 — Discount below 1 UAH

**Covers:** R-009

Given a product priced 5 ₴
When the manager enters −5
Then the field explains that the price cannot go below 1 ₴ and the largest allowed discount is −4

### SC-013 — Separate calculations

**Covers:** R-009, R-002

Given a calculation for «Будмаркет» with 3 lines
When the manager switches to «Лісбуд» and back
Then «Лісбуд» has its own calculation and «Будмаркет» still has its 3 lines

### SC-014 — Save and reopen a draft

**Covers:** R-010

Given a calculation
When the manager saves it as a draft (online or offline) and later opens it from the customer's drafts
Then the lines, quantities and adjustments are restored and can be changed or sent

### SC-015 — Send online

**Covers:** R-011

Given network and a valid calculation
When the manager taps «Відправити в 1С» and confirms the total
Then the order is created once, the calculation is emptied, and the order appears in the customer's orders with its 1C status

### SC-016 — Send offline and deliver later

**Covers:** R-011, R-014

Given no network
When the manager taps «Відправити в 1С»
Then the order shows «У черзі», the queue counter shows 1, and after the network returns the order is sent once and its status updates without the manager acting

### SC-017 — Rejected queued order

**Covers:** R-012

Given a queued order whose price changed on the server
When the queue sends it
Then the order is not created, the manager sees the reason and the changed lines in the calculation, and can send again after review

### SC-018 — Offline start within 7 days

**Covers:** R-014

Given the last successful refresh was 3 days ago
When the app starts without network
Then it opens with the saved session and «Без мережі · дані від …»

### SC-019 — Offline start after 7 days

**Covers:** R-014

Given the last successful refresh was 8 days ago
When the app starts
Then the password is asked; queued orders and drafts are kept and sent after sign-in

### SC-020 — Sync does not block work

**Covers:** R-015

Given a synced device
When a periodic sync runs while the manager edits a calculation
Then the screen stays usable and new prices or stock apply after the sync finishes

### SC-021 — Manager cabinet

**Covers:** R-016

Given a manager
When the manager opens «Кабінет»
Then photo or initials, name, role «Менеджер» and email are shown, photo and name can be changed, email and password cannot

### SC-022 — Admin cabinet

**Covers:** R-016

Given an admin
When the admin changes email or password
Then the current password is required and the change is confirmed before it is sent

### SC-023 — Sign out with a queue

**Covers:** R-016

Given one order in the queue
When the manager taps «Вийти»
Then the app warns that the queued order will be lost and signs out only after confirmation

### SC-024 — Tablet landscape

**Covers:** R-017

Given a tablet in landscape with a customer chosen
When the manager opens «Товари»
Then the rail, the product table and the calculation panel are on screen together, and «+» adds to the visible calculation

### SC-025 — Tablet product detail

**Covers:** R-017, R-008

Given a tablet in landscape
When the manager opens a product
Then the photo and the scheme are shown side by side, each with a full-screen button

## Deferred

- Real debt and settlement values (when 1C sends them).
- Delta sync (only if snapshots grow beyond about 5 MB compressed).
- Push notifications about 1C status changes.
