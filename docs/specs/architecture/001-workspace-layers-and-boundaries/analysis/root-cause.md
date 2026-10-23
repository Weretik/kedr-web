# Root cause — why architecture drift passed delivery

## Conclusion

The previous process checked behavior and local cohesion, but did not require a
complete project graph/data tool/public API baseline or block delivery on a
system finding. Some standards also conflated three different client stacks.

| Cause                          | Evidence                                                           | Effect                                         | Correction                                 |
| ------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------ |
| Partial Nx matrix              | no general model/domain rule; Storefront app untyped               | lint passes reverse or ambiguous edges         | EN-002 + RM-001                            |
| Impossible Mobile ownership    | docs said store belongs core and core cannot depend domain         | shell imports orders reducer                   | docs aligned; RM-002 moves composition     |
| Current-code bias              | templates asked to inspect existing boundaries without rule matrix | public barrels/manual state treated as pattern | architecture baseline + full audit         |
| Generic API rule               | blanket RTK instruction despite Angular Storefront                 | wrong remediation could be prescribed          | client-specific rule now explicit          |
| Non-blocking findings          | delivery allowed risks/tasks without verified state                | debt survived completed features               | `AF-*` gate in workflow/delivery           |
| Tool presence used as evidence | inferred empty test targets/configs                                | structural moves lacked characterization       | EN-001/EN-003 and executable-test rule     |
| Version snapshots duplicated   | old Expo/RN/Node values in prose                                   | stale setup and verification claims            | factual inventory plus reduced duplication |

The first process failure was readiness: the target graph, approved data stack,
and executable test evidence were not prerequisites. The updated sequence is:
inventory → rules/constraints → remediation prerequisites → behavior work →
full audit → verified findings → delivery.
