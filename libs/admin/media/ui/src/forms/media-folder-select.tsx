import { buildFolderTree } from '@admin/media/model';
import { MenuItem, TextField } from '@mui/material';
import { useMemo } from 'react';

import type { MediaFolder, MediaFolderNode } from '@admin/media/model';

interface MediaFolderSelectProps {
  label: string;
  folders: readonly MediaFolder[];
  value: number | null;
  onChange: (folderId: number | null) => void;
  /** Folders that cannot be chosen, such as a folder and its subfolders when it is moved. */
  disabledIds?: ReadonlySet<number>;
  disabled?: boolean;
}

const rootValue = 'root';

const flatten = (nodes: MediaFolderNode[]): MediaFolderNode[] =>
  nodes.flatMap((node) => [node, ...flatten(node.children)]);

/** One select for every place a folder is chosen; nested folders are indented. */
export function MediaFolderSelect({
  disabled,
  disabledIds,
  folders,
  label,
  onChange,
  value,
}: MediaFolderSelectProps) {
  const options = useMemo(() => flatten(buildFolderTree(folders)), [folders]);
  return (
    <TextField
      disabled={disabled}
      fullWidth
      label={label}
      onChange={(event) =>
        onChange(event.target.value === rootValue ? null : Number(event.target.value))
      }
      select
      size="small"
      value={value === null ? rootValue : String(value)}
    >
      <MenuItem value={rootValue}>Без папки (корінь бібліотеки)</MenuItem>
      {options.map((folder) => (
        <MenuItem
          disabled={disabledIds?.has(folder.id)}
          key={folder.id}
          sx={{ pl: 2 + folder.depth * 2 }}
          value={String(folder.id)}
        >
          {folder.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
