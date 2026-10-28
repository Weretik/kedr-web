# Staff accounts consumer contract

## Machine contract

- OpenAPI: [`users.openapi.yaml`](../openapi/identity/users.openapi.yaml)
- Consumer: Admin [Users](../../features/admin/users.md) through [admin-users.api](../../../libs/admin/users/data-access/src/api/admin-users.api.ts)
- Access: policy `CanManageUsers` (Admin role); a manager gets `403`. All calls use the cookie session and the CSRF header.

| Intent          | Operation            | Method/path                              | Notes                                     |
| --------------- | -------------------- | ---------------------------------------- | ----------------------------------------- |
| List staff      | `getStaffAccounts`   | `GET /api/admin/users`                   | Admin and Manager accounts, by email      |
| Add staff       | `createStaffAccount` | `POST /api/admin/users`                  | `409` when the email exists; password ≥ 8 |
| Change role     | `changeStaffRole`    | `PUT /api/admin/users/{userId}/role`     | `400` for your own account                |
| Block / unblock | `setStaffBlocked`    | `PUT /api/admin/users/{userId}/blocked`  | `400` when blocking yourself              |
| Set password    | `setStaffPassword`   | `PUT /api/admin/users/{userId}/password` | Ends the user's sessions                  |

`404` means the user is not a staff account. Role changes, blocking, and a new password take effect for the browser within 5 minutes (security stamp check) and immediately for mobile refresh tokens.
