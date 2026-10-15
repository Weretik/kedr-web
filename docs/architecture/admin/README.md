# Архітектура Admin

**Область:** React-застосунок `apps/admin` у Nx-монорепозиторії  
**Підхід:** гібридний domain-first

**Стан:** [наявні Nx-модулі](structure/modules.md) і цільові межі в документах нижче описані окремо.

## Призначення

Документи задають архітектурний контракт розробки Admin: межі доменів,
допустимі залежності, організацію стану й API, правила Nx та SDD-процес. Нову
можливість спочатку описують специфікацією, а потім реалізують у цих межах.

## Карта документів

### Структура й залежності

- [Наявні модулі та маршрути](structure/modules.md)
- [Домени та внутрішня структура feature](structure/domains.md)
- [Правила залежностей](structure/dependencies.md)
- [Nx-контракт і публічний API](structure/nx-contract.md)

### Робота застосунку

- [Застосунок і маршрутизація](runtime/application.md)
- [Стан, API та форми](runtime/state-and-api.md)

### Процес і рішення

- [SDD-процес і відкриті рішення](sdd-process.md)
- [ADR Admin](adr/)

Пов’язані стандарти:

- [Індекс frontend rules](../../standards/README.md)
- [Організація коду Admin](../../standards/admin/admin-code-organization.md)
- [Інтерфейс Admin](../../standards/admin/admin-ui.md)
- [API та data rules](../../standards/shared/api-data-rules.md)
- [Testing rules](../../standards/shared/testing-rules.md)
- [Delivery rules](../../standards/shared/delivery-rules.md)
