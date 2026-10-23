# SDD process for Mobile React Native

Create a new feature under `docs/specs/mobile/<domain>/<NNN>-<feature-slug>/` according to the [delivery rules](../../../standards/shared/delivery-rules.md). Apply React Native-specific decisions from the [Mobile architecture](../README.md) in the design; visual/interaction documents are part of the same variant.

Mobile-specific planning must name the actual Nx projects in `apps/mobile` and `libs/mobile`, thin Expo Router routes, `feature/ui/data-access/model` boundaries, safe-area/keyboard/device risks, deep links, permissions, storage, native adapters, and the Expo Go/development-build constraint. Scenarios remain in terms of observable behavior; these technical details belong in design and task files.

Choose test level and commands according to the [testing rules](../../../standards/shared/testing-rules.md), and coordinate device-specific checks with the [Mobile testing strategy](testing.md). Migrate existing Mobile specifications gradually without changing completed IDs or evidence.
