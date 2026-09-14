# AI feature workflow

Це точка входу для реалізації прийнятої scenario-first frontend
специфікації. Користувач може дозволити всю feature, фазу, набір `SC-*` або
конкретні `TS-*`/`EN-*`.

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `docs/specs/<client>/<domain>/<NNN>-<feature-slug>/`.
Scope: <уся feature | фаза | SC-IDs | TS/EN IDs>.
```

У межах дозволеного scope AI сам переходить між усіма ready tasks. Межа
task-файлу або фази не потребує додаткової команди.

Перед виконанням AI визначає variant (`react`, `react-native` або `angular`) і
зчитує фактичні Nx targets. Поточні verified entrypoints для React Web та
React Native зафіксовані у
[testing-rules.md](../../../standards/testing-rules.md); команди з task-файлу
не мають суперечити цьому baseline.

## Workflow

1. [Resolve context and scope](01-context-and-scope.md).
2. [Select ready tasks](02-task-selection.md).
3. [Execute and record evidence](03-execution-and-evidence.md).
4. [Verify and hand off](04-verification-and-handoff.md).

Готові українські запити містить [USAGE.md](USAGE.md).
