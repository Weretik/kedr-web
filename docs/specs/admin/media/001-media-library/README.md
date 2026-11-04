# 001 — Media library «Медіа»

- **Application:** Admin React (`apps/admin`)
- **Status:** stage 2 implemented 2026-11-04 (branch `claude/project-thread-09y8qq`)
- **Backend:** KedrStore spec `media/001-media-library` (stage 1, `/api/admin/media/*`)
- **Source:** owner request in the project thread of 2026-11-04

## Goal and scope

Manage the pictures on the CDN (`products/`, `product-scheme/`, and new uploads) from the admin as one library with folders. This spec covers stage 2, the «Медіа» page. Stage 3 (photos and a scheme on the product page, auto-linking, removing the photo check) and stage 4 (previews) get their own revisions.

**Out of scope:** product links, image editing, avatars.

## Product rules

- **R-001.** `/media` is open to Manager and Admin; the menu item «Медіа» sits before «Статті».
- **R-002.** The tree shows «Усі файли» (total), «Без папки» (root files), and nested folders with their file counts. Selecting one shows its files; a new folder or search starts from page 1.
- **R-003.** The grid is paged on the server (60 per page) and searched by name with a short delay.
- **R-004.** Upload goes to the selected folder, or to the root for «Усі файли» and «Без папки». A file that is not JPEG, PNG, or WebP, is empty, or is over 15 MB is listed with its reason in the pinned block and is not sent; the rest upload one by one with progress.
- **R-005.** Files can be dragged from the computer onto the grid; the overlay names the target folder.
- **R-006.** A file opens in a side panel with preview, open and copy-link actions, name, folder, details, and «Замінити файл». Saving is enabled only after a change.
- **R-007.** Several files are selected by their checkboxes and moved to one folder; moving never changes a URL.
- **R-008.** A folder is created (in the selected folder by default), renamed, or moved through one dialog; its own subtree is disabled as a place.
- **R-009.** Only an Admin sees «Видалити» for files and folders; deleting asks first. A non-empty folder or a taken name is explained in Ukrainian in the dialog.

## Acceptance scenarios

| ID         | Scenario                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SC-001** | A Manager opens «Медіа», selects «Схеми», and the grid asks for that folder from page 1.                                                                           |
| **SC-002** | A Manager uploads `732.jpg` and `notes.txt` into «Товари»: one request is sent, `notes.txt` is listed as not a picture, and the notice says one file was uploaded. |
| **SC-003** | A Manager sees no «Видалити» in the file panel; an Admin deletes a file after confirming.                                                                          |
| **SC-004** | An Admin tries to delete a folder with files and reads «Папка не порожня…».                                                                                        |
| **SC-005** | A Manager creates «Акції» inside the selected «Товари».                                                                                                            |
| **SC-006** | In the folder dialog for «Товари», the places «Товари» and its subfolder «Акції» are disabled.                                                                     |

## Planned file map

| Path                                                                                                               | State  | Responsibility                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------- |
| `libs/admin/media/model/src/{entities,queries,mappers,validators}/*`                                               | New    | Types, limits, scope, tree, formatting, client rules  |
| `libs/admin/media/data-access/src/{api,contracts,validators,mappers}/*`                                            | New    | Endpoints, DTO types, zod, mapping                    |
| `libs/admin/media/ui/src/components/{folder-tree,file-grid,upload}/*`                                              | New    | Tree and menu, grid and card, drop zone               |
| `libs/admin/media/ui/src/{details,dialogs,forms}/*`                                                                | New    | Side panel, folder/move/delete dialogs, folder select |
| `libs/admin/media/feature/src/{media.routes.tsx,pages,components,hooks,errors}/*`                                  | New    | Route, page, page parts, orchestration, messages      |
| `libs/admin/core/auth/src/session/session-user.ts`                                                                 | Change | `canDeleteMedia`                                      |
| `apps/admin/src/app/router/app-router.tsx`, `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx` | Change | Route and menu item                                   |
| `docs/contracts/openapi/*`, `libs/shared/api-contracts/src/generated/kedr-api.ts`                                  | Change | Contract snapshot from KedrStore                      |
| `docs/contracts/media/admin-media.md`, `docs/features/admin/media.md`                                              | New    | Consumer page, feature card                           |

## Evidence

- Model 4, data access 3, ui 2, feature 7 tests pass; lint and typecheck pass for the four media projects, `admin`, `admin-core-auth`, `admin-core-shell`.

## Structure check (stage 2)

The actual files match the map. `MediaPage` (about 230 lines) only wires hooks and parts: the folder card and the toolbar were split out of it during the check. Each hook owns one flow (query, uploads, folder dialogs, file panel and move, selection). No role folder holds eight files. `MediaFilePanel` (about 190 lines) is one panel with its form; split the details list out if stage 3 adds product links to it.
