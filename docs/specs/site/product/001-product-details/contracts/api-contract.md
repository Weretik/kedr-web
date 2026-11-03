# Контракты

## Публичное чтение: существующий контракт

- Snapshot: [products.openapi.yaml](../../../../../contracts/openapi/catalog/products.openapi.yaml), OpenAPI 3.1.0, `info.version = 0.1.0`.
- SHA-256 на момент SDD: `AAD7112EA54739DF6D8AC524A8E38AC48174664E1792BD6D8F62AE1DCB177BC0`.
- Generated types: [kedr-api.ts](../../../../../../libs/shared/api-contracts/src/generated/kedr-api.ts), публичный [index.ts](../../../../../../libs/shared/api-contracts/src/index.ts).
- Операция `getPublicProductBySlug`: `GET /api/catalog/{lang}/product/{productSlug}`, public `security: []`; `lang = uk | ru`, `priceTypeId = 11` фиксирован для публичной страницы.
- Операция `getPublicProducts`: `GET /api/catalog/{lang}/products`; для seed/sitemap `availability=All`, `sort=IdAsc`, `pageSize≤100`, последовательная пагинация, без category/search/price filters.
- Никаких новых HTTP operations, ручных generated DTO и contract sync без изменения backend.
- Consumer projection: [Site product details and discovery](../../../../../contracts/catalog/public-products.md#site-product-details-and-discovery).

| Результат                                                                             | Действие frontend                                                                 |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 200, текущий slug совпадает                                                           | нормализовать и показать товар                                                    |
| 200, `productSlug` отличается                                                         | 308 на текущий товар в выбранной locale                                           |
| 404 с валидным `CatalogRedirect`, `redirectType=category`                             | 308 на `/{locale}/catalog/{redirectSlug}`                                         |
| 404 без валидного redirect body                                                       | проектный 404                                                                     |
| timeout, сбой транспорта, неожиданный 400/5xx, некорректная обязательная идентичность | unavailable → проектный 500/retry                                                 |
| неожиданный 410                                                                       | ошибка несоответствия текущему контракту, без выдуманной специальной страницы 410 |

Redirect body описан в [category-read.openapi.yaml](../../../../../contracts/openapi/catalog/category-read.openapi.yaml). Принимать только известный тип и безопасный непустой slug, а не внешний URL. Передавать сегмент через существующие URL helpers/безопасное кодирование; исключить цикл редиректа на тот же URL.

## Граница данных

Generated DTO aliases и parser неизвестного redirect body приватны в server-only `product/data-access/src/lib/contracts`; domain normalization остаётся в `mappers/`. Транспорт — существующий [siteApiGet](../../../../../../libs/site/shared/api-client/src/lib/site-api.ts), который уже сохраняет JSON body 404. Маппер возвращает [доменную модель](../data-model.md), не отдаёт сырой ответ в client components. `name`, цена, stock, pack, photo/scheme не подменяются значениями из концепта.

`lang` и успешный непустой ответ — доступное подтверждение языковой версии. В snapshot нет флага наличия перевода; не определять перевод сравнением UK/RU строк. Контракт содержит один `productSlug` у товара (в том числе AdminProduct с `nameUk`/`nameRu`), а не пару локализованных slug. Проверять вторую locale перед alternate; если lookup не подтверждает тот же SKU, alternate не создавать. Если backend в будущем вводит локализованные slug/скрытый fallback языка, требуется явное уточнение контракта, а не frontend-транслитерация.

## Cart dependency: требуемая граница, не существующая операция

EN-002 должна предоставить согласованный public API владельца общей Site корзины:

- принятие реального SKU и количества, результат принятия/отказа;
- однозначную семантику повторного добавления и ограничения количества;
- общий наблюдаемый count и сохранение состояния по принятой политике;
- рабочий локализованный адрес корзины и источник header control;
- отсутствие product-specific второй корзины и утечек в публичный кеш.

Название функции, storage key и сетевой endpoint здесь не выдумываются. Их фиксирует cart SDD шага 5 до снятия EN-002. Product feature подключает адаптер к разрешённым `cart/ui`/`cart/model` public APIs, UI продукта получает примитивные данные/действие и не импортирует cart domain. Feature-to-feature import запрещён. Общий cart provider/header control компонуется на уровне приложения; core/shell получает slot, не импортирует cart.

Контакты и ссылки условий используют существующую навигацию/COMPANY; ни запрос цены, ни уточнение наличия не создают новую заявку, уведомление или заказ.
