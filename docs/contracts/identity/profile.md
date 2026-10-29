# Staff profile consumer contract

## Machine contract

- OpenAPI: [`profile.openapi.yaml`](../openapi/identity/profile.openapi.yaml)
- Consumer: Admin [Мій кабінет](../../features/admin/profile.md) through [profile.api](../../../libs/admin/users/data-access/src/api/profile.api.ts)
- Access: any staff session (`RequireManagerRole`); `email` and `password` need the Admin role. Cookie session and CSRF header.

| Intent          | Operation          | Method/path                  | Notes                                                        |
| --------------- | ------------------ | ---------------------------- | ------------------------------------------------------------ |
| Read profile    | `getMyProfile`     | `GET /api/profile`           | id, email, name, role, `avatarUrl`; tag `StaffProfile`       |
| Change name     | `changeMyName`     | `PUT /api/profile/name`      | 1–100 characters after trimming                              |
| Upload photo    | `uploadMyAvatar`   | `PUT /api/profile/avatar`    | multipart `file`; `400` limits, `413` body, `503` no storage |
| Remove photo    | `removeMyAvatar`   | `DELETE /api/profile/avatar` | `204` also without a photo                                   |
| Change email    | `changeMyEmail`    | `PUT /api/profile/email`     | Admin; current password; `409` taken                         |
| Change password | `changeMyPassword` | `PUT /api/profile/password`  | Admin; current password; new ≥ 8                             |

## Client decisions

- The client checks a photo before upload with [avatar-file-rules](../../../libs/admin/users/model/src/validation/avatar-file-rules.ts) (JPEG/PNG/WebP, ≤ 2 MB, ≥ 128×128) and shows which limit failed; the server repeats the checks and crops the centre square to a 256×256 WebP.
- A `400` with field `currentPassword` means a wrong current password; field `file` carries a photo limit. [staff-error-message](../../../libs/admin/users/feature/src/errors/staff-error-message.ts) shows both in Ukrainian.
- After an own change the app calls `refreshSession()` so the header reads the new `me`. Changing the own email or password keeps this browser signed in and ends other sessions.
- Profile mutations also invalidate `StaffAccounts`, so the Users table shows the new name and photo.
