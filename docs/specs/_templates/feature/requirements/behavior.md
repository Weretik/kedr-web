# <Назва feature> — business rules and scenarios

## Business rules

### R-001 — <стабільна назва правила>

<Правило мовою продукту, без деталей реалізації.>

## Acceptance scenarios

### SC-001 — <спостережуваний результат>

**Covers:** R-001

Given <видимий початковий стан або бізнес-передумова>
And <релевантна передумова>
When <дія користувача або зовнішня подія>
Then <спостережуваний результат>
And <додатковий спостережуваний результат>

### SC-002 — <boundary/error result>

**Covers:** R-001

Given <видимий стан>
When <дія>
Then <видима відмова, fallback або незмінений стан>

## Examples

| Input/state | Expected observable result |
| ----------- | -------------------------- |
| <value>     | <result>                   |

## Deferred scenarios

- <scenario поза поточним scope>

Після acceptance не змінюй ID. Сценарії не містять назв компонентів, hooks,
stores, libraries, packages, endpoints або файлів.
