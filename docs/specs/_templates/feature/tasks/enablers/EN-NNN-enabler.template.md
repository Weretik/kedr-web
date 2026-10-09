# EN-<NNN> — <one shared prerequisite>

- **Task ID:** EN-<NNN>
- **Enables:** SC-<NNN>[, SC-<NNN>]
- **Depends on:** <TS/EN IDs or none>
- **Exact paths:** <configuration/source/test paths>
- **Test level:** <focused integration | integration | manual | generated verification | documentation>
- **Architecture baseline:** <projects/tags/owner/public API/tool; AF/RM dependency or none>

## Work

- [ ] <one prerequisite responsibility>
- [ ] <replacement verification needed before enabled tasks>
- [ ] Перевірити змінені implementation-файли на цілісність відповідальності.
      Якщо файл поєднує кілька незалежних відповідальностей або став завеликим
      для зрозумілої підтримки й тестування, розділити його на кілька файлів за
      чинними архітектурними межами; не ділити малий цілісний файл лише через
      його розмір.
- [ ] Оновити code audit; prerequisite checkpoint має бути executable.

## Evidence

- Why behavioral Red is not meaningful:
- Replacement command/check:
- Result:
- Enabled task IDs:
- Deviation or blocker:

## Checkpoint

<One verifiable condition proving dependent behavioral tasks can start.>

Execution rules are in
[testing-rules.md](../../../../../standards/testing-rules.md) and the
[AI feature workflow](../../../ai-feature-workflow/README.md); do not copy
them into this task.
