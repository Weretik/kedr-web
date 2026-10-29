# 001 — Staff profile, avatars and header menu

- **Application:** Admin React (`apps/admin`)
- **Status:** Implemented 2026-10-29 (branch `claude/project-thread-0i1fvf`)
- **Backend:** KedrStore spec `identity/002-staff-profile-and-avatars` (`/api/profile`, Users page edits, `avatarUrl`)
- **Source:** user request in the project thread of 2026-10-29

## Goal and scope

Every staff member (Admin or Manager) has a "Мій кабінет" page, an avatar shown in the header and on the Users page, and a header menu that presents name, email and role clearly with two actions: open the cabinet and sign out. Without a photo, the avatar shows the first letter of the name on a colour derived from the name.

**Out of scope:** Storefront and Mobile, deleting staff accounts, cropping UI (the server crops the centre square).

## Product rules

- **R-001.** `/profile` is open to every staff member. It shows the avatar, name, email and role.
- **R-002.** A manager changes its own name and photo (upload, remove). An admin additionally changes its own email and password; both forms ask for the current password.
- **R-003.** A photo must be JPEG, PNG or WebP, at most 2 MB, and at least 128×128 px. The client checks this before uploading and says which limit failed, for example "Фото завелике: 3,4 МБ. Максимум — 2 МБ." The hint under the button names all limits and that the photo is cropped to a centre square.
- **R-004.** Every change (name, email, password, photo upload or removal) opens a confirmation dialog with "Підтвердити"-style action and "Скасувати"; nothing is sent before confirmation. The photo confirmation shows a preview.
- **R-005.** The avatar shows the photo when `avatarUrl` is set, otherwise the initial (first letter of the name, or of the email when the name is empty) on one of a fixed set of colours chosen by a stable hash of the name, so a person always gets the same colour.
- **R-006.** The header avatar opens a menu: a profile card (avatar, name, email, role chip), then "Мій кабінет" and "Вийти".
- **R-007.** After an own change, the header updates without reloading the page.
- **R-008.** The Users table shows each account's avatar next to the name. For **manager** rows the actions menu adds "Змінити імʼя", "Змінити email", "Змінити фото", "Видалити фото" (when there is one); "Встановити новий пароль" stays. For **admin** rows (including the signed-in admin) those items are not shown; role and blocking keep their current rules.
- **R-009.** Server errors are shown in the dialog in Ukrainian: wrong current password, email already used, photo limits, storage not configured (`503`).

## Acceptance scenarios

| ID         | Scenario                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SC-001** | A manager opens the header menu, sees name, email and role "Менеджер", clicks "Мій кабінет" and lands on `/profile`.                                                                |
| **SC-002** | A manager changes its name, confirms, and the header shows the new name. Cancelling the confirmation sends nothing.                                                                 |
| **SC-003** | A manager picks a 3 MB photo and sees the size error without an upload; a valid photo shows a preview confirmation and, after confirming, the new avatar in the cabinet and header. |
| **SC-004** | A manager does not see email and password editing; an admin does, and a wrong current password shows "Невірний поточний пароль".                                                    |
| **SC-005** | A user without a photo sees a coloured initial in the header, cabinet and Users table.                                                                                              |
| **SC-006** | An admin changes a manager's name, email and photo from the Users table after confirming; admin rows offer none of these actions.                                                   |

## Design

- `@admin/shared/ui` — `UserAvatar` (photo or initial; colour from a stable hash) and `avatarInitial`/`avatarColorIndex` helpers.
- `@admin/users/model` — `StaffProfile` entity; `avatar-file-rules` (types, size, minimum side, messages); `validateEmail`, `validateFullName` shared with the create dialog.
- `@admin/users/data-access` — `profile.api.ts` (`getMyProfile`, `changeMyName`, `uploadMyAvatar`, `removeMyAvatar`, `changeMyEmail`, `changeMyPassword`; tag `StaffProfile`) and new Users endpoints (`changeStaffName`, `changeStaffEmail`, `uploadStaffAvatar`, `removeStaffAvatar`). Uploads send `FormData` with field `file`.
- `@admin/users/ui` — `AvatarPickerButton` (hidden file input), `EditTextDialog` (name or email), `ChangeEmailDialog`, `ChangePasswordDialog`, `ConfirmActionDialog` gains optional preview content, `StaffAccountsTable` shows `UserAvatar`.
- `@admin/users/feature` — `ProfilePage` at `/profile` (`createProfileRoutes`), `useConfirmedChange` (one pending confirmation for any change), `useAvatarFile` (client checks including image size), `useProfileActions`, `useStaffProfileActions` (Users page edits, separate from the existing role/block hook).
- `@admin/core/auth` — `SessionUser.avatarUrl`; `refreshSession()` re-reads `me` after own changes; the app passes it to the profile routes as `onProfileChanged`.
- `@admin/core/shell` — `AdminShellUser.avatarUrl`, `profileHref`; `ProfileMenu` shows the card, "Мій кабінет" and "Вийти".

