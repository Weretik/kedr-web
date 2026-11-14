# Mobile cabinet

**Scenario:** the manager sees and changes their photo and name, an Admin also the sign-in e-mail and password; the cabinet shows when the data was updated and what waits in the send queue, and warns before a sign-out deletes queued orders. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-016; SC-021, SC-022, SC-023).

- [CabinetProfile](../../../libs/mobile/profile/feature/src/components/cabinet-profile.tsx): photo or initials, name, role («Менеджер» or «Адміністратор») and e-mail. «Змінити фото» opens the gallery with a square crop (`expo-image-picker`, JPEG 70 %) and uploads it; the server keeps a 256×256 WebP. Name, photo and the Admin-only «Змінити e-mail» and «Змінити пароль» call KedrStore [`/api/profile`](../../contracts/openapi/identity/profile.openapi.yaml) and need the network. E-mail and password ask for the current password and a confirmation; the server then ends every session, so the app signs in again with the new data. Errors use the Admin wording ([profile-error-message](../../../libs/mobile/profile/model/src/mappers/profile-error-message.ts)).
- `updateSessionUser` in [mobile-auth](../../../libs/mobile/core/auth/src/session/mobile-auth.ts) keeps the rail, the cabinet and the saved offline session in step after a change.
- [SyncInfoCard](../../../libs/mobile/sync/feature/src/components/sync-info-card.tsx): «Оновлено 14:05», the reason of a failed update, «Оновити дані зараз».
- [QueueSummaryCard](../../../libs/mobile/calculation/feature/src/components/queue-summary-card.tsx): shown only while orders or drafts wait or were returned.
- Theme, «Швидкий вхід» and «Завантажити всі фото» stay as before.
- [SignOutSection](../../../libs/mobile/profile/ui/src/components/sign-out-section.tsx): with a non-empty queue «Вийти» first says how many items will be lost and signs out only on «Вийти все одно».
- On a tablet the cabinet has two columns: profile and sign-out on the left, data, queue and device settings on the right.

## Routes

| Route      | File                                     |
| ---------- | ---------------------------------------- |
| `/cabinet` | `apps/mobile/src/app/(work)/cabinet.tsx` |

## Code structure

```text
libs/mobile/profile/
├── model/src/{validators,mappers}/  # name, e-mail and password rules, role label, server error wording
├── data-access/src/api/  # /api/profile calls, gallery picker
├── ui/src/components/  # ProfileHeader, NameForm, EmailForm, PasswordForm, SignOutSection
└── feature/src/components/  # CabinetProfile
```

The route composes the profile, `sync/feature`, `calculation/feature`, `catalog/feature` and `core/auth`, so the profile domain does not depend on other domains.

## Tests

- `npx nx run mobile-profile-model:test`, `npx nx run mobile-profile-data-access:test` — rules, error wording, calls and the photo upload.
- `npx nx run mobile-profile-ui:test`, `npx nx run mobile-profile-feature:test` — manager vs Admin, confirmations, wrong password, offline, sign-out warning.
- `npx nx run mobile-sync-feature:test`, `npx nx run mobile-calculation-feature:test`, `npx nx run mobile-core-auth:test` — sync card, queue card, session update.

A new native module (`expo-image-picker`) needs a new development or EAS build.
