# Admin media library

**Provider:** KedrStore module Media, contract [media.openapi.yaml](../openapi/media/media.openapi.yaml). **Consumer:** Admin «Медіа» (`/media`), [feature card](../../features/admin/media.md).

| Operation                                          | Use in Admin                                                                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `getAdminMediaFolders`                             | Folder tree with counts; tag `MediaFolders`                                                       |
| `createAdminMediaFolder`, `updateAdminMediaFolder` | Folder dialog (name and place); `409` = the name is taken among siblings                          |
| `deleteAdminMediaFolder`                           | Admin only; `409` = the folder is not empty                                                       |
| `getAdminMediaFiles`                               | Grid: `folderId` or `inRoot=true` (never both), `search`, `page`, `pageSize=60`; tag `MediaFiles` |
| `uploadAdminMediaFile`                             | Multipart `file` + optional `folderId`; one request per file                                      |
| `replaceAdminMediaFile`                            | Side panel «Замінити файл»; the ID stays, the URL changes                                         |
| `updateAdminMediaFile`, `moveAdminMediaFiles`      | Rename and folder in the panel; bulk move of the selection                                        |
| `deleteAdminMediaFile`                             | Admin only, after a confirmation; removes the CDN file                                            |
| `getAdminMediaFile`                                | Not consumed: the grid already holds the file                                                     |

- Responses pass zod schemas in [media data access](../../../libs/admin/media/data-access/src/validators/media.schemas.ts); optional `parentId`, `folderId`, `width`, and `height` become `null`.
- Every file change refreshes both tags, because folder counts change with it.
- Errors are worded in Ukrainian in [media errors](../../../libs/admin/media/feature/src/errors/media-error-message.ts): `403`, `404`, `409` by action, `413` and the backend size reason as «більший за 15 МБ», the picture-type reason, and `503` (storage not configured).
- The client checks type (JPEG, PNG, WebP) and size (15 MB) before a request; the backend checks the real content and stays the authority.
