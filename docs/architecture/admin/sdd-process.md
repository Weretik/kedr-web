# SDD process for Admin React

Створюй нову feature у `docs/specs/admin/<domain>/<NNN>-<feature-slug>/` за [правилами постачання](../../standards/shared/delivery-rules.md). У design застосовуй React-specific рішення з [архітектури Admin](README.md).

Admin-specific planning має назвати реальні Nx projects у `apps/admin` і
`libs/admin`, межі `feature/ui/data-access/model`, route impact, RTK Query
boundary, browser behavior та MUI/accessibility risks. Сценарії описують
поведінку користувача без цих технічних назв; технічні деталі належать у design
і `TS-*`/`EN-*`.

Test level та команди обирай за
[testing rules](../../standards/shared/testing-rules.md), readiness і completion — за
[delivery rules](../../standards/shared/delivery-rules.md). Існуючі Admin
специфікації мігруй поступово без перенумерації завершених фаз чи переписування
evidence.
