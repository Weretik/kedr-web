# Контракт createQuickOrder и потребитель Site

## Происхождение

- Provider: KedrStore, канонический backend `docs/sdd/contracts/openapi.yaml`.
- Зафиксированный frontend snapshot: [SOURCE.md](../../../../../contracts/openapi/SOURCE.md), commit `527d18934ee271c9ffa3d475f3a545026f4b3248`.
- Машинная операция: [orders.openapi.yaml](../../../../../contracts/openapi/catalog/orders.openapi.yaml), `createQuickOrder`, **POST `/api/orders`**, `security: []`.
- Generated types: `libs/shared/api-contracts/src/generated/kedr-api.ts`; aliases `operations['createQuickOrder']...` остаются в transport/data-access.
- Текущее описание потребителя: [quick-order.md](../../../../../contracts/catalog/quick-order.md); consumers — Angular storefront и новый Site cart/checkout.
- Статус: операция подтверждена snapshot и старым consumer; Site mutation transport реализован, mocked contract tests passed.

Машинный snapshot и generated types не изменяются этой SDD. Схема требует строковый productId. Site mapper следует машинной схеме и строковому ID из product model; прежний числовой prose-пример quick-order.md исправлен, generated/snapshot не менялись.

## Проекция

| Операция           | Намерение               | Request projection                                           | Ответ                            | Поведение              |
| ------------------ | ----------------------- | ------------------------------------------------------------ | -------------------------------- | ---------------------- |
| `createQuickOrder` | Отправить быстрый заказ | firstName, phone, lines с productId/title/unitPrice/quantity | HTTP 200 с валидным UUID orderId | SC-015–020, SC-029/030 |

Обязательные правила проекции: firstName до 30 символов, phone до 20, непустой lines, строковый непустой productId/title, целое quantity 1–1000. UI дополнительно сохраняет старый minLength имени 3 и полную телефонную маску. unitPrice — фактический положительный конечный снимок; неизвестная цена не подменяется нулём. Схемы запроса/ответа вручную не копируются — aliases берутся из операции, runtime validation проверяет неизвестный input/body отдельно.

`slug`, imageUrl, currency, drawer state, locale, контакты менеджера и client flags не сериализуются в backend DTO. Доставка, payment, address, email, comment, сохранённый адрес и consent field в этой операции отсутствуют.

При повторном добавлении того же productId объединяется quantity, существующий snapshot сохраняется как в старом store. Нет скрытого refresh цены или отдельного endpoint проверки остатков. Product purchase descriptor строится из известного нормализованного товара, product.sku соответствует строке product.id.

## Владельцы и разрешённая серверная граница

1. Feature Server Function валидирует unknown command, включая ограничения полей/строк.
2. cart/data-access создаёт private DTO, вызывает `siteApiCreateQuickOrder` и нормализует body/result.
3. Новый `shared/api-client/src/lib/site-order-api.ts` server-only transport разрешает только фиксированный endpoint `/api/orders` на `siteConfig.apiUrl`. Никаких произвольных URL из UI, admin операций или расширения typed catalog GET.
4. JSON POST с `cache:'no-store'`, без session/auth forwarding и автоматических retry. Базовый timeout 10 s соответствует текущей transport convention; истечение — неопределённый результат, не доказанный отказ создания.
5. UI получает только доменный result и никогда не импортирует transport/generated DTO.

Это узкое реализованное расширение Site архитектуры: fixed anonymous order POST отделён от catalog GET. TS-006 синхронизировала архитектурное описание вместе с кодом; обход общего API client прямым fetch из UI/route/domain запрещён.

## Ошибки и подтверждение

| Исход                                                               | Доменный результат                                                              | Сохранение и повтор                                                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Input rejected до backend POST                                      | validation                                                                      | Сохранить форму/корзину, исправление известно безопасным; backend вызовов 0                                            |
| HTTP 200 и корректный UUID                                          | created(orderId)                                                                | Очистить cart/draft, показать фактический receipt; без повторного POST                                                 |
| HTTP 400                                                            | validation                                                                      | Известные нормализованные поля firstName/phone рядом с полем, unknown errors общим сообщением; ничего не очищать       |
| HTTP 409, массив строк по контракту                                 | conflict                                                                        | Без домысла о цене/складе, данные сохранены, доступен менеджер и осознанное исправление                                |
| Timeout/network после возможного forwarding, 5xx, malformed success | uncertain                                                                       | Не сообщать об успехе или гарантированном отказе; заказ мог поступить, уточнить у менеджера; без автоматического retry |
| Неизвестный/неописанный status/body                                 | uncertain либо неперсональный общий отказ только при доказанной pre-send ошибке | Не выдумывать бизнес-правило и не показывать raw HTML/stack                                                            |

Схема HTTP 400 body в snapshot не задана. Использовать только фактически известные безопасно распознанные поля нормализации старого shared error contract; unknown body допускает общий fallback. Не объявлять придуманный validation DTO частью OpenAPI. Runtime fixtures включают известные и неизвестные формы, пустой/non-JSON body и неизвестное имя поля.

Контракт не определяет Idempotency-Key или operation status lookup. Single pending в текущем document защищает от click/Enter и remount duplicate, но не заменяет backend idempotency. Автоматического повтора после разрыва связи нет. Backend idempotency/status и полноценная оплата остаются отдельными будущими задачами, не blockers описанного быстрого заказа.

## Проверка и совместимость

TS-006 покрывает private request mapping, runtime UUID/body parsing, статусы, no-store и число POST через controlled fetch/action boundaries. TS-007 проверяет видимые состояния и неизменность отправляемого snapshot. Используются текущие generated types; `contracts:sync`, генерация и изменение YAML не нужны при отсутствии provider change.

Во время подготовки SDD сеть к backend не использовалась, реальный заказ не создавался. Consumer tests, вызов live API и deploy compatibility ещё не доказаны. Deployment proxy/allowedOrigins проверяются в разрешённом выпускном этапе; SDD не запускает публикацию.
