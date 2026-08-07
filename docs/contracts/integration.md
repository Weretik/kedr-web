# Правила frontend-інтеграції

**Backend-довідка (за наявності):** `KedrStore/docs/sdd/contracts/frontend-integration.md`

Ця сторінка є frontend-проекцією спільних backend-конвенцій і authoritative для
frontend transport implementation. Backend OpenAPI є довідкою, коли доступний;
його пошук, доступність і актуалізація не належать frontend-власникам.

## Межа контракту

- `data-access` володіє private DTO, query serialization, runtime parsing і
  мапінгом у domain model.
- `feature`, UI-компоненти й routes споживають domain model і нормалізований
  `ApiError`; вони не залежать від OpenAPI DTO names або raw HTTP responses.
- Feature посилається на сторінку цього реєстру; за наявності може вказати
  backend OpenAPI file як довідку.

## Спільні HTTP-правила

- JSON properties використовують camelCase.
- Paged response має `{ pagedInfo, value }`; `pagedInfo` містить `pageNumber`,
  `pageSize`, `totalPages` і `totalRecords`.
- Для операцій з такими parameters надсилайте `page >= 1` та `pageSize` від 1
  до 100.
- `400` validation response — Ardalis validation-error array. Не показуйте
  користувачу та не використовуйте в логіці localized backend error text.
- `404` не має response body; `409` повертає array conflict messages; `401` і
  `403` зберігають звичайне значення authentication та authorization errors.

## Нормалізація та обробка помилок

`shared/api-client` — єдине місце, де raw Axios/backend error перетворюється на
`ApiError`. `data-access` повертає нормалізовану помилку через RTK Query;
`feature` та UI не парсять `error.response.data` і не створюють власний Axios
instance.

```ts
interface ApiError {
  code:
    | 'Unknown'
    | 'Network'
    | 'Timeout'
    | 'Unauthorized'
    | 'Forbidden'
    | 'NotFound'
    | 'Validation'
    | 'Server';
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
```

### Канонічні форми backend validation response

Backend може повернути одну з двох форм. Обидві мапляться в
`ApiError { code: 'Validation', fieldErrors }`.

**ASP.NET Problem Details**

```json
{
  "title": "Помилка валідації",
  "detail": "Перевірте поля форми.",
  "errors": {
    "priceFrom": ["Значення не може бути від'ємним."]
  },
  "traceId": "illustrative-trace-id"
}
```

**Ardalis validation-error array**

```json
[
  {
    "identifier": "priceFrom",
    "errorMessage": "Значення не може бути від'ємним."
  }
]
```

У Ardalis array допустимі також PascalCase keys `Identifier` та
`ErrorMessage`. Прикладові повідомлення не є стабільним API: UI не повинен
порівнювати або розгалужувати логіку за текстом backend error.

### Мапінг transport і HTTP-помилок

| Джерело                        | Нормалізований `ApiError`                       | Поведінка feature/UI                                                                        |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Немає response                 | `Network`, `status: 0`                          | Показати offline/network state і доступний retry.                                           |
| `ECONNABORTED` або `ETIMEDOUT` | `Timeout`                                       | Показати timeout state і доступний retry.                                                   |
| `401`                          | `Unauthorized`                                  | Передати у чинний session/auth flow; не показувати validation UI.                           |
| `403`                          | `Forbidden`                                     | Показати state відсутнього доступу без retry тієї самої дії.                                |
| `404`                          | `NotFound`                                      | Показати not-found state або feature-specific fallback.                                     |
| `4xx` з `fieldErrors`          | `Validation`, `fieldErrors`, можливий `traceId` | Зіставити errors з полями форми; для query/filter показати зрозуміле локальне повідомлення. |
| `5xx`                          | `Server`, можливий `traceId`                    | Зберегти наявні дані, показати error state і retry.                                         |
| Інша client/HTTP помилка       | `Unknown`                                       | Показати безпечний generic error; не показувати raw response.                               |

### Правила відображення та діагностики

1. Для `Validation` передавайте `fieldErrors` у форму або відповідний control.
   Не показуйте raw backend body і не використовуйте глобальний toast замість
   локальних помилок поля.
2. Для `Network`, `Timeout`, `Server` і `Unknown` feature зберігає попередні
   успішні дані, якщо вони є, та пропонує ручний retry через `refetch`.
3. Runtime notifier призначений для network/timeout/server/unknown. Він не
   замінює feature error state; `4xx` обробляє feature.
4. `traceId` можна передати в support/діагностику через `ApiError`, але не
   логувати response body, Authorization header, token, cookie або PII.

## Authentication і безпека

Protected operations використовують наявний frontend session adapter і Bearer
token flow. Security, оголошена в OpenAPI, та backend authorization є
authoritative. Зокрема, не вважайте currently anonymous admin route безпечною
для доступу поза internal frontend surface.
