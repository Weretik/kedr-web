import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, Button, Card, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';

import { MoveButtons } from '../move-buttons';

import type { HomeBrand } from '@admin/home-content/model';

interface HomeBrandGridProps {
  brands: readonly HomeBrand[];
  loading: boolean;
  reordering: boolean;
  onAdd: () => void;
  onEdit: (brand: HomeBrand) => void;
  onMove: (brand: HomeBrand, to: number) => void;
  onRemove: (brand: HomeBrand) => void;
}

const columns = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
};

/** The logo row in site order; each logo sits on white, as on the site. */
export function HomeBrandGrid({
  brands,
  loading,
  onAdd,
  onEdit,
  onMove,
  onRemove,
  reordering,
}: HomeBrandGridProps) {
  if (loading && brands.length === 0)
    return (
      <Box aria-busy="true" aria-label="Завантаження брендів" sx={columns}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton height={150} key={index} sx={{ borderRadius: 2 }} variant="rectangular" />
        ))}
      </Box>
    );

  if (brands.length === 0)
    return (
      <Card sx={{ p: 4, textAlign: 'center' }} variant="outlined">
        <Typography sx={{ fontWeight: 600 }}>Брендів ще немає</Typography>
        <Typography color="text.secondary" sx={{ mb: 2, mt: 0.5 }} variant="body2">
          Поки список порожній, сайт показує вбудовані логотипи: Korfad, Leador, Syndicate doors,
          Steelguard, LA, SOVA.
        </Typography>
        <Button onClick={onAdd} variant="outlined">
          Додати бренд
        </Button>
      </Card>
    );

  return (
    <Box sx={columns}>
      {brands.map((brand, index) => (
        <Card
          key={brand.id}
          sx={{ borderColor: brand.logoMissing ? 'warning.main' : undefined }}
          variant="outlined"
        >
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'common.white',
              display: 'flex',
              height: 96,
              justifyContent: 'center',
              p: 2,
            }}
          >
            {brand.logoUrl ? (
              <Box
                alt=""
                component="img"
                decoding="async"
                loading="lazy"
                src={brand.logoUrl}
                sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <ImageNotSupportedOutlinedIcon color="disabled" fontSize="large" />
            )}
          </Box>
          <Stack spacing={0.5} sx={{ borderTop: 1, borderColor: 'divider', px: 1.5, py: 1 }}>
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {index + 1}. {brand.name}
            </Typography>
            {brand.logoMissing ? (
              <Typography color="warning.main" variant="caption">
                Логотип видалено з медіатеки — на сайті бренд не показується.
              </Typography>
            ) : null}
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', px: 0.5 }}>
            <MoveButtons
              count={brands.length}
              disabled={reordering}
              index={index}
              name={brand.name}
              onMove={(to) => onMove(brand, to)}
              orientation="horizontal"
            />
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Редагувати">
              <IconButton
                aria-label={`Редагувати «${brand.name}»`}
                onClick={() => onEdit(brand)}
                size="small"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Видалити">
              <IconButton
                aria-label={`Видалити «${brand.name}»`}
                onClick={() => onRemove(brand)}
                size="small"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
