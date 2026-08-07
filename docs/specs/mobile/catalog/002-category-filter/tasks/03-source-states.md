# Фаза 03 — User story P2: Зрозумілий стан джерела категорій

**Goal:** користувач бачить коректний стан categories source і може retry.

**Independent test:** у RNTL замокати pending, empty і normalized error
categories query, відкрити modal та перевірити state і callbacks.

- [x] T012 [US2] Додати presentational loading, empty і error/retry category states у `libs/mobile/catalog/ui/src/components/catalog-filters-modal.tsx`.
- [x] T013 [US2] Додати accessible labels та test cases для category selector states у `libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx`.
- [x] T014 [US2] Додати controller integration tests, що error categories не очищує loaded products і retry викликає categories refetch, у `libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx`.

## Checkpoint

Pending, empty та error states не підміняються static options; retry не порушує
застосований products query або вже видимий список.
