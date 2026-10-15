# Запуск implementation після погодження

```text
Працюй за `$frontend-remediation-plan` і
`$frontend-code-audit`.
SDD: `docs/specs/architecture/001-workspace-layers-and-boundaries/`.
Scope: `<погоджені EN-*/RM-* або вся remediation>`.

Виконуй tasks за Depends on. Не змінюй observable behavior. Після кожної RM-*
оновлюй AF evidence, traceability і audit. Не завершуй delivery, доки всі
in-scope AF-* не verified і final graph/lint/source+test typecheck/tests/
contracts/builds/docs checks не пройшли. Deferred потребує окремого явного
погодження і не допускається для prerequisite.
```

Рекомендований перший scope після погодження: `EN-001`, `EN-002`, `EN-003`,
потім `RM-001`. Це створює safety net до structural moves.
