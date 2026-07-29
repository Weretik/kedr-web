# <назва Admin feature> — API-контракт

**Frontend-контракт:** [<сторінка в реєстрі>](../../../../contracts/<backend-module>/<feature>.md)
**Машиночитане джерело:** `KedrStore/docs/sdd/contracts/<module>/<feature>.openapi.yaml` (`<operationId>`)

Перед заповненням прочитайте [frontend-реєстр API-контрактів](../../../../contracts/README.md)
і [правила інтеграції](../../../../contracts/integration.md). Якщо сторінки
операції ще немає, спочатку додайте її до `docs/contracts/<backend-module>/`;
не дублюйте тут OpenAPI YAML або private DTO.

| Операція | Endpoint | Request | Response | Errors / access |
| --- | --- | --- | --- | --- |
| <назва> | `<METHOD /path>` | <query/body> | <domain model> | <стани та permission> |

Посилайтеся на погоджений versioned OpenAPI або backend contract. DTO, mapper і
transport errors лишаються private у `data-access`; `feature` та `ui` працюють
з domain-моделями. Зафіксуйте security, pagination/idempotency, known
limitations і blocker, якщо контракт неповний.

Сторінка операції у `docs/contracts/<backend-module>/` обов'язково містить
розділи **«Канонічний HTTP-запит»** і **«Канонічна форма JSON-відповіді»**.
Feature-local contract посилається на них і не дублює їх, якщо немає
feature-specific відмінності.
