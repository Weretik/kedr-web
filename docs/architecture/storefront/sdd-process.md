# SDD-процес Storefront

## Перед реалізацією

1. Визначити домен і цільову бібліотеку за [domains.md](domains.md).
2. Перевірити напрямок залежностей у [dependencies.md](dependencies.md).
3. Якщо змінюються стан, API, локаль або SSR-поведінка — звіритися зі
   [state-and-api.md](state-and-api.md) та [decisions.md](decisions.md).
4. Створити специфікацію в `docs/specs/storefront/<domain>/` до початку роботи.
5. Застосувати [Testing rules](../../standards/testing-rules.md) і
   [Security rules](../../standards/security-rules.md): зафіксувати конкретні
   test targets або `n/a` з обґрунтуванням, рішення щодо e2e та access/security
   context.

## Специфікація

Специфікація описує мету, межі, маршрути, контракти API, стани завантаження й
помилок, локалізацію, SSR-вплив та критерії приймання. Вона не повторює загальні
правила архітектури. Для security-relevant scope вона містить рівень review,
route/action access, 401/403, external data/PII та files/export/destructive
operation; для elevated risk — короткий threat model.

## Реалізація та перевірка

Робота виконується малими фазами із специфікації. Після кожної фази оновлюється
її статус і перевіряються щонайменше відповідний lint та build Storefront. Якщо
з'являється нове архітектурне рішення, спочатку додається ADR, а потім код.
