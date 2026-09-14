# SDD process for Storefront Angular

Storefront у цьому репозиторії є Angular SSR застосунком, а не React. Створюй
нову feature у `docs/specs/storefront/<domain>/<NNN>-<feature-slug>/` за
[канонічним scenario-first template](../../specs/_templates/README.md) і видаляй
React/React Native phase-файли, які не стосуються scope. Використовуй
[Angular variant](../../specs/_templates/feature/variants/angular/README.md).

У design зафіксуй Angular/SSR, locale, route, state/API та browser risks.
Поточний Storefront не має test target, тому нова testable behavior потребує
окремого `EN-*` для погодженого test harness; наявні lint/build не замінюють
behavioral tests.

Застосовуй [testing rules](../../standards/testing-rules.md) і
[delivery rules](../../standards/delivery-rules.md).
