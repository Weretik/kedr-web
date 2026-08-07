# Фаза 01 — Foundation

- [x] T004 Перевірити Nx tags, aliases і public exports для `libs/mobile/catalog/{model,data-access,ui,feature}`.
- [x] T005 Створити чотири catalog domain libraries лише після T002.
- [x] T006 Додати `CatalogProduct`, `CatalogQuery`, pagination і filter/sort domain types у `libs/mobile/catalog/model/src/`.
- [x] T007 Додати data-access API boundary, private DTO і mappers у `libs/mobile/catalog/data-access/src/`.

## Checkpoint

Foundation не змінює shell, router або global providers; P1 може використовувати один typed catalog query. Пряма TypeScript-перевірка `data-access` наразі зупиняється на незмінених `TS4111` у `@mobile/shared/api-client` і `@mobile/shared/config`; результат зафіксовано у `quickstart.md`.
