# <remediation> — root-cause analysis

## Earliest failing gate

<Який найраніший architecture/readiness/tooling gate дозволив порушення?>

## Contributing causes

| Source/process           | Gap                          | Evidence      | Why it allowed the finding | Correction |
| ------------------------ | ---------------------------- | ------------- | -------------------------- | ---------- |
| `<template/rule/config>` | `<missing/conflicting rule>` | `<path:line>` | `<causal link>`            | `<RM/EN>`  |

Відрізняйте root cause від місця, де порушення стало видимим. Кожна process
correction має owner і task; аналіз не замінює code remediation.
