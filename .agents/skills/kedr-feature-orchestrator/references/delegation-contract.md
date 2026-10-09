# Delegation contract

Використовуй цей contract для кожного implementation, research, verification або audit agent. Заповнюй усі поля конкретними значеннями; не залишай placeholders у відправленому завданні.

## Work packet

- Packet ID: короткий orchestration ID.
- Role: implementation, API contract, research, verification або audit.
- Source IDs: exact `SC-*`, `TS-*`, `EN-*` або `AF-*`.
- Objective: один перевірний результат.
- Inputs: feature artifacts і source paths, які agent має прочитати.
- Dependencies: completed packets або `none`.
- Allowed paths: exact files чи directories, які agent може змінювати.
- Forbidden paths: coordinator-owned, shared або unrelated paths.
- Deliverables: очікувані code, tests, docs або report-only results.
- Verification: exact narrow commands та required evidence.
- Git mode: `none` або `atomic`; завжди `no push` і `no PR`.

## Agent instructions

1. Прочитай applicable `AGENTS.md` та skill, призначений role.
2. Не розширюй source IDs, behavior або allowed paths.
3. Не редагуй shared feature evidence; поверни proposed evidence update coordinator.
4. Перед edit перевір, що allowed paths не мають concurrent owner.
5. При conflict, missing dependency, unclear requirement або required out-of-scope change зупинись і повідом blocker.
6. Якщо Git mode `atomic`, дотримуйся commit strategy з AI feature workflow і не включай unrelated worktree changes.
7. Не push, не створюй PR і не merge.

## Required handback

- Status: completed, blocked або failed.
- Source IDs handled.
- Changed paths.
- Commands run та exact results.
- Commit hashes, якщо commits були дозволені.
- Proposed feature evidence update.
- Residual risks, findings і blockers.
