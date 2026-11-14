import { Drawer } from '@mui/material';

import { MediaFileDetails } from './media-file-details';

import type { MediaFilePanelProps } from './media-file-details';

/** Side panel of one file: preview, link, name and folder, replace, and delete. */
export function MediaFilePanel({ file, ...props }: MediaFilePanelProps) {
  return (
    <Drawer
      anchor="right"
      onClose={props.busy ? undefined : props.onClose}
      open={file !== null}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      {/* A new key after a save or replace restarts the form from the saved file. */}
      {file ? (
        <MediaFileDetails file={file} key={`${file.id}:${file.updatedAt}`} {...props} />
      ) : null}
    </Drawer>
  );
}
