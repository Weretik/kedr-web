import { formatFileSize } from '@admin/media/model';
import { Box, Card, CardActionArea, Checkbox, Typography } from '@mui/material';

import type { MediaFile } from '@admin/media/model';

interface MediaFileCardProps {
  file: MediaFile;
  selected: boolean;
  /** Shown on every card once something is selected, otherwise on hover or focus. */
  selecting: boolean;
  onOpen: (file: MediaFile) => void;
  onToggle: (file: MediaFile) => void;
}

/** A square preview with name and size; the checkbox selects it for a bulk move. */
export function MediaFileCard({ file, onOpen, onToggle, selected, selecting }: MediaFileCardProps) {
  return (
    <Card
      sx={{
        borderColor: selected ? 'primary.main' : undefined,
        position: 'relative',
        '&:hover .media-select, &:focus-within .media-select': { opacity: 1 },
      }}
      variant="outlined"
    >
      <CardActionArea onClick={() => onOpen(file)}>
        <Box
          sx={{
            alignItems: 'center',
            aspectRatio: '1 / 1',
            bgcolor: 'action.hover',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            alt={file.fileName}
            component="img"
            decoding="async"
            loading="lazy"
            src={file.url}
            sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
          />
        </Box>
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography noWrap title={file.fileName} variant="body2">
            {file.fileName}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {formatFileSize(file.sizeBytes)}
          </Typography>
        </Box>
      </CardActionArea>
      <Checkbox
        checked={selected}
        className="media-select"
        onChange={() => onToggle(file)}
        size="small"
        slotProps={{ input: { 'aria-label': `Вибрати «${file.fileName}»` } }}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          left: 6,
          opacity: selected || selecting ? 1 : 0,
          position: 'absolute',
          top: 6,
          '&:hover': { bgcolor: 'background.paper' },
          '@media (hover: none)': { opacity: 1 },
        }}
      />
    </Card>
  );
}
