# Frontend API-контракти

`docs/contracts/` — frontend-реєстр backend API-контрактів. Він фіксує, яку
операцію може викликати feature, як клієнт використовує результат і де міститься
машиночитаний source of truth.

Source of truth — versioned OpenAPI-контракт у репозиторії `KedrStore`. Не
копіюйте сюди OpenAPI YAML або backend DTO: посилайтеся на точний source contract
і документуйте лише frontend-рішення, обмеження та мапінги. Це docs-as-code
підхід: OpenAPI залишається машиночитаним контрактом для генерації клієнтів і
валідації, а коротка документація consumer фіксує правила інтеграції. Див.
[OpenAPI Specification](https://spec.openapis.org/oas/latest.html) і
[OpenAI OpenAPI repository](https://github.com/openai/openai-openapi).

## Джерело контрактів

- Репозиторій: `KedrStore`.
- Агрегований entry point: `docs/sdd/contracts/openapi.yaml`.
- Frontend-конвенції: `docs/sdd/contracts/frontend-integration.md`.
- Контракти feature згруповані за backend-модулями у
  `docs/sdd/contracts/<module>/`.

## Вміст

- [Правила інтеграції](integration.md) — спільні правила transport,
  pagination, errors і відповідальності frontend-споживачів.
- [Admin products](admin/products.md) — контракт, який використовує mobile
  product catalog.

## Обов'язково перед роботою з API

AI та розробник, які додають або змінюють HTTP-виклик, спочатку читають:

1. Цей реєстр і сторінку потрібної операції.
2. [Правила інтеграції](integration.md).
3. Точний OpenAPI-файл у `KedrStore/docs/sdd/contracts/<module>/`.

Feature-local `contracts/api-contract.md` завжди посилається на сторінку цього
реєстру та source OpenAPI. Він пояснює застосування контракту в конкретній
feature, але не є другою копією API-специфікації.

## Обов'язковий вміст сторінки операції

Кожна сторінка операції в `docs/contracts/<backend-module>/` має містити:

1. Consumer, точний source OpenAPI path і `operationId`.
2. Method, path, security/access, request parameters або body та їх обмеження.
3. Розділ **«Канонічний HTTP-запит»** з реалістичним прикладом request відносно
   frontend base URL. Приклад не містить tokens, cookies, PII або production
   host.
4. Response shape, frontend mapping і розділ **«Канонічна форма
   JSON-відповіді»**. JSON приклад має містити всі поля success response, які
   потрібні consumer; значення мають бути явно позначені як ілюстративні.
5. Errors, pagination/idempotency, compatibility, обмеження contract і відомі
   blockers. Для errors із body посилайтеся на
   [нормалізацію та обробку помилок](integration.md#нормалізація-та-обробка-помилок)
   та додавайте canonical error response лише якщо operation має особливу форму.

Ці приклади пояснюють реалізацію `data-access`, але не замінюють OpenAPI і не
є test fixtures. Не вигадуйте fields або semantics, яких немає в source
contract.

## Супровід

1. Змінюйте OpenAPI-контракт у `KedrStore` першим або в межах тієї самої
   поставки.
2. Оновлюйте відповідну сторінку реєстру: точний source path і вплив на client.
3. Посилайтеся з feature `contracts/api-contract.md` на цю сторінку; feature
   spec не дублює transport DTO.
4. Розглядайте зміну route, parameter, response field або enum як compatibility
   change: зафіксуйте migration до використання зміни в client.
