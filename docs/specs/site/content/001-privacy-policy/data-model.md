# Модель представления

Владелец — существующий content/model. Backend/domain schema не меняется; документ нужен для нового typed view contract.

## Сущности

| Модель                | Поля / роль                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| PrivacySectionId      | Ровно восемь стабильных locale-independent IDs из таблицы ниже                             |
| PrivacyPolicyBindings | siteHost, email, phoneDisplay, phoneHref — явные значения из config, переданные feature    |
| PrivacyInline         | Безопасный text либо typed email/phone/site link; без raw HTML                             |
| PrivacyPolicyBlock    | Paragraph либо unordered-list с исходным порядком и source key каждого элемента            |
| PrivacyPolicySection  | id, full source title, short tocLabel, ordered blocks                                      |
| PrivacySummaryItem    | Локализованные title/body, три известных назначения: data/purpose/rights                   |
| PrivacyDictionary     | H1/intro/breadcrumb/TOC labels, три summary, восемь sections, contact/related-offer labels |

## Section IDs

| №   | ID              | Source section |
| --- | --------------- | -------------- |
| 1   | privacy-general | section1       |
| 2   | privacy-data    | section2       |
| 3   | privacy-purpose | section3       |
| 4   | privacy-sharing | section4       |
| 5   | privacy-storage | section5       |
| 6   | privacy-rights  | section6       |
| 7   | privacy-changes | section7       |
| 8   | privacy-contact | section8       |

Section id и номер не зависят от перевода; TOC и policy используют один массив. DOM id контактного callout отличается от privacy-contact, чтобы не создать duplicate target. Две адаптивные версии TOC также не дублируют DOM IDs.

## Инварианты и преобразования

Полный source copy хранится отдельно от краткой UI copy и mapper. Section 2 сохраняет paragraph → list → paragraph; остальные блоки следуют исходной нумерации. Типизированный набор source keys предотвращает потерю абзаца из-за произвольного Record<string,string>.

getPrivacyDictionary получает locale и explicit bindings. Feature извлекает host из siteConfig.siteUrl и передаёт email: COMPANY.email, phoneDisplay: COMPANY.phone.display, phoneHref: 'tel:' + COMPANY.phone.e164. Model не знает process.env и не импортирует конфигурацию. Весь §8 и CTA используют одни значения. Контролируемые изменения перечислены только в [content-source](design/content-source.md).

Model не импортирует UI, feature, data-access, Angular или Transloco. Данные immutable/local; loading, caching, persistence, optimistic updates, DTO mapping и отдельный API contract отсутствуют.
