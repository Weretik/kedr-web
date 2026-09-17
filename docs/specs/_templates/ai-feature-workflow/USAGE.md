# Готові запити для роботи з feature

У кожному запиті вкажіть точний каталог feature та scope. Окрема команда для
кожного task-файлу в уже дозволеному scope не потрібна.

## Старт усієї feature

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: уся прийнята feature.
Виконай усі ready tasks за залежностями до delivery checkpoint.
```

### _Повний приклад для конкретної feature_

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.

Feature:
`docs/specs/mobile/catalog/004-product-details/`.

Scope: уся прийнята feature.

Виконай усі ready `EN-*` і `TS-*` за залежностями до delivery checkpoint.
Реалізуй перехід із поточної картки товару на сторінку деталей, API integration,
gallery, усі стани, повернення зі збереженням catalog state та додавання до
кошика.

Для libraries, dependencies і scaffolding використовуй Nx, Expo та npm CLI там,
де це передбачено специфікацією. Для стандартних UI-задач використовуй обрані
готові packages і чинні React Native Paper components; не створюй власні
аналоги carousel, image cache, action sheet або Snackbar.

Виконай required lint, typecheck, Jest/RNTL, contract, Expo export і доступні
device/visual checks. Онови task evidence, traceability та delivery checklists.
Не виконуй push і не створюй PR.
```

## Продовження

```text
Продовжуй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: <попередній або новий точний scope>.
Звір task statuses, traceability, evidence і git diff; почни з першої ready
незавершеної задачі та не повторюй завершену роботу.
```

## Виконати фазу

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: фаза `<NN>`.
Виконай усі ready TS/EN цієї фази та required checks. Не виходь за scope.
```

## Виконати сценарії

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: `SC-001`, `SC-002` і всі їхні required `TS-*`/`EN-*`.
Доведи observable behavior і онови task evidence та traceability.
```

## Виконати конкретні задачі

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: `TS-004`, `EN-002`.
Перевір dependencies, виконай checkpoint-и та зафіксуй evidence.
```

AI завершує весь готовий дозволений scope і зупиняється тільки після його
завершення або через конкретний blocker.
