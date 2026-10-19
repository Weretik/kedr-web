# Frontend engineering rules

Цей каталог містить сталі правила для frontend-змін. Feature-специфікації
посилаються на ці документи, а не дублюють їх.

## За застосунком

- **Admin React:** [організація коду](admin/admin-code-organization.md), [UI](admin/admin-ui.md), [єдиний стиль списків і деталей](admin/list-detail-pages.md), [архітектура й наявні модулі](../architecture/admin/README.md).
- **Mobile React Native:** [організація коду](mobile/mobile-code-organization.md), [UI](mobile/mobile-ui.md), [архітектура й наявні модулі](../architecture/mobile/README.md).
- **Storefront Angular:** [архітектурні межі](../architecture/storefront/README.md), [модулі](../architecture/storefront/structure/modules.md), [стан та API](../architecture/storefront/runtime/state-and-api.md). Правила React Admin і Mobile не переносяться на Angular автоматично.

## Спільні теми

- [API and data rules](shared/api-data-rules.md) — DTO, mappers, errors і contracts; для кожного клієнта враховуй його transport і state stack.
- [Testing rules](shared/testing-rules.md) — вибір перевірок та їх фіксація за наявними targets.
- [Security rules](shared/security-rules.md) — access, sessions, безпечні дані й security review за контекстом застосунку.
- [Delivery rules](shared/delivery-rules.md) — SDD flow, scope і definition of done.

Фактичні versions, projects і runnable targets не дублюються в цих правилах:
їхній поточний snapshot містить [frontend inventory](../architecture/frontend-inventory.md).
Системні розбіжності оформлюються через
remediation SDD, а не залишаються
необов'язковим residual risk.
