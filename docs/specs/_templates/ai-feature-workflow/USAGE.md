# Готові запити для роботи з feature

Вкажіть точний каталог прийнятої feature та scope.

## Реалізація одним агентом

```text
$kedr-feature-delivery

Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: <уся feature | фаза | SC-* | TS-* | EN-*>.
Коміти: <не створюй | atomic>.
Не виконуй push і не створюй PR.
```

## Реалізація кількома агентами

```text
$kedr-feature-orchestrator

Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: <уся feature | фаза | SC-* | TS-* | EN-*>.
Коміти: <не створюй | atomic>.
Не виконуй push і не створюй PR.
```

## Продовження

```text
$kedr-feature-delivery

Продовжуй feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: <точний scope>.
Не повторюй завершені tasks.
```
