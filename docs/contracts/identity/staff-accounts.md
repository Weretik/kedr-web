# Staff accounts consumer contract

## Machine contract

- OpenAPI: [`users.openapi.yaml`](../openapi/identity/users.openapi.yaml)
- Consumer: Admin [Users](../../features/admin/users.md) through [admin-users.api](../../../libs/admin/users/data-access/src/api/admin-users.api.ts)
- Access: policy `CanManageUsers` (Admin role); a manager gets `403`. All calls use the cookie session and the CSRF header.

| Intent          | Operation            | Method/path                               | Notes                                     |
| --------------- | -------------------- | ----------------------------------------- | ----------------------------------------- |
| List staff      | `getStaffAccounts`   | `GET /api/admin/users`                    | Admin and Manager accounts, by email      |
| Add staff       | `createStaffAccount` | `POST /api/admin/users`                   | `409` when the email exists; password ≥ 8 |
| Change role     | `changeStaffRole`    | `PUT /api/admin/users/{userId}/role`      | `400` for your own account                |
| Block / unblock | `setStaffBlocked`    | `PUT /api/admin/users/{userId}/blocked`   | `400` when blocking yourself              |
| Set password    | `setStaffPassword`   | `PUT /api/admin/users/{userId}/password`  | Managers only; ends the user's sessions   |
| Change name     | `changeStaffName`    | `PUT /api/admin/users/{userId}/name`      | Managers only                             |
| Change email    | `changeStaffEmail`   | `PUT /api/admin/users/{userId}/email`     | Managers only; `409` taken; signs out     |
| Upload photo    | `uploadStaffAvatar`  | `PUT /api/admin/users/{userId}/avatar`    | Managers only; multipart `file`           |
| Remove photo    | `removeStaffAvatar`  | `DELETE /api/admin/users/{userId}/avatar` | Managers only                             |

`404` means the user is not a staff account. Name, email, password and photo calls on an **Admin** account (including your own) return `403`; the menu does not offer them. Each row carries `avatarUrl` (or `null`), mapped to `StaffAccount.avatarUrl`. Role changes, blocking, and a new password take effect for the browser within 5 minutes (security stamp check) and immediately for mobile refresh tokens.
