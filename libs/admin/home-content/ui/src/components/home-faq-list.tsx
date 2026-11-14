import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Card, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';

import { MoveButtons } from './move-buttons';

import type { HomeFaqItem } from '@admin/home-content/model';

interface HomeFaqListProps {
  items: readonly HomeFaqItem[];
  loading: boolean;
  /** While an order is being saved the rows do not move again. */
  reordering: boolean;
  onAdd: () => void;
  onEdit: (item: HomeFaqItem) => void;
  onMove: (item: HomeFaqItem, to: number) => void;
  onRemove: (item: HomeFaqItem) => void;
}

const clamp = (lines: number) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
});

/** The questions in site order: the Ukrainian question with the start of its answer; the first opens on the site. */
export function HomeFaqList({
  items,
  loading,
  onAdd,
  onEdit,
  onMove,
  onRemove,
  reordering,
}: HomeFaqListProps) {
  if (loading && items.length === 0)
    return (
      <Stack aria-busy="true" aria-label="Завантаження питань" spacing={1}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton height={72} key={index} sx={{ borderRadius: 2 }} variant="rectangular" />
        ))}
      </Stack>
    );

  if (items.length === 0)
    return (
      <Card sx={{ p: 4, textAlign: 'center' }} variant="outlined">
        <Typography sx={{ fontWeight: 600 }}>Питань немає</Typography>
        <Typography color="text.secondary" sx={{ mb: 2, mt: 0.5 }} variant="body2">
          Поки список порожній, блок «Часті запитання» на головній не показується.
        </Typography>
        <Button onClick={onAdd} variant="outlined">
          Додати питання
        </Button>
      </Card>
    );

  return (
    <Card component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }} variant="outlined">
      {items.map((item, index) => (
        <Stack
          component="li"
          direction="row"
          key={item.id}
          spacing={1.5}
          sx={{
            alignItems: 'flex-start',
            borderTop: index === 0 ? 0 : 1,
            borderColor: 'divider',
            px: 2,
            py: 1.5,
          }}
        >
          <Typography color="text.secondary" sx={{ minWidth: 20, pt: 0.25 }} variant="body2">
            {index + 1}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, ...clamp(2) }} variant="body2">
              {item.texts.questionUk}
            </Typography>
            <Typography color="text.secondary" sx={clamp(2)} variant="body2">
              {item.texts.answerUk}
            </Typography>
          </Box>
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <MoveButtons
              count={items.length}
              disabled={reordering}
              index={index}
              name={item.texts.questionUk}
              onMove={(to) => onMove(item, to)}
            />
            <Tooltip title="Редагувати">
              <IconButton
                aria-label={`Редагувати «${item.texts.questionUk}»`}
                onClick={() => onEdit(item)}
                size="small"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Видалити">
              <IconButton
                aria-label={`Видалити «${item.texts.questionUk}»`}
                onClick={() => onRemove(item)}
                size="small"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      ))}
    </Card>
  );
}
