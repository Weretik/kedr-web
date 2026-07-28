# Фаза 03 — User story P3: Resilient shell states

**Goal:** shell states не перекривають navigation або touch targets.  
**Independent test:** змоделювати loading, empty та offline state у root tabs.

- [x] T013 [US3] Додати shell-consistent loading/empty presentation для Home, Catalog і Profile placeholders.
- [x] T014 [US3] Перевірити інтеграцію offline indicator із header, content і tab bar. Ручна перевірка підтверджена користувачем на Samsung Galaxy A12 і web.
- [x] T015 [US3] Використати наявний shell notification/snackbar mechanism без нового toast provider.
- [x] T016 [US3] Додати component tests для shell states.

## Checkpoint

Loading, empty, error і offline states читабельні, доступні та не перекривають safe area, header, tab bar або touch targets.
