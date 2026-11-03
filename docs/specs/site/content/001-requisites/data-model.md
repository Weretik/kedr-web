# Данные и их происхождение

## Источники

- Runtime-источник после подтверждения владельцем: [COMPANY_REQUISITES](../../../../../libs/site/core/config/src/lib/company-requisites.ts).
- Snapshot старых реквизитов: [requisites.translation.ts](../../../../../apps/storefront/src/app/localization/translations/requisites.translation.ts).
- Назначение данных и различие администрации/продавца: [public-offer.translation.ts](../../../../../apps/storefront/src/app/localization/translations/public-offer.translation.ts).
- Актуальные контакты: [company.ts](../../../../../libs/site/core/config/src/lib/company.ts).
- Согласование платежа: [delivery-payment-dictionary.ts](../../../../../libs/site/content/ui/src/lib/i18n/delivery-payment-dictionary.ts).

Legacy-файл служит evidence происхождения для EN-001. Production Next.js не импортирует Angular-код и его translation package.

| Поле                      | Snapshot для концепта                                          | Production-статус                    |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| legalName                 | ФОП Овчинников Максим Володимирович                            | Подтверждено EN-001                  |
| code                      | 2689400771                                                     | Подтверждено EN-001; подпись «Код»   |
| registrationExtractNumber | 24800170000032534                                              | Подтверждено EN-001                  |
| iban                      | UA303052990000026007025905216                                  | Подтверждено EN-001                  |
| bankCode                  | 305299                                                         | Подтверждено EN-001                  |
| bankName                  | Подтверждено краткое имя ПриватБанк; полная форма не выводится | Подтверждено EN-001                  |
| phone.display / e164      | (068) 713-50-49 / +380687135049                                | COMPANY                              |
| email                     | kedr.class19@gmail.com                                         | COMPANY; показан существующим footer |

EN-001 закрыт отдельным явным ответом пользователя 2026-11-03; [подтверждение](design/data-confirmation.md) фиксирует точные значения и подписи. Налоговый статус, улица, график, счёт партнёра, получатель каждой сделки и дополнительные документы не выводятся из этих данных.

## Владение

| Владелец                            | Содержимое                                                                                 | Граница                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| core/config: COMPANY_REQUISITES     | Подтверждённые строки legalName, code, registrationExtractNumber, iban, bankName, bankCode | Отдельный company-requisites.ts, без импорта content/model     |
| existing core/config: COMPANY       | Телефон, бренд, email, город, messenger/map URLs                                           | Не дублировать в реквизитах или словаре                        |
| content/model: RequisitesDetails    | Readonly presentation contract официальных строк и контакта                                | Не DTO, без JSX/browser API и HTTP                             |
| content/model: RequisitesDictionary | UK/RU подписи, пояснения и copy-state labels                                               | Без банковских значений и автоматического перевода имени       |
| content/model: formatRequisitesCopy | Чистая сборка payload из details и локализованных подписей                                 | Без импорта config/React/Next; входные значения не нормализует |
| content/feature                     | Соединяет config и словарь, формирует payload                                              | Передаёт строки в server UI и client leaf                      |
| content/seo                         | Собственный маленький locale record для metadata/breadcrumb                                | Не импортирует content/model по boundary rules                 |

Коды, номер выписки и IBAN — строки, не числа. Значения сохраняют ведущие символы и исходный регистр. Символ № относится к представлению, хранится отдельно от номера. Визуальный перенос IBAN не меняет источник.

## Контракт копирования

IBAN-only payload равен details.iban побайтно: без label, форматирующих пробелов и newline.

Полный payload содержит шесть строк с разделителем LF в устойчивом порядке:

1. Найменування / Наименование: legalName.
2. Подтверждённая подпись кода: code.
3. Виписка / Выписка: № registrationExtractNumber.
4. IBAN: iban.
5. Банк: bankName.
6. МФО: bankCode.

Каждая строка имеет вид «Подпись: значение». Данные телефона/email не входят в действие «все реквизиты»; это отдельные контакты. Никаких демонстрационных/пустых значений в production payload нет.

Leaf получает только готовый text и переводимые подписи состояния/варианта кнопки. Оба экземпляра (IBAN и полный набор) имеют независимое локальное состояние; Clipboard read, storage, telemetry и Server Actions не нужны.

## Ошибки и свежесть

У локального подтверждённого источника нет loading/empty/network states; отсутствие обязательного значения означает незавершённую подготовку данных, а не страницу с пустым счётом. EN-001 и integration checkpoint запрещают поставку такого набора.

Данные меняются через review и deployment. Собственных HTTP-запросов, cache tags, таймеров или backend webhook для реквизитов нет. Обновление счёта требует одновременного изменения отображения и payload через единый источник.
