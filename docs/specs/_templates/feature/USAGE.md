# Як доручити AI створити frontend feature-специфікацію

Цей файл призначений користувачу й не копіюється до створеної feature.

Вкажіть AI:

- тип застосунку: React, React Native або Angular;
- клієнт: Admin, Mobile, Storefront або інший;
- точний майбутній каталог feature;
- observable goal, in-scope та out-of-scope поведінку;
- відомі API, route/deep-link, permission або platform constraints;
- файли вимог, дизайну, API-контрактів чи попередньої feature, які треба
  використати як джерело.

Готовий запит:

```text
Використай `docs/specs/_templates/feature/`.
Тип застосунку: <React | React Native | Angular>.
Створи scenario-first SDD для:
`docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.

Клієнт: <Admin React | Mobile React Native | Storefront Angular | shared>.
Мета: <спостережуваний результат для користувача>.
У scope: <поведінка>.
Поза scope: <поведінка>.
Джерела: <точні шляхи до вимог, дизайну, контрактів або related feature>.

Спочатку проаналізуй фактичну архітектуру, застосуй відповідний варіант із
`feature/variants/`, перевір Nx targets, package manager, встановлений test
tooling і наявні тести. Створи `R-*`, Given/When/Then `SC-*`, малі
`TS-*`/`EN-*` та `traceability.md`. Код застосунку не реалізовуй.
```

Якщо тип застосунку не вказано, AI повинен спочатку запитати:
`React, React Native чи Angular?` і не створювати variant-specific файли до
відповіді.

Для React Native visual/interaction contract входить у той самий варіант і
створюється разом із Mobile feature, а не як окрема feature.

Якщо джерел немає, напишіть `Джерела: немає`. Для зміни існуючої feature
вкажіть її поточний каталог і попросіть
[поступову міграцію](../MIGRATION.md), щоб зберегти завершені ID та evidence.
