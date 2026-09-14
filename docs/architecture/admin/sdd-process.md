# SDD process for Admin React

Створюй нову feature у `docs/specs/admin/<domain>/<NNN>-<feature-slug>/` за
[канонічним scenario-first template](../../specs/_templates/README.md).
Використовуй
[React variant](../../specs/_templates/feature/variants/react/README.md).

Admin-specific planning має назвати реальні Nx projects у `apps/admin` і
`libs/admin`, межі `feature/ui/data-access/model`, route impact, RTK Query
boundary, browser behavior та MUI/accessibility risks. Сценарії описують
поведінку користувача без цих технічних назв; технічні деталі належать у design
і `TS-*`/`EN-*`.

Test level та команди обирай за
[testing rules](../../standards/testing-rules.md), readiness і completion — за
[delivery rules](../../standards/delivery-rules.md). Існуючі Admin
специфікації мігруй поступово без перенумерації завершених фаз чи переписування
evidence.
