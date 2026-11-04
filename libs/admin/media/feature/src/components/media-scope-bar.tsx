import { folderAncestorIds } from '@admin/media/model';
import { Breadcrumbs, FormControlLabel, Link, Stack, Switch, Typography } from '@mui/material';

import type { MediaFolder, MediaScope } from '@admin/media/model';

interface MediaScopeBarProps {
  folders: readonly MediaFolder[];
  scope: MediaScope;
  onSelect: (scope: MediaScope) => void;
  includeSubfolders: boolean;
  onIncludeSubfoldersChange: (value: boolean) => void;
}

/** Where the grid is: the folder path with clickable parents and the «Разом з підпапками» switch. */
export function MediaScopeBar({
  folders,
  includeSubfolders,
  onIncludeSubfoldersChange,
  onSelect,
  scope,
}: MediaScopeBarProps) {
  const folderId = scope.kind === 'folder' ? scope.folderId : null;
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const chain = (folderId === null ? [] : [...folderAncestorIds(folders, folderId), folderId])
    .map((id) => byId.get(id))
    .filter((folder): folder is MediaFolder => folder !== undefined);
  const hasSubfolders = folderId !== null && folders.some((folder) => folder.parentId === folderId);
  const last = scope.kind === 'root' ? 'Без папки' : (chain[chain.length - 1]?.name ?? 'Усі файли');

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', minHeight: 38 }}
    >
      <Breadcrumbs aria-label="Шлях до папки" maxItems={4} sx={{ minWidth: 0 }}>
        {scope.kind === 'all' ? null : (
          <Link
            color="text.secondary"
            component="button"
            onClick={() => onSelect({ kind: 'all' })}
            type="button"
            underline="hover"
            variant="body2"
          >
            Усі файли
          </Link>
        )}
        {chain.slice(0, -1).map((folder) => (
          <Link
            color="text.secondary"
            component="button"
            key={folder.id}
            onClick={() => onSelect({ kind: 'folder', folderId: folder.id })}
            type="button"
            underline="hover"
            variant="body2"
          >
            {folder.name}
          </Link>
        ))}
        <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
          {last}
        </Typography>
      </Breadcrumbs>
      {hasSubfolders ? (
        <FormControlLabel
          control={
            <Switch
              checked={includeSubfolders}
              onChange={(event) => onIncludeSubfoldersChange(event.target.checked)}
              size="small"
            />
          }
          label="Разом з підпапками"
          slotProps={{ typography: { variant: 'body2' } }}
          sx={{ flexShrink: 0, mr: 0 }}
        />
      ) : null}
    </Stack>
  );
}
