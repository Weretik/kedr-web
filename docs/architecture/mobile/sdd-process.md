# SDD process for Mobile React Native

Створюй нову feature у `docs/specs/mobile/<domain>/<NNN>-<feature-slug>/` за
[канонічним scenario-first template](../../specs/_templates/README.md).
Використовуй
[React Native variant](../../specs/_templates/feature/variants/react-native/README.md);
visual/interaction документи входять у цей самий варіант.

Mobile-specific planning має назвати реальні Nx projects у `apps/mobile` і
`libs/mobile`, тонкі Expo Router routes, межі `feature/ui/data-access/model`,
safe area/keyboard/device risks, deep links, permissions, storage, native
adapters та Expo Go/development-build constraint. Сценарії залишаються мовою
observable behavior; ці технічні деталі належать у design і task-файли.

Test level та команди обирай за
[testing rules](../../standards/testing-rules.md), а device-specific перевірки
узгоджуй зі [стратегією Mobile testing](testing.md). Існуючі Mobile
специфікації мігруй поступово без зміни завершених ID чи evidence.
