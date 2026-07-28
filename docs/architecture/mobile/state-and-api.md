# Стан, API та форми Mobile

## Серверний стан і API

- RTK Query є єдиним owner серверного стану, cache, loading/error-станів та
  інвалідації.
- Кореневий Redux store розміщується у `@mobile/core/shell`.
- `@mobile/shared/api-client` володіє одним Axios instance, `axiosBaseQuery`,
  `baseApi` і нормалізацією помилок.
- Публічні `ApiRequest`, `ApiError` і коди помилок узгоджені з
  `@admin/shared/api-client`, оскільки обидва клієнти споживають один backend.
  Mobile не підключає Admin UI-код або auth runtime.
- Спільна схема backend error shapes, transport boundaries та правила для обох
  клієнтів зафіксовані в [API-архітектурі Admin і Mobile](../api/README.md).
- Domain `data-access` оголошує endpoints лише через `baseApi.injectEndpoints` і
  експортує типізовані hooks.
- DTO, Zod-валідація відповіді та mapping DTO → domain model належать
  `data-access`; feature та UI не отримують DTO.
- У першому релізі каталог є публічним. `core/auth` і SecureStore не
  підключаються до HTTP-клієнта, доки не з'явиться авторизований сценарій.

```text
Catalog feature → useGetProductsQuery → catalog/data-access
                                         ↓
                         shared/api-client/baseApi → Axios → API
```

`EXPO_PUBLIC_API_BASE_URL` містить лише публічну базову адресу API. Токени,
паролі й інші секрети не передаються через Expo public environment variables.

## Помилки та повторні спроби

`axiosBaseQuery` не кидає винятки назовні: він повертає типізований `ApiError`
із `status`, `code`, `message`, за потреби `fieldErrors` і `traceId`.

Mobile normalizer підтримує ASP.NET Problem Details (`detail`, `title`, `errors`,
`traceId`) і Ardalis validation array — ті самі backend response shapes, що й
Admin. Він також передає RTK Query `AbortSignal` до Axios.

RTK Query middleware повідомляє глобальний notifier лише про network, unknown та
5xx помилки. Помилки 4xx лишаються у feature, щоб екран міг показати доречний
validation або error state.

- 4xx не повторюються автоматично;
- мережеві та 5xx-помилки показують error-state з дією «Спробувати ще раз»;
- retry виконує користувач через `refetch`, а не прихована безмежна автоматична
  спроба;
- error UI не показує сирі Axios або backend-повідомлення без нормалізації.

## Redux state

У Redux slice зберігається лише довгоживучий клієнтський стан, який потрібний
кільком екранам. Дані, loading та error API-запитів не дублюються у slice.
Локальні значення пошуку, відкритий діалог і вибір одного екрана залишаються в
feature або компоненті.

## Форми

React Hook Form володіє значеннями, touched/error і submit-станом. Zod-схема
описує форму на межі feature; доменні інваріанти, що потрібні кільком сценаріям,
належать `model`. Presentational form у `ui` отримує значення, помилки, disabled
і callbacks через props; вона не викликає RTK Query або Expo Router.
