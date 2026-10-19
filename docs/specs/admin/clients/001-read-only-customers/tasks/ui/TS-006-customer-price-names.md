# TS-006 — Назви типів цін і категорій у картці клієнта

**Covers:** SC-008, R-005. **Depends on:** синхронізований frontend snapshot/generated types. **Статус:** реалізовано; snapshot синхронізовано з backend commit `8fc8729`.

**Межа:** `libs/admin/clients/{data-access,model,ui}/src/` і цільові тести цих модулів; `CustomerDetailsPage` змінювати лише за потреби композиції.

1. Backend OpenAPI підтвердив `defaultPriceTypeName`, `categoryName`, `priceTypeName` як nullable. Після синхронізації frontend snapshot прибрати розбіжність generated type.
2. На межі data-access валідувати й відобразити назви в модель клієнта. У read-only картці показати назви типів цін, а категорію — назвою та ID; `null` показати як «Назва недоступна».
3. Додати вузькі mapper/component тести для наявних назв, відсутньої назви й декількох категорій. Оновити [опис фічі](../../../../../../features/admin/clients.md) за фактичним кодом; браузер — лише після окремого дозволу.
