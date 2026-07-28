# Фази реалізації: <назва Mobile feature>

Задачі виконуються послідовно за фазами. Кожна user story має бути independently
testable на погодженій платформі; наступна фаза починається лише після checkpoint.

| Фаза | Результат |
| --- | --- |
| [00 — Specify і plan](00-specify-plan.md) | погоджені scope, route, contract і source paths |
| [01 — Foundation](01-foundation.md) | спільні передумови без user-facing scope |
| [02 — User story P1](02-user-story-p1.md) | перша independently testable поставка |
| [03 — User story P2+](03-user-story-p2.md) | наступні незалежні user stories |
| [04 — Delivery](04-delivery.md) | cross-cutting і device verification |

Формат задачі: `[ID] [P?] [US#] опис із точним шляхом`. `[P]` означає, що
задача не конфліктує з іншою за файлами й залежностями. Якщо додається ще одна
user story, надайте їй наступний номер і перенумеруйте delivery так, щоб вона
лишалась останньою фазою.
