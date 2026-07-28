# ADR-0002: Axios-транспорт для Mobile RTK Query

**Статус:** Прийнято  
**Дата:** 2026-07-27

## Контекст

Mobile використовує RTK Query для server state. Команда погодила Axios, щоб
транспортна модель відповідала Admin і не дублювала HTTP-обробку в доменах.

## Рішення

`@mobile/shared/api-client` володіє Axios instance, `axiosBaseQuery`, `baseApi`
і нормалізацією `ApiError`. Кожен domain `data-access` розширює `baseApi` через
`injectEndpoints`; feature використовує тільки типізовані hooks.

## Наслідки

- RTK Query cache не дублюється в Redux slice.
- Axios не викликається напряму з feature або UI.
- Axios base query повертає `{ data }` або `{ error }`, не кидає transport
  виняток назовні.
