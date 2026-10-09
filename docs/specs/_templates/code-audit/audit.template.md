# Архітектурний аудит коду — <назва feature>

- **Feature/SDD:** `<точний шлях>`
- **Scope:** `<projects/libraries/files and dependencies>`
- **Дата:** YYYY-MM-DD
- **Applicable rules:** `<exact docs paths/sections>`
- **Delivery status:** `<blocked | ready for verification | verified>`

## 00. Inventory і baseline

- [ ] Прочитано applicable `AGENTS.md`, inventory, architecture, standards,
      feature design/contracts/tasks і попередні audits.
- [ ] Перевірено git status/diff; сторонні зміни збережено.
- [ ] Зібрано apps, Nx projects/targets/tags, graph, aliases, configs,
      providers, source/test files і public entry points.
- [ ] Approved UI/state/API/routing/test stack підтверджено wiring, а не лише package.

## 01. Architecture matrix

| Project/module | Actual role/paths | Required owner                               | Tags     | Allowed dependencies | Finding/task          |
| -------------- | ----------------- | -------------------------------------------- | -------- | -------------------- | --------------------- |
| `<project>`    | `<paths>`         | `<model/data-access/ui/feature/core/shared>` | `<tags>` | `<direction>`        | `<AF/RM/TS/EN або —>` |

- [ ] Кожна фактична responsibility має owner; порожні layers наперед не створюються.
- [ ] Constraints дозволяють documented direction і блокують reverse/cross-scope/domain imports.
- [ ] Names, roots, tags, aliases і folder nesting узгоджені з graph.

## 02. State, API, DTO і tools

| Flow               | Actual path        | Approved path            | Forbidden bypass                  | Finding/task |
| ------------------ | ------------------ | ------------------------ | --------------------------------- | ------------ |
| `<query/mutation>` | `<UI → transport>` | `<client-specific path>` | `<direct transport/manual cache>` | `<AF/RM/TS>` |

- [ ] Server data/loading/error/cache/invalidation має approved owner.
- [ ] UI не викликає API/router/storage і отримує values/errors/callbacks.
- [ ] Generated DTO private; runtime validator + mapper повертають domain model.
- [ ] Cancellation, normalized errors, retry, cache keys/tags та invalidation перевірені.
- [ ] Direct `fetch`/Axios і manual lifecycle search класифіковано з exact evidence.

## 03. UI і feature orchestration

- [ ] Page/screen є thin orchestrator; reusable presentation має typed props.
- [ ] Pure rules належать model, domain UI — domain `ui`, app composition — app/core contract.
- [ ] Routes, forms, dialogs, lists і state views перевірено на незалежні lifecycle.
- [ ] Рішення split/keep має причину; line count сам по собі не є правилом.

## 04. Public API і structure

- [ ] Root `src/index.ts` та exact aliases є єдиними cross-library entry points.
- [ ] Barrels не експортують private DTO/mapper/parser/client/interceptor/storage.
- [ ] Немає cycles, deep imports, duplicate owners, empty/dead folders або stale docs.

## 05. Testing і executable tooling

- [ ] Перевірено реальні lint/source typecheck/test typecheck/test/build targets і configs.
- [ ] Щонайменше один executable relevant test підтверджує заявлений test level.
- [ ] До moves визначено characterization; після кожного RM повторюються focused checks.
- [ ] Boundary rules мають positive/negative fixture або еквівалентне evidence.

## Findings

| ID     | Severity     | Rule            | Owner     | Evidence              | Task         | Depends on   | Exact paths | Verification     | Target state  | Status |
| ------ | ------------ | --------------- | --------- | --------------------- | ------------ | ------------ | ----------- | ---------------- | ------------- | ------ |
| AF-001 | `<severity>` | `<doc#section>` | `<owner>` | `<path:line/command>` | `<RM/TS/EN>` | `<IDs/none>` | `<paths>`   | `<command/test>` | `<condition>` | `open` |

## File decisions

| Path/area | Roles     | Decision                   | Target owner/path | Reason  | Evidence         |
| --------- | --------- | -------------------------- | ----------------- | ------- | ---------------- |
| `<path>`  | `<roles>` | `<move/split/keep/delete>` | `<path>`          | `<why>` | `<test/command>` |

## Final gate

- [ ] Усі in-scope findings `verified`; approved deferrals не є prerequisites.
- [ ] Tree, graph, aliases/barrels і forbidden searches повторно перевірені.
- [ ] Focused/regression evidence записане у tasks і traceability.
