# Граф задач

1. **EN-001 — Межі й контракт.** Прийняти app-level спосіб додавання з Products, customer picker, локальний state ownership; звірити backend OpenAPI, provenance й Nx rules. Перевірка — dependency graph/контракт, без test-first для документа.
2. **TS-001 — Локальний набір.** Model, versioned persistence, invalid payload/storage failure/multi-tab cases; цільові тести Red → Green → Refactor → regression/evidence.
3. **TS-002 — Admin orders data-access.** Snapshot/generated sync, runtime schemas, mapper, RTK Query, cache invalidation; цільові contract/mapper тести.
4. **TS-003 — Таблиці й навігація.** Menu, routes, дві вкладки, URL, server sort/filter/page/search, стани та таблиці; цільові тести.
5. **TS-004 — Деталі/редагування чернетки.** Спільна композиція деталей, draft mutation, confirmation delete, 409; цільові тести.
6. **TS-005 — Оформлення.** Product add action, client selection, server quote, draft save, order submit, зміна ціни, idempotent retry, merge із чернеткою; цільові тести.
7. **TS-006 — Звірка.** Оновити `docs/features/admin/README.md` і feature-опис після реалізації; виконати лише цільові автоматичні перевірки й записати докази.

EN-001 → TS-001/TS-002 → TS-003/TS-004/TS-005 → TS-006. Backend контракт має бути версійно зафіксований до TS-002. Browser/E2E/build у цей етап не входять без окремого запиту.

## Картки задач

Новий інкремент TS-007–TS-012 та EN-002 описано в [зміні 2026-10-22](../revision-2026-10-22.md); початкові задачі нижче лишаються історією.

- [EN-001](EN-001.md)
- [TS-001](TS-001.md)
- [TS-002](TS-002.md)
- [TS-003](TS-003.md)
- [TS-004](TS-004.md)
- [TS-005](TS-005.md)
- [TS-006](TS-006.md)
- [TS-007 — badge кошика](TS-007.md)
- [TS-008 — пошук і діапазон дат](TS-008.md)
