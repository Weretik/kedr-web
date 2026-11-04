import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Typography } from '@mui/material';
import { useRef, useState } from 'react';

import type { DragEvent, ReactNode } from 'react';

interface MediaDropZoneProps {
  children: ReactNode;
  disabled?: boolean;
  /** Where the files go, for the hint: «у папку «Товари»». */
  targetLabel: string;
  onFiles: (files: File[]) => void;
}

const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes('Files');

/** Accepts pictures dragged from the computer anywhere over its content. */
export function MediaDropZone({ children, disabled, onFiles, targetLabel }: MediaDropZoneProps) {
  const [active, setActive] = useState(false);
  // dragenter/dragleave fire for every child; count them so the overlay does not flicker.
  const depth = useRef(0);

  const enter = (event: DragEvent) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    depth.current += 1;
    setActive(true);
  };
  const leave = () => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setActive(false);
  };
  const drop = (event: DragEvent) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    depth.current = 0;
    setActive(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  };

  return (
    <Box
      onDragEnter={enter}
      onDragLeave={leave}
      onDragOver={(event) => {
        if (!disabled && hasFiles(event)) event.preventDefault();
      }}
      onDrop={drop}
      sx={{ position: 'relative' }}
    >
      {children}
      {active ? (
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: 'primary.light',
            border: 2,
            borderColor: 'primary.main',
            borderRadius: 2,
            borderStyle: 'dashed',
            color: 'primary.dark',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            inset: 0,
            justifyContent: 'center',
            opacity: 0.95,
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 48 }} />
          <Typography variant="subtitle2">Відпустіть, щоб завантажити {targetLabel}</Typography>
        </Box>
      ) : null}
    </Box>
  );
}
