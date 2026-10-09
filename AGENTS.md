# AI routing for Kedr Web

Перед зміною frontend-коду або feature-специфікації:

1. Звір фактичні apps, projects, targets і test tooling з
   [frontend inventory](docs/architecture/frontend-inventory.md), потім обери застосунок:
   [Admin React](docs/architecture/admin/README.md),
   [Mobile React Native](docs/architecture/mobile/README.md) або
   [Storefront Angular](docs/architecture/storefront/README.md).
2. Прочитай відповідні правила з [індексу standards](docs/standards/README.md).
3. Для нової або зміненої поведінки використовуй `$kedr-feature-spec` і
   [scenario-first SDD templates](docs/specs/_templates/README.md).
   Якщо тип не вказано, до створення файлів запитай: React,
   React Native чи Angular.
4. Для реалізації прийнятої специфікації використовуй
   `$kedr-feature-delivery` і
   [AI feature workflow](docs/specs/_templates/ai-feature-workflow/README.md).
5. Для реалізації прийнятої специфікації кількома agents використовуй
   `$kedr-feature-orchestrator`. Він має перевірити readiness, розподілити лише
   незалежні tasks і координувати integration, verification, audit та handoff.
   Він не створює feature specification і не обходить approval gate.
6. Для повного architecture audit використовуй `$kedr-code-audit`.
   Системні architecture violations маршрутизуй через
   `$kedr-remediation-plan` і
   [remediation template](docs/specs/_templates/remediation/README.md).
7. Для HTTP-змін використовуй `$kedr-api-contract-sync`, звірся з
   [frontend API contracts](docs/contracts/README.md), знайди stable `operationId` у
   versioned snapshot і використовуй generated types з `@shared/api-contracts`
   лише на transport/data-access boundary. YAML та generated TypeScript не
   редагуй вручну; синхронізуй і генеруй CLI-командами з contracts
   README.
8. Після змін runtime-коду, tests або build/test behavior використовуй
   `$kedr-change-verification`. Перед PR handoff використовуй
   `$kedr-pr-handoff`; для перевірки drift між code і docs — `$kedr-docs-sync`.

Визначай Nx targets із `project.json` або `npx nx show project <name>`. Не
встановлюй відсутній test tooling без явної потреби й погодженого `EN-*`.
Зберігай сторонні зміни робочого дерева та історичне evidence.
