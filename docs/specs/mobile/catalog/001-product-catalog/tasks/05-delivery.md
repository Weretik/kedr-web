# Фаза 05 — Delivery

- [x] T021 Оновити API contract, plan constitution check, route public exports і task statuses.
- [x] T022 Виконати команди з `quickstart.md` та зафіксувати фактичні результати.
- [ ] T023 Пройти всі P1–P3 scenarios, loading/empty/error/offline, accessibility і Samsung Galaxy A12/web checks.
- [x] T024 Заповнити `checklists/delivery.md` і зафіксувати residual risks або API limitations.

## Checkpoint

Delivery готовий або blocker має owner, API contract reference і наступний крок.

## Blockers

- **T023 manual acceptance:** owner — mobile QA або розробник із Samsung Galaxy
  A12 та browser session; scope — P1–P3, loading/empty/error/offline,
  accessibility і Android/web сценарії з `quickstart.md`; next step — виконати
  сценарії на device та web runtime.
- **Web export / Expo Doctor:** owner — mobile infrastructure; scope — Expo
  bundler timeout і duplicate native dependencies; next step — повторити export
  у CI/локальному runtime та виконати dependency deduplication окремою задачею.
