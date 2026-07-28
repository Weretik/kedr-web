# Фаза 05: API, observability та connectivity

**Статус:** completed  
**Залежить від:** фаза 04  
**Блокує:** фазу 06

## Мета

Створити один безпечний transport path для майбутніх domain endpoints і базовий
UX для помилок та втрати мережі.

## Рішення та структура

```text
shared/api-client/
├── client/          # Axios instance
├── rtk-query/       # axiosBaseQuery, baseApi
├── errors/          # ApiError normalization
├── interceptors/    # dev-only request/response logging
└── runtime/         # error notifier adapter
```

- Axios request interceptor додає correlation ID і вимірює тривалість.
- Response interceptor у development логує лише method, sanitized URL, status і
  duration; не логує headers, body, токени, персональні дані або API response body.
- Логування вмикається лише у development через
  `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true`, аналогічно окремому opt-in flag Admin.
- `axiosBaseQuery` повертає типізований `ApiError`, а не кидає Axios exception.
- Публічні `ApiRequest` / `ApiError`, коди помилок, Problem Details та Ardalis
  validation mapping сумісні з `@admin/shared/api-client`, бо backend спільний.
  Auth header, refresh і credentials не входять у Mobile foundation.
- RTK Query error middleware передає нормалізовані неочікувані помилки до
  глобального notifier; feature все одно рендерить свій error-state.
- Connectivity adapter керує лише network snapshot/subscribe. Він не виконує
  прихований retry і не створює offline cache.
- `@mobile/core/shell` підключає connectivity provider та ненав'язливий offline
  indicator; feature володіє своїм loading/error state і ручним `refetch`.

## Критерії приймання

- [ ] `baseApi` готовий до `injectEndpoints`, але не містить catalog endpoint.
- [ ] Помилки 4xx, 5xx і network error нормалізовані та протестовані.
- [ ] HTTP logging доступний лише в development і не містить чутливих даних.
- [ ] Втрата мережі показує базовий offline indicator/state; ручний retry доступний
      feature, коли з'явиться запит.

## Перевірка

- **Unit:** Axios base query, error mapping, logger sanitization, NetInfo adapter.
- **Ручна:** вимкнути мережу на Android і переконатися, що app не аварійно завершується.
