# Admin architecture

**Scope:** React application `apps/admin` in the Nx monorepo\
**Approach:** hybrid domain-first

**Status:** [existing Nx modules](structure/modules.md) and target boundaries are described separately in the documents below.

## Purpose

These documents define the Admin engineering architecture contract: domain boundaries, permitted dependencies, state and API organization, Nx rules, and the SDD process. Describe new capabilities in a specification first, then implement them within these boundaries.

## Document map

### Structure and dependencies

- [Existing modules and routes](structure/modules.md)
- [Domains and internal feature structure](structure/domains.md)
- [Dependency rules](structure/dependencies.md)
- [Nx contract and public API](structure/nx-contract.md)

### Application runtime

- [Application and routing](runtime/application.md)
- [State, API, and forms](runtime/state-and-api.md)

### Process and decisions

- [SDD process and open decisions](sdd-process.md)
- [Admin ADRs](adr/)

Related standards:

- [Frontend rules index](../../standards/README.md)
- [Admin code organization](../../standards/admin/admin-code-organization.md)
- [Admin UI](../../standards/admin/admin-ui.md)
- [API and data rules](../../standards/shared/api-data-rules.md)
- [Testing rules](../../standards/shared/testing-rules.md)
- [Delivery rules](../../standards/shared/delivery-rules.md)
