# TS-005 — Приймання клієнтів

**Covers:** SC-001–SC-007. **Depends on:** TS-001, TS-002. **Статус:** план інкременту.

**Шляхи:** `docs/features/admin/clients.md`, `docs/features/admin/README.md`, `docs/specs/admin/clients/001-read-only-customers/traceability.md`, релевантні тести Admin.

**Робота:** звірити server search/page і filtered count списку, картку та застосовні loading/empty/error стани; пересвідчитись у відсутності фільтрів колонок, сортування, окремої форми пошуку й пояснювального підпису. За кодом перевірити breakpoints, світлу/темну тему й українську локаль. Звірити фактичний feature опис, Mermaid і дерево. Запустити лише автоматичні тести цієї фічі за [правилами обсягу](../../../../../../standards/shared/testing-rules.md#обсяг-перевірок-під-час-реалізації); локальний lint/typecheck додавати тільки для конкретного непокритого ризику. Не відкривати браузер, не проводити ручну/візуальну перевірку чи E2E без окремого запитання та прямого дозволу користувача. Повні `test:web`, `typecheck:tests:web`, `contracts:check`, `architecture:boundaries` і production build — лише за прямим запитом користувача.

**Рівень:** focused component/integration tests зміненої фічі. **Докази:** команди, результати, обмеження й ризики записати тут. **Checkpoint:** traceability посилається на фактичні докази.
