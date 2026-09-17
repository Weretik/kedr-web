# Фаза 04 — Delivery

- [x] T015 Оновити contracts, public exports і `quickstart.md` з фактичними результатами у `docs/contracts/catalog/admin-categories.md` та `docs/specs/mobile/catalog/002-category-filter/`.
- [x] T016 Виконати automated commands з `quickstart.md` і зафіксувати результати або scoped blockers.
- [ ] T017 Виконати Android Expo Go та web manual acceptance: tree, apply/reset, loading/empty/error/retry, accessibility і pagination reset.
- [ ] T018 Підтвердити з backend-власником access policy `GET /api/categories` для mobile production traffic; якщо не підтверджено, не випускати feature поза internal/admin surface.

## Checkpoint

Delivery готовий після verification evidence і backend access confirmation, або
blocker має owner, scope та наступний крок.

## Blockers

- **Android Expo Go і ручний web acceptance (T017):** owner — mobile QA або
  розробник із підключеним Android пристроєм і browser session; scope — сценарії
  з `quickstart.md`; next step — виконати їх на device та web після доступу до
  runtime.
- **Production access policy (T018):** owner — backend-власник endpoint
  `GET /api/categories`; scope — authorization для mobile production traffic;
  next step — надати письмове підтвердження policy або захистити endpoint перед
  rollout.
- **Web export:** owner — mobile infrastructure; scope — Expo bundler timeout
  та duplicate native dependencies, виявлені Expo Doctor; next step — повторити
  export у CI/локальному середовищі й окремо вирішити deduplication поза цією
  feature.
