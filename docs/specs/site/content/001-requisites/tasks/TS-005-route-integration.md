# TS-005 — Подтверждённый источник и server route

- **Status:** verified 2026-11-03; server integration + source/type wiring.
- **Covers:** SC-001…SC-003, SC-011, SC-013, SC-014, SC-016.
- **Depends on:** EN-001, TS-001, TS-002, TS-003, TS-004.
- **Точные пути:** `libs/site/core/config/src/lib/company-requisites.ts`; `libs/site/core/config/src/index.ts`; `libs/site/content/feature/src/lib/requisites-page.tsx` и `requisites-page.spec.tsx` в том же lib; `libs/site/content/feature/src/index.ts`; `apps/site/src/app/[locale]/(content)/requisites/page.tsx`.
- **Test level:** server integration; source/type integration route.
- **Baseline:** [Next.js contract](../design/nextjs.md), COMPANY и существующий contacts route.

## Work

- [x] Только после EN-001 создать COMPANY_REQUISITES с подтверждёнными строками; config не импортирует domain model.
- [x] Составить details из COMPANY_REQUISITES + COMPANY, получить dictionary и pure copy payload.
- [x] Вывести RequisitesContent и BreadcrumbList через existing JsonLd; без второго main или дублирующей Organization.
- [x] Сделать thin route: await params, isLocale/notFound, feature call; metadata delegation после guard.
- [x] Сохранить прежние URL и имеющийся footer target; next.config/shell API не изменять.
- [x] Проверить исходный server HTML: подтверждённые факты до hydration, одна H1, корректный payload и BreadcrumbList.
- [x] Проверить карту ответственности config/feature/route; не смешивать formatter, copy-state и JSX в route.
- [x] Сохранить соседние exports и внешние незакоммиченные изменения.

## Evidence

Выполнено P4 после EN-001 и готовности model/SEO/UI. Coordinator создал подтверждённый config source и public exports; порядок данных/имя/банк согласованы владельцем.

- Target подтверждён: `npx nx show project site-content-feature --json`, exit 0.
- Команда: `npx nx run site-content-feature:vite:test -- --run src/lib/requisites-page.spec.tsx`.
- Valid Red: exit 1, 3 failed / 2 passed — отсутствовали обе BreadcrumbList, а full-copy получал только IBAN.
- Green/final regression: exit 0, 1 file / 5 tests passed, без cache hit.
- SSR обеих локалей содержит все 6 source values и оригинальное UAимя; одна H1, нет nested main/form/iframe; один absolute BreadcrumbList без Organization/WebSite дубля.
- Реальные UI controls в jsdom получают raw IBAN и полный шестистрочный RU payload; UI не mock.
- Prettier и scoped ESLint 3 новых файлов exit 0. Thin route ожидает Promise params и имеет isLocale/notFound в page и metadata.
- `npx nx run site:typecheck --output-style=static`: exit 0, Nx cache 1/1 (вывод переиспользован; свежий процесс compiler не заявляется).
- HTTP/status/head/browser/build не запускались. Source/type доказательство SC-016 не является реальным HTTP 404.

## Checkpoint

Подтверждённые данные соединены через разрешённые public APIs, server integration pass, route следует actual Next convention и сохраняет адрес. Ни одна неподтверждённая строка snapshot не попала в production default.
