# EN-002 — Общая корзина как внешняя предпосылка

- **Enables:** SC-003 (реальное действие), SC-011–SC-013, SC-027 (cart isolation).
- **Depends on:** отдельный cart foundation, шаг 5 [миграции](../../../../migration/README.md), после независимого этапа 4A чтения/UI/SEO; полной покупки 4B для старта foundation не требуется.
- **Status:** blocked, внешний cart owner отсутствует.
- **Owner:** frontend Kedr, владелец cart migration step.
- **Exact planned producer paths:** `libs/site/cart/{model,ui,feature}/`; `apps/site/src/app/[locale]/(private)/checkout/page.tsx`; `apps/site/src/app/[locale]/layout.tsx`; shell header/compact cart action slot; `tools/architecture/project-boundary-rules.mjs`.
- **Consumer path:** `libs/site/product/feature/src/lib/purchase/product-cart-boundary.tsx` (TS-005).
- **Test level:** focused cart-boundary integration и storage/navigation evidence владельца.
- **Baseline:** [integration contract](../../contracts/api-contract.md); core не импортирует domain, feature→feature запрещён.

## Work

- [ ] Найти/подготовить отдельно авторизованный cart SDD и согласовать его public contract: SKU/quantity, результат, count, сохранение, повторные добавления и quantity policy.
- [ ] Подтвердить рабочий локализованный адрес корзины и источник header control; не оставлять успех со ссылкой на отсутствующий `/checkout`.
- [ ] Передать product adapter проверенные public APIs cart/ui + при необходимости cart/model; зарегистрировать только необходимые documented flows из product feature.
- [ ] На уровне app обеспечить общий provider/header slot. Не импортировать cart feature из product feature и не заводить product-local persisted cart.
- [ ] Приложить evidence storage/reload, count, failure/retry и отсутствия персонализации в shared HTML. Не считать концепт evidence.
- [ ] Явно снять blocker только после проверки producer paths и signatures; до этого TS-005 не готова.

## Evidence

Предпосылка повторно проверена при реализации: libs/site/cart и planned private checkout route отсутствуют. Работы cart foundation не выполнялись; product содержит только action slot с disabled development default. TS-005/SC-012/SC-013 остаются blocked; нового contact-only fallback доступному товару нет.

Подробности: [implementation evidence](../../verification/implementation.md).

## Checkpoint

Существует единый работающий cart owner, подтверждены contract/tests/destination и разрешённый consumer flow. Иначе SC-012/SC-013 и полная поставка карточки остаются blocked. Выпуск contact-only промежуточной версии требует отдельного решения владельца и изменения требований, не подразумевается этой SDD.
