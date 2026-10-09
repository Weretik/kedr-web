# Root cause — чому architecture drift проходив delivery

## Висновок

Попередній процес перевіряв поведінку й локальну cohesion, але не вимагав
повного project graph/data tool/public API baseline і не блокував delivery через
system finding. Частина standards також змішувала три різні client stacks.

| Cause                          | Evidence                                                           | Effect                                         | Correction                                 |
| ------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------ |
| Partial Nx matrix              | no general model/domain rule; Storefront app untyped               | lint passes reverse or ambiguous edges         | EN-002 + RM-001                            |
| Impossible Mobile ownership    | docs said store belongs core and core cannot depend domain         | shell imports orders reducer                   | docs aligned; RM-002 moves composition     |
| Current-code bias              | templates asked to inspect existing boundaries without rule matrix | public barrels/manual state treated as pattern | architecture baseline + full audit         |
| Generic API rule               | blanket RTK instruction despite Angular Storefront                 | wrong remediation could be prescribed          | client-specific rule now explicit          |
| Non-blocking findings          | delivery allowed risks/tasks without verified state                | debt survived completed features               | `AF-*` gate in workflow/delivery           |
| Tool presence used as evidence | inferred empty test targets/configs                                | structural moves lacked characterization       | EN-001/EN-003 and executable-test rule     |
| Version snapshots duplicated   | old Expo/RN/Node values in prose                                   | stale setup and verification claims            | factual inventory plus reduced duplication |

Першою процесною помилкою була readiness: target graph, approved data stack і
executable test evidence не були prerequisites. Оновлений порядок:
inventory → rules/constraints → remediation prerequisites → behavior work →
full audit → verified findings → delivery.
