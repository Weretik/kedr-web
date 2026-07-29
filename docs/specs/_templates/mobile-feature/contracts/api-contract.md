# <назва Mobile feature> — API і навігація

**Frontend-контракт:** [<сторінка в реєстрі>](../../../../contracts/<backend-module>/<feature>.md)
**Машиночитане джерело:** `KedrStore/docs/sdd/contracts/<module>/<feature>.openapi.yaml` (`<operationId>`)

Перед заповненням цього файлу прочитайте
[frontend-реєстр API-контрактів](../../../../contracts/README.md) і
[правила інтеграції](../../../../contracts/integration.md). Якщо сторінки
операції в реєстрі ще немає, спочатку додайте її відповідно до інструкції
шаблону; не дублюйте тут OpenAPI YAML або private DTO.

## API

| Операція | Endpoint         | Request      | Response       | Errors                |
| -------- | ---------------- | ------------ | -------------- | --------------------- |
| <назва>  | `<METHOD /path>` | <query/body> | <domain model> | <нормалізовані стани> |

DTO, mapper і transport details лишаються в `data-access`. Посилайтеся на
погоджений backend/OpenAPI contract, зафіксуйте pagination/reset, security,
known limitations і blocker, якщо контракт неповний.

Сторінка операції у `docs/contracts/<backend-module>/` обов'язково містить
розділи **«Канонічний HTTP-запит»** і **«Канонічна форма JSON-відповіді»**.
Feature-local contract посилається на них і не дублює їх, якщо немає
feature-specific відмінності.

## Навігація

| Route    | Route file                  | Feature public API      | Параметри | Back/deep-link behavior |
| -------- | --------------------------- | ----------------------- | --------- | ----------------------- |
| `<path>` | `<apps/mobile/src/app/...>` | `<@mobile/.../feature>` | <params>  | <поведінка>             |

Вкажіть guards, permissions, deep links та Android/iOS/web відмінності або
позначте їх як «не застосовується».
