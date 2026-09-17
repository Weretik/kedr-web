# AI routing for frontend documentation

Перед зміною frontend-коду або feature-специфікації:

1. Обери застосунок: [Admin React](architecture/admin/README.md),
   [Mobile React Native](architecture/mobile/README.md) або
   [Storefront Angular](architecture/storefront/README.md).
2. Прочитай відповідні правила з [індексу standards](standards/README.md).
3. Для нової або зміненої поведінки використовуй
   [scenario-first SDD templates](specs/_templates/README.md).
   Якщо тип не вказано, до створення файлів запитай: React, React Native чи
   Angular.
4. Для реалізації прийнятої специфікації дотримуйся
   [AI feature workflow](specs/_templates/ai-feature-workflow/README.md).
5. Для HTTP-змін звірся з [frontend API contracts](contracts/README.md), знайди
   stable `operationId` у versioned snapshot і використовуй generated types з
   `@shared/api-contracts` лише на transport/data-access boundary. YAML та
   generated TypeScript не редагуй вручну; синхронізуй і генеруй CLI-командами,
   описаними в contracts README.

Визначай Nx targets із `project.json` або `npx nx show project <name>`. Не
встановлюй відсутній test tooling без явної потреби й погодженого `EN-*`.
Зберігай сторонні зміни робочого дерева та історичне evidence.
