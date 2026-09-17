# Mobile product details — scope and outcome

## Goal

Як менеджер, я хочу натиснути товар у поточному каталозі, щоб переглянути всі
доступні деталі та зображення українською і додати доступний товар до кошика.

## In scope

- відкриття деталей із будь-якого видимого результату поточного каталогу,
  включно з результатами пошуку та фільтрації;
- пряме посилання `/product/{productSlug}`;
- завантаження `getPublicProductBySlug` лише з `lang=uk` і retail
  `priceTypeId=11`;
- відображення всіх полів, які надає чинний `ProductDetails` contract;
- gallery з основним фото та схемою, якщо відповідні URL реально завантажились;
- зрозумілі українські loading, not-found, offline, error і image fallback states;
- retry після transport failure;
- додавання однієї одиниці доступного товару з відомою ціною до локального
  Mobile cart і українське підтвердження;
- збереження query, завантажених rows і scroll position каталогу після Back;
- light/dark theme, safe area, text scaling, TalkBack/VoiceOver і web fallback.

## Out of scope

- checkout, cart screen, quantity editor, видалення з кошика та server cart sync;
- favorites, reviews, recommendation carousel, share і image zoom;
- authentication або manager-role enforcement;
- редагування товару;
- вигадане description чи нові backend fields;
- зміна OpenAPI або перевірка наявності файла окремим HEAD-запитом.

## Actors and external systems

- Менеджер: відкриває товар, переглядає дані, повертається або додає товар.
- KedrStore Catalog API: повертає українську проєкцію товару за slug.
- Image storage/CDN: фактично завантажує `photo` і `scheme` URL або повертає
  image load error.
- Local Mobile cart: зберігає доданий рядок у межах інсталяції застосунку.

## Constraints

- `ProductDetails` не має поля description. Секція опису не показується до
  появи поля в canonical backend OpenAPI.
- `photo` і `scheme` оголошені рядками, але URL може бути порожнім або вести на
  відсутній файл; успіх визначається image load event.
- Mobile authentication відкладена, а operation anonymous; слово «менеджер»
  описує аудиторію, але не створює authorization guarantee.
- Existing catalog state має лишатися власністю поточного catalog feature.

## Open product questions

Немає blocking questions. Мінімальний cart contract цієї feature: одна одиниця
за натискання, повторне натискання збільшує quantity, AsyncStorage зберігає cart
між перезапусками; cart screen і checkout потребують окремого SDD.
