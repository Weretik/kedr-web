# <назва Mobile feature> — API і навігація

## API

| Операція | Endpoint | Request | Response | Errors |
| --- | --- | --- | --- | --- |
| <назва> | `<METHOD /path>` | <query/body> | <domain model> | <нормалізовані стани> |

DTO, mapper і transport details лишаються в `data-access`. Посилайтеся на
погоджений backend/OpenAPI contract.

## Навігація

| Route | Route file | Feature public API | Параметри | Back/deep-link behavior |
| --- | --- | --- | --- | --- |
| `<path>` | `<apps/mobile/src/app/...>` | `<@mobile/.../feature>` | <params> | <поведінка> |

Вкажіть guards, permissions, deep links та Android/iOS/web відмінності або
позначте їх як «не застосовується».
