import { Box, Card, List, ListItemButton, ListItemText, Skeleton, Typography } from '@mui/material';

import type { SiteModelCategory } from '@admin/site-models/model';

interface SiteModelCategoriesNavProps {
  categories: readonly SiteModelCategory[];
  loading: boolean;
  selectedId: number | undefined;
  onSelect: (categoryId: number | undefined) => void;
}

/** «Моделі» sidebar: final categories with model counts; a red count marks problems. */
export function SiteModelCategoriesNav({
  categories,
  loading,
  onSelect,
  selectedId,
}: SiteModelCategoriesNavProps) {
  return (
    <Card component="nav" aria-label="Категорії моделей" variant="outlined">
      <List dense disablePadding sx={{ maxHeight: { md: '70vh' }, overflowY: 'auto' }}>
        <ListItemButton onClick={() => onSelect(undefined)} selected={selectedId === undefined}>
          <ListItemText primary="Усі категорії" />
        </ListItemButton>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Skeleton aria-label="Завантаження категорій" height={160} variant="rounded" />
          </Box>
        ) : (
          categories.map((category) => (
            <ListItemButton
              key={category.id}
              onClick={() => onSelect(category.id)}
              selected={selectedId === category.id}
            >
              <ListItemText
                primary={category.name}
                secondary={[
                  category.parentName,
                  `моделей ${category.acceptedModels}`,
                  category.proposedModels ? `запропоновано ${category.proposedModels}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              />
              {category.problemCount > 0 ? (
                <Typography
                  aria-label={`Проблем: ${category.problemCount}`}
                  sx={{ color: 'error.main', fontWeight: 700, ml: 1 }}
                  variant="caption"
                >
                  {category.problemCount}
                </Typography>
              ) : null}
            </ListItemButton>
          ))
        )}
      </List>
    </Card>
  );
}
