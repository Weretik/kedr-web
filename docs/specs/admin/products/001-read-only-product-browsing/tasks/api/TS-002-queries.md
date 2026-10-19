# TS-002 — Запити без фото й деталей

**Covers:** SC-002, SC-004, SC-005, SC-006. **Depends on:** EN-001. **Статус:** planned.

**Шляхи:** `libs/admin/products/data-access/src/api/`, `libs/admin/products/data-access/src/mappers/`, `libs/admin/products/data-access/src/validators/`, `libs/admin/products/model/src/` за потреби.

**Робота:** базові RTK Query endpoints реалізовано. Інкремент: після backend OpenAPI sync додати `exportToSite` у модель списку, tri-state query всіх товарів і пошук/чотири ознаки/sort режиму без фото. Переключити картку з public detail на Admin detail за slug із двома назвами й ознаками. Runtime validation, mapping, 404/error handling та cache identity за всіма параметрами; DTO не експортувати в UI.

**Рівень:** unit mapper + focused integration endpoint. **Докази:** тести змінених mapper/query і контракту; повний прогін лише на запит. **Checkpoint:** list, missing-photo й Admin detail валідовані та типізовані для feature.
