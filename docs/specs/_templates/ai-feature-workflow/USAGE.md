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
