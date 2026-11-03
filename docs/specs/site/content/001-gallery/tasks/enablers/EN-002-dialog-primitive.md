# EN-002 — Общий Dialog для просмотра медиа

- **Status:** verified, 2026-11-03.
- **Enables:** SC-005, SC-006, SC-007, TS-004.
- **Depends on:** нет.
- **Exact paths:** libs/site/shared/ui/src/lib/dialog.tsx; dialog.spec.tsx рядом; libs/site/shared/ui/src/index.ts. Existing components.json определяет new-york, RSC и пути.
- **Test level:** проверка генерации + component для public primitive contract.
- **Architecture baseline:** shared UI владеет Radix primitive, content/ui — содержимым viewer; существующий Sheet сохраняется.

## Work

- [x] Из libs/site/shared/ui вызвать `npx shadcn@latest add dialog`; официальный output получен через dry-run/view.
- [x] Привести output к существующим cn, tokens, Lucide и установленному radix-ui. Не сохранять лишние зависимости или global CSS по умолчанию.
- [x] Дать минимальный public Dialog API, локализованное accessible close name; без gallery-specific text.
- [x] Проверить открытие/закрытие, заголовок, focus containment/return на primitive harness; бизнес-навигация фото проверяется TS-004.
- [x] Проверить локальный diff/роли; Sheet и его пользователи не переписываются.

## Evidence

CLI add dialog --dry-run --view в shared/ui не разрешил Nx aliases. Официальный output получен тем же CLI в isolated fixture с new-york/RSC/Tailwind4, адаптирован к cn/radix-ui/Lucide и closeLabel. Config/dependencies реального проекта не менялись.

Red 3 cases: 2 ожидаемых failures локализованного close,1 focus pass. Green 3/3. Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --maxWorkers=1 --no-file-parallelism --config libs/site/shared/ui/vite.config.mts src/lib/dialog.spec.tsx`.

Startup fork/threads timeouts были инфраструктурными, не behavioral results. Последовательный jsdom worker 512 MiB прошёл. Sheet не переписывался, primitive/business viewer разделены.

## Checkpoint

Доступный Dialog exported через @site/shared/ui, tokens/locale names работают, focused primitive test проходит; TS-004 может использовать его без импорта Sheet internals или прямого обхода слоя.
