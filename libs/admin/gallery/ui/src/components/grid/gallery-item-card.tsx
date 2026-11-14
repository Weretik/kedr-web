import { galleryItemLabel } from '@admin/gallery/model';
import { Card, Stack, Typography } from '@mui/material';

import { GalleryItemActions } from './gallery-item-actions';
import { GalleryItemPreview } from './gallery-item-preview';

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
      <GalleryItemPreview disabled={disabled} index={index} item={item} />
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
      <GalleryItemActions
        count={count}
        disabled={disabled}
        index={index}
        name={name}
        onEdit={() => onEdit(item)}
        onMove={(to) => onMove(item, to)}
        onRemove={() => onRemove(item)}
      />
    </Card>
  );
}