## Planned file map

| Path                                                                                                                                                                                                                    | State        | Responsibility                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| `libs/admin/shared/ui/src/lib/user-avatar.tsx`                                                                                                                                                                          | New          | Photo or coloured initial                               |
| `libs/admin/users/model/src/entities/staff-profile.ts`, `validation/avatar-file-rules.ts`, `validation/staff-account-rules.ts`                                                                                          | New / Change | Profile entity, photo limits, shared email/name rules   |
| `libs/admin/users/data-access/src/api/profile.api.ts`, `api/admin-users.api.ts`, `mappers/*`, `contracts/*`                                                                                                             | New / Change | Profile and Users edit endpoints                        |
| `libs/admin/users/ui/src/dialogs/{edit-text-dialog,confirm-action-dialog}.tsx`, `profile/dialogs/{change-email-dialog,change-password-dialog}.tsx`, `profile/*-card.tsx`, `avatar/avatar-picker-button.tsx`, `tables/*` | New / Change | Forms, preview confirmation, avatar column, row actions |
| `libs/admin/users/feature/src/profile.routes.tsx`, `pages/profile-page.tsx`, `hooks/{use-confirmed-change,use-avatar-file,use-profile-actions,use-staff-profile-actions}.ts`, `errors/staff-error-message.ts`           | New / Change | Cabinet page and flows                                  |
| `libs/admin/core/auth/src/session/*`                                                                                                                                                                                    | Change       | `avatarUrl`, `refreshSession`                           |
| `libs/admin/core/shell/src/components/top-bar/profile-menu.tsx`, `providers/admin-shell-session-provider.tsx`                                                                                                           | Change       | Header menu                                             |
| `apps/admin/src/app/router/{app-router.tsx,shell-user.ts}`                                                                                                                                                              | Change       | `/profile` route, shell user mapping                    |
| `docs/contracts/identity/{profile,staff-accounts}.md`, `docs/features/admin/{users,session}.md`, `docs/features/README.md`                                                                                              | New / Change | Consumer contract and feature cards                     |

## Tasks

| Task                                             | Scenarios      | Tests                           |
| ------------------------------------------------ | -------------- | ------------------------------- |
| **TS-001** Contract sync and data access         | —              | `contracts:check`, typecheck    |
| **TS-002** `UserAvatar` and photo rules          | SC-005, SC-003 | shared-ui and users-model tests |
| **TS-003** Header menu and session refresh       | SC-001, SC-002 | shell tests                     |
| **TS-004** Cabinet page and flows                | SC-002…SC-004  | users-feature tests             |
| **TS-005** Users table avatars and manager edits | SC-006         | users-ui tests                  |
| **TS-006** Docs and structure audit              | —              | `docs:check`, lint              |

## Verification evidence

2026-10-29, against KedrStore `374f391` (contract snapshot synced with `contracts:sync`):

- `npm run contracts:lint` and `contracts:check`: generated types match the snapshot.
- Vitest: `admin-users-feature` 12, `admin-users-ui` 7, `admin-users-model` 7, `admin-core-shell` 8, `admin-core-auth` 12, `admin-shared-ui` 12 — all passed. Covers SC-001 (menu card, "Мій кабінет", sign-out), SC-002 (confirm before send, cancel sends nothing, header refresh), SC-003 (size/type limits; dimensions in the browser), SC-004 (manager vs admin editing), SC-005 (initial and colour), SC-006 (manager-only row actions).
- `nx run-many -t lint,typecheck` for the 9 touched projects and `npm run architecture:boundaries`: passed. `npm run docs:check`: passed.
- Not run: browser, E2E and the real CDN upload; check `/profile` and the Users page after deploy.
- Structure audit: profile dialogs grouped under `ui/src/profile/dialogs`; Users-page edits split from the existing role/block hook into `use-staff-profile-actions`; the confirmation flow is one hook (`use-confirmed-change`) shared by both pages.
