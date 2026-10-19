# TS-006 — Приймання товарів

**Covers:** SC-001–SC-010. **Depends on:** TS-001–TS-004. **Статус:** план інкременту.

**Шляхи:** `docs/features/admin/products.md`, `docs/features/admin/README.md` за зміни індексу, `docs/specs/admin/products/001-read-only-product-browsing/traceability.md`, релевантні тести Admin.

**Робота:** звірити server filter/search/sort/page і filtered count обох списків, картку Admin деталей та застосовні loading/empty/error стани; за кодом перевірити breakpoints, світлу/темну тему й українську локаль. Оновити фактичний feature опис, Mermaid і дерево. Запустити лише автоматичні тести цієї фічі за [правилами обсягу](../../../../../../standards/shared/testing-rules.md#обсяг-перевірок-під-час-реалізації); локальний lint/typecheck додавати тільки для конкретного непокритого ризику. Не відкривати браузер, не проводити ручну/візуальну перевірку чи E2E без окремого запитання та прямого дозволу користувача. Повні `test:web`, `typecheck:tests:web`, `contracts:check`, `architecture:boundaries` і production build — лише за прямим запитом користувача.

**Рівень:** focused component/integration tests зміненої фічі. **Докази:** фактичні команди, результати та ризики записати тут. **Checkpoint:** traceability відсилає до виконаних доказів, не до запланованих.
