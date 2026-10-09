# Створити frontend feature specification

Цей файл призначений користувачу й не копіюється до feature.

```text
$kedr-feature-spec

Тип: <React | React Native | Angular>.
Клієнт: <Admin | Mobile | Storefront | shared>.
Каталог: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Мета: <результат для користувача>.
У scope: <поведінка>.
Поза scope: <поведінка>.
Джерела: <шляхи або немає>.

Створи scenario-first SDD. Код не реалізовуй.
```

## Пример

```text
$kedr-feature-spec

Тип: React Native.
Клієнт: Mobile.
Каталог: `docs/specs/mobile/catalog/004-product-details/`.
Мета: покупець може переглянути деталі товару та додати його до кошика.

У scope:
- перехід із каталогу на сторінку товару;
- назва, ціна, опис, gallery та availability;
- loading, error і unavailable states;
- додавання товару до кошика;
- повернення зі збереженням стану каталогу.

Поза scope:
- reviews;
- favorites;
- product comparison;
- checkout;
- зміни backend API.

Джерела:
- `docs/specs/mobile/catalog/003-product-list/`;
- `docs/contracts/`;
- `apps/mobile/`;
- макет: <посилання>.

Створи scenario-first SDD. Код не реалізовуй.
```

Для зміни існуючої feature вкажіть її каталог і попросіть поступову міграцію.
