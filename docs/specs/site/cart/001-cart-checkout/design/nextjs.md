# Next.js: route, client islands и мутация

## Установленный runtime и источники

Next 16.4.3 и React 19.3.0 подтверждены lockfile. Root layout — `apps/site/src/app/[locale]/layout.tsx`, отдельного `app/layout.tsx` сейчас нет. Cache Components включены; существующая архитектура отделяет [личное состояние от общего кеша](../../../../../architecture/site/platform/rendering-and-caching.md).

Локальные руководства, прочитанные для решения:

- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` — server functions/actions и передача action prop.
- `node_modules/next/dist/docs/01-app/02-guides/server-actions.md` — публичная недоверенная граница, Origin/Host и validation.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/connection.md` — request-time rendering без фиктивных cookies/headers.
- Локальная router implementation подтверждает, что сохранность draft при смене `[locale]` нельзя обосновать обычным useState provider; выбрана явная document store lifetime.

## Routes и rendering

| Поверхность          | Рендеринг                                                                                                           | Индексация                         | Cache / status                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| `/{locale}/checkout` | Server frame с H1, labels и нейтральным loading; request-time leaf под Suspense; клиентская корзина после hydration | noindex; без sitemap               | Персональные данные не кешируются; 200 для обычного/пустого состояния |
| Drawer из шапки      | Client island внутри существующего shell                                                                            | Отдельного URL нет                 | Нет общего кеша состояния                                             |
| Success              | Локальное receipt состояние на том же checkout                                                                      | URL и metadata не содержат orderId | Без отдельного GET, редиректа или сохранения PII                      |

Route только читает awaited params, вызывает `CheckoutPage` и делегирует metadata в cart/seo. Валидность locale обеспечивает существующая локализованная граница; неизвестная locale сохраняет 404. Отдельные cart `generateStaticParams` не добавляются. Произвольные query params не интерпретируются как контакты/состав/номер заказа.

Для соответствия реализованному dynamic-private route серверный request leaf вызывает `connection()` под `<Suspense>`; framework-independent cart content остаётся в feature. До request leaf виден неперсональный fallback. Визуальный loading не маскируется под пустую корзину. `connection` не вызывается в indexable product/catalog и не помещается в `'use cache'`.

Нет `revalidate`, `dynamicParams`, `dynamic='force-dynamic'`, `unstable_cache` или `fetch(...,{next:...})`. Order POST использует `cache:'no-store'`; собственных tags/cacheLife/revalidation для корзины нет. Существующие cached catalog/server components не читают cart или cookies.

## Server / client

- Server: CheckoutPage frame, CartRuntime composition, product purchase adapter, metadata, action и весь cart/data-access.
- Client: document store subscription, drawer/form/quantity/purchase controllers и интерактивные UI leaves.
- Props: только mapped serializable models и допустимая server action reference. Серверный product render callback выполняется на сервере и не передаётся как произвольная функция клиентскому UI.
- Client store создаётся только в браузере, а SSR snapshot постоянен и неперсонален. Ни server module singleton, ни shared cache не содержит имени/телефона/корзины.

## Мутация

`cart/feature/src/lib/actions/submit-quick-order.ts` помечен `'use server'`. Это публичная точка входа: она заново проверяет unknown input, разрешённые поля и локальные инварианты. Операция backend анонимна; не добавлять login gate, не пробрасывать административную сессию. Next Origin/Host protections сохраняются. Deployment proxy configuration для action проверяется при выпуске, без необоснованного расширения allowedOrigins.

Action вызывает только cart/data-access, тот — фиксированный POST в shared API client. URL, API origin, headers и transport DTO не приходят из формы. Возвращается нормализованный сериализуемый result; raw body и stack не возвращаются пользователю. Input schema не доказывает серверную актуальность цены/остатка: frontend таких гарантий не заявляет.

Action prop доходит до client controller через server CartRuntime. Controller/owner фиксирует command и single pending, не начинает mutation из render/effect, не использует автоматические retry. Закрытие drawer и soft locale remount не создают дополнительный вызов.

## Проверка

EN-001 подтверждает inferred targets новых проектов. Unit/component/focused integration покрывают parser, store remount, hydration, action boundary и response normalization. Next request rendering, отсутствие private cache и composition проверяются по коду и server-render tests; реальная route table/build/HTTP проверяется только в явно разрешённом этапе. Незапущенные проверки не отмечаются как успешные.
