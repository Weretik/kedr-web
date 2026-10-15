# SDD process for Mobile React Native

Створюй нову feature у `docs/specs/mobile/<domain>/<NNN>-<feature-slug>/` за [правилами постачання](../../../standards/shared/delivery-rules.md). У design застосовуй React Native-specific рішення з [архітектури Mobile](../README.md);
visual/interaction документи входять у цей самий варіант.

Mobile-specific planning має назвати реальні Nx projects у `apps/mobile` і
`libs/mobile`, тонкі Expo Router routes, межі `feature/ui/data-access/model`,
safe area/keyboard/device risks, deep links, permissions, storage, native
adapters та Expo Go/development-build constraint. Сценарії залишаються мовою
observable behavior; ці технічні деталі належать у design і task-файли.

Test level та команди обирай за
[testing rules](../../../standards/shared/testing-rules.md), а device-specific перевірки
узгоджуй зі [стратегією Mobile testing](testing.md). Існуючі Mobile
специфікації мігруй поступово без зміни завершених ID чи evidence.
