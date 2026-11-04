import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Button, Card, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { GalleryItemCard } from './gallery-item-card';

import type { GalleryItem } from '@admin/gallery/model';

interface GalleryGridProps {
  items: readonly GalleryItem[];
  loading: boolean;
  /** While an order is being saved the cards do not move again. */
  reordering: boolean;
  onMove: (item: GalleryItem, to: number) => void;
  onEdit: (item: GalleryItem) => void;
  onRemove: (item: GalleryItem) => void;
  onAddPhotos: () => void;
  onAddVideo: () => void;
}

const columns = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
};

/** The cards in site order; a card dropped on another takes its place. */
export function GalleryGrid({
  items,
  loading,
  onAddPhotos,
  onAddVideo,
  onEdit,
  onMove,
  onRemove,
  reordering,
}: GalleryGridProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  if (loading && items.length === 0)
    return (
      <Box aria-busy="true" aria-label="Завантаження галереї" sx={columns}>
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton
            key={index}
            sx={{ aspectRatio: '4 / 3', borderRadius: 2, height: 'auto' }}
            variant="rectangular"
          />
        ))}
      </Box>
    );

  if (items.length === 0)
    return (
      <Card sx={{ p: 4, textAlign: 'center' }} variant="outlined">
        <Typography sx={{ fontWeight: 600 }}>Галерея порожня</Typography>
        <Typography color="text.secondary" sx={{ mb: 2, mt: 0.5 }} variant="body2">
          Додайте фото з медіатеки або відео за посиланням на YouTube.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
          <Button
            onClick={onAddPhotos}
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            variant="outlined"
          >
            Додати фото
          </Button>
          <Button onClick={onAddVideo} startIcon={<YouTubeIcon />} variant="outlined">
            Додати відео
          </Button>
        </Stack>
      </Card>
    );

  const reset = () => {
    setDraggedId(null);
    setOverId(null);
  };

  return (
    <Box sx={columns}>
      {items.map((item, index) => (
        <GalleryItemCard
          count={items.length}
          disabled={reordering}
          drag={{
            dragging: draggedId === item.id,
            over: overId === item.id && draggedId !== item.id,
            onDragStart: (event) => {
              event.dataTransfer.effectAllowed = 'move';
              setDraggedId(item.id);
            },
            onDragOver: (event) => {
              if (draggedId === null) return;
              event.preventDefault();
              setOverId(item.id);
            },
            onDragLeave: () => setOverId((current) => (current === item.id ? null : current)),
            onDrop: (event) => {
              event.preventDefault();
              const dragged = items.find((candidate) => candidate.id === draggedId);
              reset();
              if (dragged && dragged.id !== item.id) onMove(dragged, index);
            },
            onDragEnd: reset,
          }}
          index={index}
          item={item}
          key={item.id}
          onEdit={onEdit}
          onMove={onMove}
          onRemove={onRemove}
        />
      ))}
    </Box>
  );
}
