# <Назва feature> — traceability

| Scenario | Rules | Tasks/enablers | Test level  | Tests                            | Evidence                                                  | Status  |
| -------- | ----- | -------------- | ----------- | -------------------------------- | --------------------------------------------------------- | ------- |
| SC-001   | R-001 | TS-001, EN-001 | component   | `<exact test path>::<test name>` | [TS-001 evidence](tasks/<area>/TS-001-<slug>.md#evidence) | planned |
| SC-002   | R-001 | TS-002         | integration | `<exact test path>::<test name>` | [TS-002 evidence](tasks/<area>/TS-002-<slug>.md#evidence) | planned |

Використовуй один рядок на `SC-*`. Тут міститься тільки зв'язок
`SC → TS/EN → tests → evidence` і статус. Деталі правил, робіт, рішень,
команд і результатів зберігай у їхніх source-документах. Infrastructure smoke
без бізнес-поведінки не прив'язуй до `SC-*`. Для відсутнього mobile E2E вказуй
`EN-*` і `planned`, а не вигаданий test path або evidence.
