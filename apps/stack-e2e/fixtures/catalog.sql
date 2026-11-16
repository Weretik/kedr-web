-- Test catalog for the full-stack e2e checks. In production these rows come from 1C, which the tests never call.
-- Runs once on the empty database right after the KedrStore migrate job; ids 700001+ are outside the 1C range.
BEGIN;

-- 12: Catalog:Pricing:RetailPriceTypeId, the retail price on the site; 11 stays so an older KedrStore
-- master, whose product page still defaults to 11, shows the same price.
INSERT INTO "PriceType" ("Id", "PriceTypeName") VALUES (11, 'Роздрібна (сторінка товару)'), (12, 'Роздрібна');

INSERT INTO "ProductCategories"
  ("Id", "ProductTypeIdOneC", "Name", "Slug", "ParentId", "Path", "Level", "ShortNameUk", "ShortNameRu", "SortOrder", "IsDeleted", "IsShownOnSite")
VALUES
  (5513, '000005513', 'Фурнітура', 'furnitura', NULL, '5513', 0, 'Фурнітура', 'Фурнитура', 0, false, true),
  (6488, '000005513', 'Ручки-кноби', 'ruchky-knoby', 5513, '5513.6488', 1, 'Ручки-кноби', 'Ручки-кнобы', 7, false, true);

INSERT INTO "Products"
  ("Id", "ProductTypeIdOneC", "Name", "ProductSlug", "CategoryId", "Photo", "Sсheme", "Stock", "IsSale", "IsNew", "QuantityInPack", "CreatedAt", "IsDeleted", "ExportToSite")
VALUES
  (700001, '000005513', 'Ручка-кноб E2E Тест', 'ruchka-knob-e2e-test', 6488, '', '', 25, false, true, 10, now(), false, true),
  (700002, '000005513', 'Ручка-кноб E2E Другий', 'ruchka-knob-e2e-druhyi', 6488, '', '', 0, false, false, 10, now(), false, true);

INSERT INTO "ProductTranslations" ("ProductId", "Language", "Name", "CreatedAt", "IsDeleted")
VALUES
  (700001, 'ru', 'Ручка-кноб E2E Тест', now(), false),
  (700002, 'ru', 'Ручка-кноб E2E Второй', now(), false);

INSERT INTO "ProductPrices" ("ProductTypeIdOneC", "ProductId", "PriceTypeId", "Amount", "Currency")
VALUES
  ('000005513', 700001, 11, 350.00, 'UAH'), ('000005513', 700001, 12, 350.00, 'UAH'),
  ('000005513', 700002, 11, 410.00, 'UAH'), ('000005513', 700002, 12, 410.00, 'UAH');

-- The site lists read this projection; the 1C sync rebuilds it, so the fixture writes it directly.
INSERT INTO "ProductListProjections"
  ("ProductId", "NameUk", "NameRu", "ProductSlug", "Photo", "CategoryId", "InStock", "IsSale", "IsNew", "RetailPrice", "SearchTextUk", "SearchTextRu", "CategorySlug", "ExportToSite")
VALUES
  (700001, 'Ручка-кноб E2E Тест', 'Ручка-кноб E2E Тест', 'ruchka-knob-e2e-test', '', 6488, true, false, true, 350.00, 'ручка-кноб e2e тест', 'ручка-кноб e2e тест', 'ruchky-knoby', true),
  (700002, 'Ручка-кноб E2E Другий', 'Ручка-кноб E2E Второй', 'ruchka-knob-e2e-druhyi', '', 6488, false, false, false, 410.00, 'ручка-кноб e2e другий', 'ручка-кноб e2e второй', 'ruchky-knoby', true);

COMMIT;
