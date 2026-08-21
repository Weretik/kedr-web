# SDD-процес Mobile

Для нетривіальної Mobile feature спочатку створюється специфікація в
`docs/specs/mobile/<domain>/<NNN>-<feature-slug>/` за [шаблоном Mobile
feature](../../specs/_templates/mobile-feature/README.md). Для невеликої зміни допустимий один
Markdown-файл у папці домену.

Специфікація містить: мету, межі, маршрути Expo Router, API-контракт, стани
`loading`/`empty`/`error`/`offline`, зміни бібліотек, критерії приймання, команди
перевірки та ручний тест на пристрої. Route-файли у `apps/mobile/src/app`
лишаються тонкими адаптерами до public API `libs/mobile/<domain>/feature`.

Реалізація починається після погодження мети, меж і критеріїв приймання. Зміну
погоджених меж фіксують у розділі «Історія змін» специфікації.

Перед плануванням застосуйте [Testing rules](../../standards/testing-rules.md) і
[Security rules](../../standards/security-rules.md). Spec містить конкретний
test/target або `n/a` з обґрунтуванням для кожного рівня, обов'язкове рішення
щодо e2e та security/access context; формулювання «test якщо потрібен» заборонене.
