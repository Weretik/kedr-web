# <remediation> — target architecture

## As-is inventory

| Project/module | Roles     | Tags/targets | Imports/tools | Problems |
| -------------- | --------- | ------------ | ------------- | -------- |
| `<path>`       | `<roles>` | `<facts>`    | `<facts>`     | `<AF-*>` |

## Target tree and ownership

```text
<exact minimal target tree>
```

| Layer/module | Owns                 | May depend on | Must not contain |
| ------------ | -------------------- | ------------- | ---------------- |
| `<model>`    | `<types/invariants>` | `<allowed>`   | `<React/HTTP>`   |

## Migration sequence

Опишіть compilable checkpoints і тимчасові compatibility exports; їх видалення
має окрему task.

## Approved tools and forbidden patterns

- Approved: `<client-specific stack>`
- Forbidden: `<imports/patterns>`
- Checks: `<commands>`

## Behavior preservation

| Contract               | Characterization/regression evidence |
| ---------------------- | ------------------------------------ |
| `<route/action/state>` | `<test/command>`                     |
