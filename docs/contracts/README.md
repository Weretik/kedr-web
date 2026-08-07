# Frontend API-контракти

`docs/contracts/` — frontend-реєстр backend API-контрактів. Він фіксує, яку
операцію може викликати feature, як клієнт використовує результат і де міститься
машиночитаний source of truth.

Source of truth для frontend — versioned frontend-проєкція в цьому реєстрі. Не
копіюйте сюди OpenAPI YAML або backend DTO: документуйте лише frontend-рішення,
обмеження та мапінги. OpenAPI у репозиторії `KedrStore` можна вказати як
backend-довідку, коли він доступний, але його пошук, доступність і актуалізація
належать backend-власникам та не блокують frontend-роботу. Див.
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
- [Admin categories](admin/categories.md) — категорії для вибору та
  фільтрації mobile product catalog.

## Обов'язково перед роботою з API

AI та розробник, які додають або змінюють HTTP-виклик, спочатку читають:

1. Цей реєстр і сторінку потрібної операції.
2. [Правила інтеграції](integration.md).
3. За наявності — backend OpenAPI-файл у `KedrStore/docs/sdd/contracts/<module>/` як довідку.

Feature-local `contracts/api-contract.md` завжди посилається на сторінку цього
реєстру. Він пояснює застосування контракту в конкретній feature, але не є
другою копією API-специфікації.

## Обов'язковий вміст сторінки операції

Кожна сторінка операції в `docs/contracts/<backend-module>/` має містити:

1. Consumer і frontend-назву операції; доступний backend OpenAPI path та
   `operationId` можна вказати як довідку.
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

Ці приклади пояснюють реалізацію `data-access` і не є test fixtures. Не
вигадуйте fields або semantics, яких немає у frontend-проєкції контракту.

## Супровід

1. Коли backend-власник повідомив про зміну контракту, оновлюйте відповідну
   сторінку реєстру та фіксуйте вплив на client. Не шукайте й не змінюйте
   backend/OpenAPI-джерело в межах frontend-роботи.
2. Посилайтеся з feature `contracts/api-contract.md` на цю сторінку; feature
   spec не дублює transport DTO.
3. Розглядайте зміну route, parameter, response field або enum як compatibility
   change: зафіксуйте migration до використання зміни в client.
