---
name: kedr-feature-orchestrator
description: 'Use when implementing an accepted Kedr Web feature specification with multiple agents and coordinating dependency-aware delivery, integration, verification, audit, and PR handoff.'
---

# Kedr Feature Orchestrator

Координуй multi-agent реалізацію лише для вже створеної та прийнятої feature-специфікації. Цей skill не створює specification і не обходить readiness gate.

## Required input

- Exact path до feature specification під `docs/specs/`.
- Підтверджений implementation scope: whole feature, phase, `SC-*`, `TS-*` або `EN-*`.
- Явний запит користувача на multi-agent delivery.
- Окреме явне рішення щодо Git commits. За замовчуванням agents не commit, не push і не створюють PR.

Якщо specification відсутня, не прийнята або містить unresolved `[NEEDS CLARIFICATION: ...]`, зупинись і маршрутизуй роботу через `$kedr-feature-spec`.

## Workflow

### 1. Load the accepted specification

1. Прочитай кореневий `AGENTS.md`, усі feature artifacts, frontend inventory, relevant client architecture, standards і вкладені `AGENTS.md`.
2. Прочитай `docs/specs/_templates/ai-feature-workflow/README.md` і workflow-файли `01`–`04`.
3. Підтвердь readiness checklist, accepted requirements, authorized scope і відсутність delivery blockers.
4. Для existing code переконайся, що baseline audit phases `00`–`01` виконані. Якщо ні, спочатку застосуй `$kedr-code-audit`.

### 2. Build the delivery graph

1. Побудуй dependency graph для in-scope `SC-*`, `TS-*` і `EN-*`.
2. Визнач dependency-ready work packets. Не паралель tasks, якщо один використовує output іншого.
3. Признач одного owner для кожного mutable path. Shared integration files і feature evidence залиш coordinator-owned.
4. Обмеж початкову хвилю двома або трьома незалежними agents; збільшуй concurrency лише за наявності чітких path boundaries.

### 3. Delegate bounded work

Для кожного work packet створи task contract за `references/delegation-contract.md`. Контракт має містити source IDs, exact scope, allowed і forbidden paths, dependencies, expected deliverables, verification та Git mode.

Кожен implementation agent повинен застосувати `$kedr-feature-delivery` до свого scope. Для API contract work маршрутизуй packet через `$kedr-api-contract-sync`.

У shared workspace паралельно дозволені лише read-only дослідження або edits із непересічними path ownership. Якщо agents мають змінювати пов'язані файли, використовуй ізольовані worktrees лише коли користувач явно погодив такий режим; інакше виконуй packets послідовно.

Agents не редагують спільне feature evidence одночасно. Вони повертають coordinator exact commands, results, changed paths, residual risks і запропоновані evidence updates.

### 4. Integrate each wave

1. Дочекайся завершення всіх agents поточної хвилі.
2. Переглянь scoped diffs і перевір дотримання ownership. Не приймай unrelated changes.
3. Інтегруй результати dependency order, запусти narrow checks і тільки після цього розблокуй наступну хвилю.
4. Coordinator одноосібно оновлює shared status, traceability та evidence у feature artifacts.
5. Якщо користувач дозволив commits, створи невеликі atomic commits за commit strategy з AI feature workflow. Один commit має представляти одне завершене логічне change; не включай сторонні user changes.

### 5. Run independent quality gates

Після останньої integration-зміни запусти на одному integrated snapshot:

- `$kedr-change-verification` для risk-appropriate tests, type checks, architecture, contracts і docs checks;
- `$kedr-code-audit` phases `00`–`06` як незалежний review.

Verification та read-only audit можуть виконуватися паралельно. Audit agent повертає findings coordinator; тільки coordinator записує shared audit artifact. Open, blocked або planned in-scope `AF-*` блокують completion. Systemic findings маршрутизуй через `$kedr-remediation-plan`.

### 6. Prepare handoff

Коли всі tasks, verification і audit gates завершені, застосуй `$kedr-pr-handoff`. Підготуй review-ready summary, але не push, не створюй і не merge PR без окремого прямого запиту.

## Stop conditions

Зупини orchestration і повідом blocker, якщо:

- specification не пройшла readiness або scope неоднозначний;
- два packets потребують concurrent edits того самого path;
- dependency, tooling або architecture exception не має погодженого `EN-*`;
- agent виявив out-of-scope behavior або contract change;
- required verification не може бути виконана;
- залишилися open in-scope audit findings.

## Coordinator report

На кожній межі хвилі коротко повідомляй active packets, owners, completed evidence, blockers і наступний dependency-ready крок. Фінальний звіт має містити implemented IDs, changed paths, commits за наявності, exact verification results, audit status і PR handoff.

## Example

`Use $kedr-feature-orchestrator to implement the accepted specification at docs/specs/admin/orders/012-refund/ with multiple agents, atomic commits, and a stop before push or PR creation.`
