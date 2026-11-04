# EN-002 — Общая корзина как внешняя предпосылка

- **Enables:** SC-003 (реальное действие), SC-011–SC-013, SC-027 (cart isolation).
- **Depends on:** отдельный cart foundation, шаг 5 [миграции](../../../../migration/README.md), после независимого этапа 4A чтения/UI/SEO; полной покупки 4B для старта foundation не требуется.
- **Status:** implemented, producer evidence verified — 2026-11-04.
- **Owner:** frontend Kedr, владелец cart migration step.
- **Actual producer paths:** `libs/site/cart/{model,data-access,ui,seo,feature}/`; `apps/site/src/app/[locale]/checkout/page.tsx`; `apps/site/src/app/[locale]/layout.tsx`; shell header/compact cart action slot; `tools/architecture/project-boundary-rules.mjs`.
- **Consumer path:** product/feature/detail server renderer handoff → app product route → cart/feature purchase renderer/controller (TS-005 coordinated by cart TS-009).
- **Test level:** focused cart-boundary integration и storage/navigation evidence владельца.
- **Baseline:** [integration contract](../../contracts/api-contract.md); core не импортирует domain, feature→feature запрещён.

## Work

- [x] Найти/подготовить отдельно авторизованный cart SDD и согласовать его public contract: SKU/quantity, результат, count, сохранение, повторные добавления и quantity policy.
- [x] Подтвердить рабочий локализованный адрес корзины и источник header control; не оставлять успех со ссылкой на отсутствующий `/checkout`.
- [x] Передать server renderer через app composition; product feature не импортирует cart. Client island работает с общим cart owner; дополнительных cross-domain flows нет.
- [x] На уровне app обеспечить общий provider/header slot. Не импортировать cart feature из product feature и не заводить product-local persisted cart.
- [x] Приложить evidence storage/reload, count, failure/retry и отсутствия персонализации в shared HTML. Не считать концепт evidence.
- [x] Явно снять blocker только после проверки producer paths и signatures; до этого TS-005 не готова.

## Evidence

2026-11-04 создан реальный producer: пять Nx cart projects, document owner/provider/cart_v1, обе кнопки шапки, drawer и локализованный checkout. Typed server callback исключает feature→feature import. Model88/storage8/provider12/owner18/runtime2 и product handoff15 подтверждают storage recovery/new document, общий count, failure/retry и нейтральный SSR. [Cart implementation evidence](../../../../cart/001-cart-checkout/verification/implementation.md). EN-002 снята; snapshot/generated не менялись. Browser/live HTTP/build/deployment не запускались.

## Checkpoint

Существует единый работающий cart owner, подтверждены contract/tests/destination и разрешённый consumer flow. Checkpoint подтверждён автоматическими/source проверками. Выпуск contact-only промежуточной версии требует отдельного решения владельца и изменения требований, не подразумевается этой SDD.
