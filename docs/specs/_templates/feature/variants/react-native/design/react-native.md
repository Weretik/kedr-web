# <Назва feature> — React Native design

## Architecture placement

- Expo Router route/layout paths:
- `libs/mobile/<domain>/model` responsibilities:
- `libs/mobile/<domain>/data-access` responsibilities:
- `libs/mobile/<domain>/ui` responsibilities:
- `libs/mobile/<domain>/feature` responsibilities:
- Public exports:

## Device behavior

- Target platforms:
- Safe area and orientation:
- Keyboard, focus and dismissal:
- Gestures, scrolling and touch targets:
- TalkBack/VoiceOver:
- Loading, empty, error and offline states:

## Navigation and platform adapters

- Route/deep-link contract and invalid-link fallback:
- Storage boundary:
- Permission states: unknown, denied, blocked, granted:
- Native/web adapter boundary:
- Expo Go or development build:
- Binary rebuild trigger:

## State and API

- Local/client/server state ownership:
- Hooks/store responsibilities:
- Data fetching, cache, connectivity, retry and cancellation:
- DTO validation and mapping:
- Session and safe errors:

## Verification

- Affected Nx projects:
- Existing Jest targets and test files:
- Unit/focused integration/component coverage:
- Device checks:
- Critical E2E decision:
- Required `EN-*` for missing tooling:

Звіряйся з
[Mobile architecture](../../../../../../architecture/mobile/README.md),
[development-build rules](../../../../../../architecture/mobile/development-build.md)
і [testing rules](../../../../../../standards/testing-rules.md).
