# Frontend security rules

## Межа відповідальності

Frontend забезпечує коректне використання сесії, безпечне відображення даних,
мінімізацію даних у клієнті та UX access control. Backend є єдиним authority для
authentication, authorization, role/permission enforcement, ownership checks,
валідації, rate limiting, audit trail, CSRF/CORS/cookie attributes і підписаних
URL. Прихований button або client-side guard ніколи не є контролем доступу.

## Authentication, access і session

- Admin уже тримає access token у пам'яті через `admin/core/auth`, додає його
  Axios interceptor-ом до `Authorization: Bearer`, надсилає cookies через
  `withCredentials`, а на один `401` виконує refresh/retry. Паралельні refresh
  запити дедуплікуються. Не переносити токен у localStorage/sessionStorage,
  URL, Redux або логи.
- Storefront використовує Angular `SessionStore`, auth/credentials/CSRF/
  unauthorized interceptors і `withCredentials`; захищений cabinet має
  `cabinetAuthGuard`. Нові protected routes мають мати guard, але backend все
  одно перевіряє доступ.
- Mobile catalog нині публічний: `@mobile/shared/api-client` не підключений до
  auth або SecureStore. Не вигадуйте client auth для нової feature: спочатку
  узгодьте API/session contract і задокументуйте secure storage, token refresh,
  protected routes/actions та logout UX.
- Role/permission availability визначається реальним API contract. До його
  появи не створюйте фіктивні role checks; у spec зазначайте `n/a` з причиною.
  Якщо roles є, обмежуйте і route, і кожну privileged action, показуючи
  нейтральний unavailable/forbidden state.
- `401` означає один контрольований refresh там, де він уже реалізований; за
  невдачі очистити локальну сесію і перевести до login без loop. `403` не
  повторювати і не показувати як session expiry: показати safe forbidden state.

## Дані, XSS, помилки і logs

- Виводьте зовнішні дані лише стандартним React/React Native/Angular binding.
  `dangerouslySetInnerHTML`, прямий `innerHTML`, небезпечні URL/style values і
  Angular trust-bypass заборонені без окремого security review, дозволеного
  sanitizer та тесту на XSS payload.
- Перевіряйте API data на межі `data-access`, мапте DTO до domain model і не
  передавайте raw API errors у UI. У UI показуйте нормалізований `ApiError`,
  field errors або безпечне узагальнене повідомлення; не показуйте stack trace,
  request headers, tokens або backend internals.
- PII, access/refresh tokens, cookies, passwords, authorization headers,
  CSRF tokens і secrets не потрапляють у source, Expo `EXPO_PUBLIC_*`, Vite
  client env, analytics, telemetry, test fixtures або console logs. Наявні
  Admin/Mobile HTTP logs дозволені лише у development та логують method, path,
  status/duration; нові логи зберігають цей redaction principle.
- Будь-який `EXPO_PUBLIC_*` і Vite client env вважайте публічним. У Mobile
  `EXPO_PUBLIC_API_BASE_URL` може містити лише public base URL.

## Transport, cookies і CSRF

- Тільки HTTPS у production; не послаблюйте certificate/transport checks.
- Admin і Storefront використовують credentialed cookies. Refresh POST передає
  cookie `kedr.csrf` як `X-CSRF-Token`; нові cookie-auth state-changing
  endpoints повинні мати узгоджений backend CSRF contract. Frontend не може
  сам гарантувати `Secure`, `HttpOnly`, `SameSite`, CORS origin allowlist або
  cookie domain — це backend/infra responsibility, яку треба перевірити в
  contract.
- Mobile не використовує browser cookies у поточному public catalog flow.
  Для майбутнього auth не переносіть cookie/CSRF припущення з web без окремого
  mobile session design.

## Файли, export і небезпечні операції

- Для upload визначайте в spec дозволені типи, size limit, серверну перевірку,
  malware scanning ownership, failure state і PII classification. Не покладайтеся
  лише на client `accept`/MIME; не показуйте локальний файл як trusted content.
- Export містить лише дані, дозволені поточній server-side authorization.
  Не кладіть PII у URL/query string; використовуйте безпечний download contract
  і зрозумілий статус помилки.
- Bulk/destructive actions потребують видимого scope/count, явного confirm,
  disabled/pending state, idempotency/duplicate-submit consideration, result
  summary і обробки partial failure. Backend підтверджує permission та цілі;
  frontend не заявляє про незворотне видалення до підтвердженої відповіді.

## Пропорційний security review

Кожна feature-spec містить один статус:

- **n/a** — немає auth, PII, external input, файлів, export або privileged/
  destructive action; наведіть коротке обґрунтування.
- **basic** — звичайний API/UI flow або нова route/action: перевірити access,
  401/403, error/log redaction, XSS-safe output і застосовні transport rules.
- **elevated** — auth/session/roles, PII, upload/download/export, bulk/
  destructive action, payment або зовнішній/HTML content. Додайте короткий
  threat model: assets/PII, actors і trust boundaries, abuse cases, controls,
  residual risks і backend/infra dependencies. Перевірте security scenarios
  тестами на можливому рівні та вручну/через E2E після readiness.
