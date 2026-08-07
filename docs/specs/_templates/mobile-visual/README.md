# Шаблон Mobile visual SDD

Це копійований багато-файловий шаблон для візуальної або interaction-задачі в
існуючому Mobile UI: selector, modal, layout, scroll, accessibility/focus або
visual regression. Кожен файл нижче є готовою заготовкою, а не описом у README.

```text
docs/specs/mobile/<domain>/<NNN>-<visual-slug>/
├── spec.md
├── visual-spec.md
├── research.md
├── plan.md
├── quickstart.md
├── tasks/
└── checklists/
```

Для нової бізнес-feature, route, HTTP operation, DTO або persisted state
використовуйте також [Mobile feature](../mobile-feature/README.md). Не
створюйте `data-model.md` або `contracts/`, якщо visual-задача не змінює дані
чи API.

## Порядок роботи

1. Скопіюйте структуру шаблону до `docs/specs/mobile/<domain>/<NNN>-<slug>/`.
2. Заповніть `spec.md`, `research.md` і `visual-spec.md` до коду.
3. У `plan.md` зафіксуйте тільки існуючі source paths і theme tokens.
4. Виконуйте фази з `tasks/` за `ai-task-workflow`.
5. Запишіть automated та Android/web visual QA evidence у `quickstart.md` і
   `checklists/delivery.md`.

## Коли застосовувати

| Проблема                                | Документований результат                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| Довгий modal/list не прокручується      | max-height, scroll behavior, safe area і web focus.         |
| Дерево складно сканувати                | anatomy parent/child, expand/collapse та selection actions. |
| Loading/empty/error виглядають однаково | state matrix з видимим text, enabled actions і retry.       |
| Control важко натиснути                 | touch target, spacing, accessible name і TalkBack behavior. |
| Web поводиться інакше                   | keyboard/focus matrix, Escape/dismiss і responsive rules.   |
