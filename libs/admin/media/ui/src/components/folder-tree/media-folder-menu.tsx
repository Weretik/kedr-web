import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { MediaFolder } from '@admin/media/model';

export interface MediaFolderActions {
  onCreateChild: (parent: MediaFolder) => void;
  onEdit: (folder: MediaFolder) => void;
  /** Absent when the signed-in role may not delete. */
  onDelete?: (folder: MediaFolder) => void;
}

/** Folder actions behind one button, so the tree row stays short on phones. */
export function MediaFolderMenu({
  folder,
  onCreateChild,
  onDelete,
  onEdit,
}: MediaFolderActions & { folder: MediaFolder }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const run = (action: (folder: MediaFolder) => void) => () => {
    setAnchor(null);
    action(folder);
  };
  return (
    <>
      <IconButton
        aria-label={`Дії з папкою «${folder.name}»`}
        edge="end"
        onClick={(event) => {
          event.stopPropagation();
          setAnchor(event.currentTarget);
        }}
        size="small"
      >
        <MoreVertOutlinedIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} onClose={() => setAnchor(null)} open={Boolean(anchor)}>
        <MenuItem onClick={run(onCreateChild)}>
          <ListItemText>Нова підпапка</ListItemText>
        </MenuItem>
        <MenuItem onClick={run(onEdit)}>
          <ListItemText>Перейменувати або перемістити</ListItemText>
        </MenuItem>
        {onDelete ? (
          <MenuItem onClick={run(onDelete)} sx={{ color: 'error.main' }}>
            <ListItemText>Видалити</ListItemText>
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}
