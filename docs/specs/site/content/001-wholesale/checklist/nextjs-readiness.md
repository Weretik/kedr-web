# Next.js readiness

- [x] Указан exact route (content)/wholesale, async params и locale guard.
- [x] Feature/seo exports и тонкая app-composition определены.
- [x] Server Components без нового client state, cookies/headers/actions.
- [x] Cache Components наследует существующий cached category loader; нет legacy revalidate/fetch next.
- [x] Read-only API operation getCategoryTree и snapshot revision указаны; нового transport нет.
- [x] Null/partial/empty данные не уничтожают meaningful server content.
- [x] Next/Image и existing category assets остаются у catalog/ui; defaults не ломаются.
- [x] Thin route/type/metadata risks имеют focused plan.
- [ ] Реальная build route table/HTTP statuses подтверждены — unrun, нужен отдельный запрос на соответствующую проверку.

Это готовность дизайна, не результаты runtime. [Next.js дизайн](../design/nextjs.md).
