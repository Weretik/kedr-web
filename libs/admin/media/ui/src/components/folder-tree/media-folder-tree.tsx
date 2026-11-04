import { buildFolderTree, filterFolderTree } from '@admin/media/model';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { MediaFolderMenu } from './media-folder-menu';
import { MediaFolderRow } from './media-folder-row';

import type { MediaFolderActions } from './media-folder-menu';
import type { MediaFolderNode, MediaFolderTree, MediaScope } from '@admin/media/model';
import type { ReactNode } from 'react';

interface MediaFolderTreeProps extends MediaFolderActions {
  tree: MediaFolderTree;
  scope: MediaScope;
  onSelect: (scope: MediaScope) => void;
  /** Open folders; during a folder search every found branch is open. */
  expandedIds: ReadonlySet<number>;
  onToggle: (folderId: number) => void;
}

const isSelected = (scope: MediaScope, folderId: number) =>
  scope.kind === 'folder' && scope.folderId === folderId;

/** Subfolders hang on a thin guide line instead of a deeper indent, so long names keep their width. */
const nestedListSx = {
  borderLeft: 1,
  borderColor: 'divider',
  listStyle: 'none',
  m: 0,
  ml: '11px',
  p: 0,
  pl: '4px',
} as const;

/** Search, «Усі файли», «Без папки», then the folders with totals including subfolders. */
export function MediaFolderTreeView({
  expandedIds,
  onCreateChild,
  onDelete,
  onEdit,
  onSelect,
  onToggle,
  scope,
  tree,
}: MediaFolderTreeProps) {
  const [search, setSearch] = useState('');
  const nodes = useMemo(() => buildFolderTree(tree.folders), [tree.folders]);
  const visible = useMemo(() => filterFolderTree(nodes, search), [nodes, search]);
  const searching = search.trim().length > 0;

  const renderNode = (node: MediaFolderNode): ReactNode => {
    const hasChildren = node.children.length > 0;
    const open = hasChildren && (searching || expandedIds.has(node.id));
    return (
      <Box component="li" key={node.id}>
        <MediaFolderRow
          actions={
            <MediaFolderMenu
              folder={node}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          }
          count={node.totalFileCount}
          expanded={hasChildren ? open : undefined}
          highlight={search}
          label={node.name}
          onClick={() => onSelect({ kind: 'folder', folderId: node.id })}
          onToggle={() => onToggle(node.id)}
          selected={isSelected(scope, node.id)}
        />
        {open ? (
          <Box component="ul" sx={nestedListSx}>
            {node.children.map(renderNode)}
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <Stack spacing={1}>
      <TextField
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Знайти папку"
        size="small"
        slotProps={{
          htmlInput: { 'aria-label': 'Знайти папку' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        value={search}
      />
      <Box aria-label="Папки медіатеки" component="nav">
        <MediaFolderRow
          count={tree.totalFileCount}
          icon={<PhotoLibraryOutlinedIcon color="action" fontSize="small" />}
          label="Усі файли"
          onClick={() => onSelect({ kind: 'all' })}
          selected={scope.kind === 'all'}
        />
        <MediaFolderRow
          count={tree.rootFileCount}
          icon={<HomeOutlinedIcon color="action" fontSize="small" />}
          label="Без папки"
          onClick={() => onSelect({ kind: 'root' })}
          selected={scope.kind === 'root'}
        />
        <Divider sx={{ my: 1 }} />
        {visible.length > 0 ? (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {visible.map(renderNode)}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ px: 1, py: 1.5 }} variant="body2">
            {searching ? 'Папок з такою назвою немає.' : 'Папок ще немає.'}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
