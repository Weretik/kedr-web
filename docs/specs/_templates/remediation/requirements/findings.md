# <remediation> — findings і requirements

## Scope

- **Goal:** <target architecture state>
- **In scope:** <projects/files>
- **Out of scope:** <exclusions>
- **Behavior to preserve:** <routes/actions/contracts/states>

## Architecture requirements

- **AR-001:** `<rule>` — `<docs path#section>`.

## Findings

| ID     | Severity     | Violates | Owner     | Evidence              | Impact   | Task/deps               | Exact paths | Verification | Target state  |
| ------ | ------------ | -------- | --------- | --------------------- | -------- | ----------------------- | ----------- | ------------ | ------------- |
| AF-001 | `<severity>` | AR-001   | `<owner>` | `<path:line/command>` | `<risk>` | `<RM/EN; dependencies>` | `<paths>`   | `<command>`  | `<condition>` |

Finding описує перевірений факт. Незалежні проблеми не об'єднуються для
скорочення task graph.
