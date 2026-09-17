# API-архітектура Admin і Mobile

**Область:** `apps/admin`, `apps/mobile`  
**Статус:** чинний  
**Пов'язані документи:** [ADR Admin Axios transport](../admin/adr/0001-admin-axios-transport.md), [стан і API Admin](../admin/state-and-api.md), [стан і API Mobile](../mobile/state-and-api.md)

## Призначення

Admin і Mobile споживають один backend, тому однаково передають API-запити,
нормалізують backend errors і підтримують cancellation. Клієнти не імпортують
код один одного: кожен володіє власним `shared/api-client`, але реалізує цей
контракт.

```text
Admin feature / Mobile feature
             │ RTK Query hook
             ▼
domain data-access ── baseApi.injectEndpoints
             │
             ▼
shared/api-client
  ApiRequest → axiosBaseQuery → Axios → спільний backend
                    │                │
                    └─ ApiError ◄────┘
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
feature error state              runtime notifier (network/timeout/5xx)
```

`feature` показує власні loading/error/empty states. Глобальний notifier не
замінює error state та не повідомляє про validation errors.

## Межі відповідальності

`@shared/api-contracts` містить лише CLI-generated OpenAPI types і є спільним
machine contract для Admin, Mobile та Storefront. Він не містить HTTP client,
state, runtime validation чи domain models. Кожен client імпортує його тільки на
transport boundary і виконує власний mapping у domain `data-access`.

| Шар                    | Відповідальність                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `shared/api-contracts` | Generated OpenAPI request, response and schema types                                             |
| `shared/api-client`    | Axios instance, interceptors, `axiosBaseQuery`, `baseApi`, error normalization, runtime notifier |
| Domain `data-access`   | DTO, runtime validation, mapper і endpoints через `baseApi.injectEndpoints`                      |
| `feature`              | Generated RTK Query hooks, loading/error states і ручний `refetch`                               |
| `ui` / route           | Не викликають HTTP і не імпортують transport                                                     |

Кожен domain endpoint оголошується виключно через public `baseApi.injectEndpoints`.
Не можна створювати окремий Axios instance, робити deep import у `api-client` або
дублювати RTK Query response/error у slice.

## Публічний transport contract

```ts
interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Validation'
  | 'Server';

interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
```

`axiosBaseQuery` передає RTK Query `AbortSignal` до Axios і повертає тільки
`{ data }` або `{ error: ApiError }`. Axios exception не виходить у feature.

## Backend errors

| Backend response              | `ApiError`                                |
| ----------------------------- | ----------------------------------------- |
| Немає response                | `Network`, `status: 0`                    |
| `ECONNABORTED` / `ETIMEDOUT`  | `Timeout`                                 |
| HTTP 401 / 403 / 404          | `Unauthorized` / `Forbidden` / `NotFound` |
| HTTP 4xx з validation fields  | `Validation` і `fieldErrors`              |
| HTTP 5xx                      | `Server`                                  |
| Інша transport/client помилка | `Unknown`                                 |

### ASP.NET Problem Details

Backend може повертати `{ detail, title, errors, traceId }`. `detail` має
пріоритет над `title`; `errors` перетворюється на `fieldErrors`; `traceId`
зберігається для діагностики. Response body не логується.

### Ardalis validation result

Backend може повертати масив з `Identifier` / `ErrorMessage` або
`identifier` / `errorMessage`. Клієнт групує повідомлення за полем у
`fieldErrors` і повертає `Validation`.

## Робота з помилками

1. Для `Validation` feature показує field errors.
2. Для `Network`, `Timeout` і `Server` feature пропонує доступний ручний retry
   через `refetch`.
3. Runtime notifier повідомляє про network, timeout, server та unknown errors;
   4xx лишаються відповідальністю конкретного feature.
4. `traceId` передається в support лише через нормалізований `ApiError`; feature
   не парсить backend response самостійно.

## Observability і безпека

- Request interceptor може додавати correlation ID і вимірює тривалість.
- Логи містять тільки method, sanitized URL без query/fragment, status і duration.
- Headers, request/response body, tokens і персональні дані не логуються.
- Logging увімкнений лише за development opt-in flag: `VITE_ENABLE_HTTP_LOGS`
  для Admin та `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true` для Mobile.

## Відмінності клієнтів

| Аспект           | Admin                                                               | Mobile                                                    |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Base URL         | `@admin/shared/config`                                              | `EXPO_PUBLIC_API_BASE_URL` через `@mobile/shared/config`  |
| Authentication   | bearer token, refresh, CSRF, credentials через `AuthSessionAdapter` | Не реалізовано до окремої auth-фази                       |
| Runtime notifier | Налаштовується під час Admin bootstrap                              | Реєструється у `@mobile/core/shell` notification provider |
| Connectivity     | browser/HTTP failure handling                                       | NetInfo offline indicator, без automatic retry            |

`EXPO_PUBLIC_*` потрапляють у Mobile client bundle, тому не можуть містити
токени, паролі чи інші secrets.

## Перевірка

- Unit: Problem Details, Ardalis, network, timeout і 5xx mapping; `AbortSignal`
  forwarding; logger sanitization.
- Integration: endpoint через `baseApi.injectEndpoints` повертає доменну модель,
  а не DTO.
- Ручна: скасувати запит при unmount/навігації; на Mobile вимкнути мережу та
  перевірити offline indicator без аварійного завершення.
