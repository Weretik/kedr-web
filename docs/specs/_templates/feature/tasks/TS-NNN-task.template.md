# TS-<NNN> — <one technical responsibility>

- **Task ID:** TS-<NNN>
- **Covers:** SC-<NNN>[, SC-<NNN>]
- **Depends on:** <TS/EN IDs or none>
- **Exact paths:** <implementation path>; <test path>
- **Test level:** <unit | focused integration | component | integration | E2E | manual | documentation>
- **Architecture baseline:** <projects/tags/owner/public API/tool; AF/RM dependency or none>

## Work

- [ ] <smallest implementation or verification action>
- [ ] <only steps belonging to this responsibility>
- [ ] Перевірити змінені implementation-файли на цілісність відповідальності.
      Якщо файл поєднує кілька незалежних відповідальностей або став завеликим
      для зрозумілої підтримки й тестування, розділити його на кілька файлів за
      чинними архітектурними межами; не ділити малий цілісний файл лише через
      його розмір.
- [ ] Оновити code audit; не закривати task з in-scope open/blocked/planned finding.

## Evidence

- Test/path and observable assertion:
- Red command and expected behavioral failure:
- Green command and result:
- Refactor note and focused rerun:
- Regression command and result:
- Manual/visual evidence, if required:
- Deviation or blocker:

## Checkpoint

<One verifiable condition proving this responsibility is complete.>

Execution rules are in
[testing-rules.md](../../../../standards/testing-rules.md) and the
[AI feature workflow](../../ai-feature-workflow/README.md); do not copy them
into this task.
