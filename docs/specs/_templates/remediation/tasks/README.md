# Граф remediation tasks

Кожна `RM-*` виправляє одну responsibility; `EN-*` створює prerequisite.
Tasks виконуються за `Depends on` і містять exact paths, before evidence,
focused regression та checkpoint.

| ID     | Responsibility   | Findings     | Depends on | Status  |
| ------ | ---------------- | ------------ | ---------- | ------- |
| EN-001 | `<prerequisite>` | `<AF або —>` | none       | planned |
| RM-001 | `<correction>`   | `<AF-*>`     | EN-001     | planned |
