import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box, Chip, Tooltip } from '@mui/material';

import type { GalleryItem } from '@admin/gallery/model';

interface GalleryItemPreviewProps {
  item: GalleryItem;
  index: number;
  disabled: boolean;
}

/** The picture of a gallery card with its position, kind, video mark, and drag handle. */
export function GalleryItemPreview({ disabled, index, item }: GalleryItemPreviewProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        aspectRatio: '16 / 10',
        bgcolor: 'action.hover',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {item.previewUrl ? (
        <Box
          alt=""
          component="img"
          decoding="async"
          draggable={false}
          loading="lazy"
          src={item.previewUrl}
          sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
        />
      ) : (
        <ImageNotSupportedOutlinedIcon color="disabled" fontSize="large" />
      )}
      {item.kind === 'video' ? (
        <Box
          aria-hidden
          sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            color: 'common.white',
            display: 'grid',
            height: 44,
            left: '50%',
            placeItems: 'center',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44,
          }}
        >
          <PlayArrowRoundedIcon />
        </Box>
      ) : null}
      <Chip
        label={`${index + 1} · ${item.kind === 'video' ? 'Відео' : 'Фото'}`}
        size="small"
        sx={{ bgcolor: 'background.paper', left: 8, position: 'absolute', top: 8 }}
      />
      <Tooltip title="Перетягніть, щоб змінити порядок">
        <DragIndicatorIcon
          aria-hidden
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            cursor: disabled ? 'default' : 'grab',
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        />
      </Tooltip>
    </Box>
  );
}
