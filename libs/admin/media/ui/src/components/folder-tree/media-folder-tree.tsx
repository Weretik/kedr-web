import { buildFolderTree } from '@admin/media/model';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMemo, useState } from 'react';

import { MediaFolderMenu } from './media-folder-menu';

import type { MediaFolderActions } from './media-folder-menu';
import type { MediaFolderNode, MediaFolderTree, MediaScope } from '@admin/media/model';
import type { ReactNode } from 'react';

interface MediaFolderTreeProps extends MediaFolderActions {
  tree: MediaFolderTree;
  scope: MediaScope;
  onSelect: (scope: MediaScope) => void;
}

const isSelected = (scope: MediaScope, folderId: number) =>
  scope.kind === 'folder' && scope.folderId === folderId;

function Count({ value }: { value: number }) {
  return (
    <Box
      component="span"
      sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums', typography: 'caption' }}
    >
      {value}
    </Box>
  );
}

function Row({
  children,
  depth,
  icon,
  label,
  count,
  selected,
  onClick,
  toggle,
}: {
  children?: ReactNode;
  depth: number;
  icon: ReactNode;
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
  toggle?: ReactNode;
}) {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', pl: depth * 2 }}>
      <Box sx={{ flex: '0 0 32px', display: 'flex', justifyContent: 'center' }}>{toggle}</Box>
      <ListItemButton onClick={onClick} selected={selected} sx={{ flex: 1, minHeight: 44, pr: 1 }}>
        <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          slotProps={{ primary: { noWrap: true, variant: 'body2' } }}
          sx={{ minWidth: 0 }}
        />
        <Count value={count} />
      </ListItemButton>
      {children}
    </Box>
  );
}

/** «Усі файли», «Без папки», then the nested folders with file counts and their actions. */
export function MediaFolderTreeView({
  onCreateChild,
  onDelete,
  onEdit,
  onSelect,
  scope,
  tree,
}: MediaFolderTreeProps) {
  const nodes = useMemo(() => buildFolderTree(tree.folders), [tree.folders]);
  const [collapsed, setCollapsed] = useState<ReadonlySet<number>>(new Set());
  const toggle = (id: number) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const renderNode = (node: MediaFolderNode): ReactNode => {
    const open = !collapsed.has(node.id);
    return (
      <Box component="li" key={node.id} sx={{ listStyle: 'none' }}>
        <Row
          count={node.fileCount}
          depth={node.depth}
          icon={<FolderOutlinedIcon fontSize="small" />}
          label={node.name}
          onClick={() => onSelect({ kind: 'folder', folderId: node.id })}
          selected={isSelected(scope, node.id)}
          toggle={
            node.children.length > 0 ? (
              <IconButton
                aria-expanded={open}
                aria-label={open ? `Згорнути «${node.name}»` : `Розгорнути «${node.name}»`}
                onClick={() => toggle(node.id)}
                size="small"
              >
                {open ? (
                  <ExpandMoreOutlinedIcon fontSize="small" />
                ) : (
                  <ChevronRightOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            ) : null
          }
        >
          <MediaFolderMenu
            folder={node}
            onCreateChild={onCreateChild}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Row>
        {open && node.children.length > 0 ? (
          <Box component="ul" sx={{ m: 0, p: 0 }}>
            {node.children.map(renderNode)}
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <List aria-label="Папки медіатеки" dense disablePadding>
      <Row
        count={tree.totalFileCount}
        depth={0}
        icon={<PhotoLibraryOutlinedIcon fontSize="small" />}
        label="Усі файли"
        onClick={() => onSelect({ kind: 'all' })}
        selected={scope.kind === 'all'}
      />
      <Row
        count={tree.rootFileCount}
        depth={0}
        icon={<HomeOutlinedIcon fontSize="small" />}
        label="Без папки"
        onClick={() => onSelect({ kind: 'root' })}
        selected={scope.kind === 'root'}
      />
      <Box component="ul" sx={{ m: 0, p: 0 }}>
        {nodes.map(renderNode)}
      </Box>
    </List>
  );
}
