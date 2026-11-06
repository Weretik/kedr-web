# Admin «Мої задачі» and «Звіт роботи»

**Status:** implemented. Routes: `/my-tasks` (menu «Робота» → «Мої задачі», every staff role) and `/work-report` (menu «Система» → «Звіт роботи», Admin only, `RequireRole` with `canManageUsers`). Backend: KedrStore Work module, contract [staff tasks and activity](../../contracts/openapi/work/work.openapi.yaml).

- «Мої задачі» is a board of three columns «План», «В роботі», «Готово». «Нова задача» and the edit icon open the right side panel (title up to 200, details up to 4000, «Видалити» on edit). Card buttons move a task at once: «Почати», «У план», «Повернути в роботу». «Готово» first opens a panel «Що зроблено» (required, up to 2000) that the administrator reads in the report. A task an administrator gave carries «Від адміністратора». «Готово» keeps the last 30 days.
- Under the board «Що я змінив за 7 днів» lists the person's own admin changes by day. The backend records them itself after each successful change in the admin; repeats of the same change within 10 minutes merge into one line with a count.
- «Звіт роботи»: the administrator picks a person (from the users list) and a period (7 days, 30 days, or own dates up to 92 days) and sees «Виконано» with results, «Відкриті задачі» and «Зміни в адмінці» by day. «Дати задачу» puts a task into the person's «План».

## Code structure

```text
libs/admin/work/
├── model/src/entities/                 # task, report, period, activity labels
├── model/src/mappers/                  # activity texts, Kyiv days, period, dates
├── model/src/validators/work-task-rules.ts
├── data-access/src/api/work.api.ts     # own tasks, own report, admin report and task
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/components/                  # board, task card
├── ui/src/forms/                       # task panel, «Що зроблено» panel
├── ui/src/details/                     # activity by day, task summaries
└── feature/src/                        # myTasksRoutes, createWorkReportRoutes, pages
apps/admin/src/app/router/app-router.tsx  # staff list for the report person picker
```

## Tests

- `npx nx run admin-work-model:vite:test -- --run` — activity texts and grouping by Kyiv day.
- `npx nx run admin-work-data-access:vite:test -- --run` — response mapping.
- `npx nx run admin-work-ui:vite:test -- --run` — board columns and moves.
- `npx nx run admin-work-feature:vite:test -- --run` — new task, «Готово» with the result.
- `npx nx run admin-core-shell:vite:test -- --run` — menu items by role.
