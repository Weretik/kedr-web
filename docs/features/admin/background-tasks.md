# Admin «Фонові задачі»

**Status:** implemented. Routes: `/background-tasks` and `/background-tasks/:key` (menu «Система» → «Фонові задачі», Admin only). Backend: KedrStore Scheduling module, spec `platform/007-background-tasks`, contract [scheduling](../../contracts/openapi/openapi.json).

- One Cloud Scheduler entry calls the backend tick every minute. The task list is code (stocks, prices, catalogue, customers, orders, media, full sync, product list, outbox); the admin cannot add or rename a task.
- The list shows each task with a «Що робить?» button (opens the full description in a dialog), schedule in words, next run, one «Останній запуск» column: the time and summary of a success, or, when the last run failed, the failure time with a «Помилка» mark and a «Детальніше» button that opens the reason in a dialog («—» if it never ran). Only problems are marked (last attempt failed, missed run, running, run requested, disabled); a healthy task has no mark. The list refreshes every 30 seconds. All times are Kyiv time.
- The eye opens the task page: the same data read-only and the last 50 runs (when, by schedule or by whom, result, message). «Запустити зараз» asks the next tick to start the task within a minute; the backend refuses while it runs or is already requested, and its reason is shown.
- «Редагувати» on the task page and the pencil in the list open the right side panel «Змінити розклад»: on/off, kind (days and Kyiv times, interval with optional hours, or manual) and an optional one-time next run. The form checks the backend limits before saving (5–1440 minutes, 1–6 times, at least one day, next run in the future). The general outbox («Досилання повідомлень») runs every minute and has neither the pencil nor «Запустити зараз»; «Відправка замовлень в 1С» is editable like the others, and the panel warns while it is switched off or manual because orders then wait and do not reach 1С.

## Code structure

```text
libs/admin/scheduling/
├── model/src/entities/                       # task, schedule, run
├── model/src/forms/schedule-form.ts          # form values ↔ request
├── model/src/validators/schedule-form-rules.ts
├── model/src/mappers/                        # schedule in words, Kyiv time, problem marks, canRunNow
├── data-access/src/api/admin-scheduling.api.ts  # list, runs, schedule, run now
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/{tables,details,panels,forms,feedback}/
└── feature/src/                              # backgroundTasksRoutes, list and task pages, schedule editor, hooks, error message
```

The app router wraps the routes in `RequireRole allow={canManageBackgroundTasks}` (`@admin/core/auth`).

## Tests

- `npx nx run admin-scheduling-model:vite:test -- --run` — form rules, schedule in words, Kyiv time, problem marks.
- `npx nx run admin-scheduling-data-access:vite:test -- --run` — answer mapping, request body, run-now request.
- `npx nx run admin-scheduling-ui:vite:test -- --run` — read-only details.
- `npx nx run admin-scheduling-feature:vite:test -- --run` — list marks, outbox without actions, panel validation and save, run now and refused run.
