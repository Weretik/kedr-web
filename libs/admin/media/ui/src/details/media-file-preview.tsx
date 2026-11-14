import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Button, Stack } from '@mui/material';

import type { MediaFile } from '@admin/media/model';

interface MediaFilePreviewProps {
  file: MediaFile;
  onCopyUrl: () => void;
}

/** The picture with «Відкрити» and «Копіювати посилання». */
export function MediaFilePreview({ file, onCopyUrl }: MediaFilePreviewProps) {
  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          aspectRatio: '4 / 3',
          bgcolor: 'action.hover',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          alt={file.fileName}
          component="img"
          src={file.url}
          sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
        />
      </Box>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
        <Button
          href={file.url}
          rel="noreferrer"
          size="small"
          startIcon={<OpenInNewOutlinedIcon />}
          target="_blank"
        >
          Відкрити
        </Button>
        <Button onClick={onCopyUrl} size="small" startIcon={<ContentCopyOutlinedIcon />}>
          Копіювати посилання
        </Button>
      </Stack>
    </>
  );
}
