# Start implementation after approval

```text
Follow `$frontend-remediation-plan` and
`$frontend-code-audit`.
SDD: `docs/specs/architecture/001-workspace-layers-and-boundaries/`.
Scope: `<approved EN-*/RM-* or the full remediation>`.

Execute tasks according to Depends on. Do not change observable behavior. After each RM-*,
update AF evidence, traceability, and audit. Do not complete delivery until all
in-scope AF-* findings are verified and final graph/lint/source+test typecheck/tests/
contracts/builds/docs checks pass. Deferred items require separate explicit approval
and are not allowed for prerequisites.
```

Recommended initial scope after approval: `EN-001`, `EN-002`, `EN-003`,
then `RM-001`. This establishes a safety net before structural moves.
