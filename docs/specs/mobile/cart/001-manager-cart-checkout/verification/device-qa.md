# Mobile manager cart checkout — device verification plan

## Environments

| Platform/device                            | Runtime  | Build                         | Owner       |
| ------------------------------------------ | -------- | ----------------------------- | ----------- |
| Android phone, small and standard viewport | Expo Go  | reviewed implementation build | Mobile team |
| iPhone, small and standard viewport        | Expo Go  | reviewed implementation build | Mobile team |
| Responsive web smoke                       | Expo web | `mobile:serve`/export         | Mobile team |

## Checks

| Scenario       | Device condition                                      | Observable result                                                 | Evidence location |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------------------- | ----------------- |
| SC-001         | Kill and restart after persisted lines                | Lines and totals restore without flicker-driven edits             | TS-009 evidence   |
| SC-003–SC-005  | Repeated touch on quantity/delete                     | One action per tap, limits respected, totals stable               | TS-009 evidence   |
| SC-006–SC-007  | Keyboard open in customer selector; offline/reconnect | Search stays visible; retry works; selection returns focus        | TS-009 evidence   |
| SC-008–SC-012  | Keyboard open and bottom safe area                    | Validation, pending, error and success actions remain reachable   | TS-009 evidence   |
| SC-004, SC-009 | TalkBack/VoiceOver                                    | Disabled boundary, controls and busy/success states are announced | TS-009 evidence   |

## Constraints

- Unavailable environment: record any missing Android/iOS device rather than
  substituting an unverified claim.
- Required binary rebuild: none; all dependencies are already Expo-compatible.
- Manual-only risk: real keyboard, safe-area, screen-reader and process restart
  behavior are not fully represented by Jest.

## Result — 2026-09-17

- `npx nx export mobile` produced Android, iOS and web bundles successfully.
- Android and iOS runtime checks were unavailable because no emulator, simulator
  or physical device was attached. Owner: Mobile team.
- Interactive web visual/keyboard checks were unavailable in this execution
  environment. Owner: Mobile team.
- Automated component, navigation, persistence and checkout coverage passed;
  see [delivery evidence](delivery-evidence.md).
