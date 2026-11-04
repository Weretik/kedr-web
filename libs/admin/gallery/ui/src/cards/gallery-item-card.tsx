import { galleryItemLabel } from '@admin/gallery/model';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box, Card, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { GalleryItem } from '@admin/gallery/model';
import type { DragEvent } from 'react';

export interface GalleryCardDrag {
  dragging: boolean;
  over: boolean;
  onDragStart: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent) => void;
  onDragEnd: () => void;
}

interface GalleryItemCardProps {
  item: GalleryItem;
  index: number;
  count: number;
  disabled: boolean;
  drag: GalleryCardDrag;
  onMove: (item: GalleryItem, to: number) => void;
  onEdit: (item: GalleryItem) => void;
  onRemove: (item: GalleryItem) => void;
}

/** A card as the site shows it: picture, kind, title and caption; order by dragging or the arrows. */
export function GalleryItemCard({
  count,
  disabled,
  drag,
  index,
  item,
  onEdit,
  onMove,
  onRemove,
}: GalleryItemCardProps) {
  const label = galleryItemLabel(item.texts);
  const name = label ?? (item.kind === 'video' ? 'відео без назви' : 'фото без назви');
  const caption = item.texts.captionUk.trim() || item.texts.captionRu.trim();

  return (
    <Card
      draggable={!disabled}
      onDragEnd={drag.onDragEnd}
      onDragLeave={drag.onDragLeave}
      onDragOver={drag.onDragOver}
      onDragStart={drag.onDragStart}
      onDrop={drag.onDrop}
      sx={{
        borderColor: drag.over ? 'primary.main' : item.fileMissing ? 'warning.main' : undefined,
        borderStyle: drag.over ? 'dashed' : undefined,
        display: 'flex',
        flexDirection: 'column',
        opacity: drag.dragging ? 0.5 : 1,
      }}
      variant="outlined"
    >
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
      <Stack spacing={0.5} sx={{ flex: 1, px: 1.5, py: 1 }}>
        {item.fileMissing ? (
          <Typography color="warning.main" variant="caption">
            Файл видалено з медіатеки — на сайті картка не показується.
          </Typography>
        ) : null}
        <Typography
          color={label ? 'text.primary' : 'text.secondary'}
          sx={{ fontStyle: label ? undefined : 'italic', fontWeight: label ? 600 : undefined }}
          variant="body2"
        >
          {label ?? 'Без назви'}
        </Typography>
        {caption ? (
          <Typography
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
            variant="caption"
          >
            {caption}
          </Typography>
        ) : null}
      </Stack>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', borderTop: 1, borderColor: 'divider', px: 0.5 }}
      >
        <Tooltip title="Раніше">
          <span>
            <IconButton
              aria-label={`Перемістити «${name}» раніше`}
              disabled={disabled || index === 0}
              onClick={() => onMove(item, index - 1)}
              size="small"
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Пізніше">
          <span>
            <IconButton
              aria-label={`Перемістити «${name}» пізніше`}
              disabled={disabled || index === count - 1}
              onClick={() => onMove(item, index + 1)}
              size="small"
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Назва та підпис">
          <IconButton aria-label={`Редагувати «${name}»`} onClick={() => onEdit(item)} size="small">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Прибрати з галереї">
          <IconButton
            aria-label={`Прибрати «${name}» з галереї`}
            onClick={() => onRemove(item)}
            size="small"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}
