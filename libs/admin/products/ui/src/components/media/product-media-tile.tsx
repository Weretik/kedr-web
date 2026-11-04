import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { ProductMediaItem } from '@admin/products/model';

interface ProductMediaTileProps {
  item: ProductMediaItem;
  /** «Головне» on the first photo, which lists and the site show. */
  badge?: string;
  disabled: boolean;
  onMoveBack?: () => void;
  onMoveForward?: () => void;
  onRemove: () => void;
}

/** One linked picture with its order and remove buttons. */
export function ProductMediaTile({
  badge,
  disabled,
  item,
  onMoveBack,
  onMoveForward,
  onRemove,
}: ProductMediaTileProps) {
  const name = item.fileName || 'Файл видалено з бібліотеки';
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          aspectRatio: '1 / 1',
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          alt={name}
          component="img"
          loading="lazy"
          src={item.url}
          sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
        />
        {badge && (
          <Chip
            color="primary"
            label={badge}
            size="small"
            sx={{ left: 6, position: 'absolute', top: 6 }}
          />
        )}
      </Box>
      <Typography noWrap title={name} variant="caption">
        {name}
      </Typography>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row">
          {onMoveBack && (
            <Tooltip title="Перемістити ліворуч">
              <span>
                <IconButton
                  aria-label={`Перемістити ${name} ліворуч`}
                  disabled={disabled}
                  onClick={onMoveBack}
                  size="small"
                >
                  <ArrowBackIosNewIcon fontSize="inherit" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {onMoveForward && (
            <Tooltip title="Перемістити праворуч">
              <span>
                <IconButton
                  aria-label={`Перемістити ${name} праворуч`}
                  disabled={disabled}
                  onClick={onMoveForward}
                  size="small"
                >
                  <ArrowForwardIosIcon fontSize="inherit" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>
        <Tooltip title="Відв'язати від товару (файл лишається в «Медіа»)">
          <span>
            <IconButton
              aria-label={`Відв'язати ${name}`}
              disabled={disabled}
              onClick={onRemove}
              size="small"
            >
              <DeleteOutlineIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
