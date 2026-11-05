import { moveFilter } from '@admin/catalog-attributes/model';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Alert, Button, IconButton, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

import type { CategoryFilter } from '@admin/catalog-attributes/model';

interface CategoryFiltersEditorProps {
  filters: readonly CategoryFilter[];
  canEdit: boolean;
  saving: boolean;
  error: string | null;
  onSave: (filters: CategoryFilter[]) => void;
}

/** Which filters a category shows on the site and in which order. */
export function CategoryFiltersEditor({
  canEdit,
  error,
  filters,
  onSave,
  saving,
}: CategoryFiltersEditorProps) {
  const [draft, setDraft] = useState<CategoryFilter[]>(() => [...filters]);
  const changed = draft.some(
    (filter, index) =>
      filter.attributeId !== filters[index]?.attributeId ||
      filter.isFilterable !== filters[index]?.isFilterable,
  );

  if (draft.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        У товарах категорії ще немає ознак для фільтрів.
      </Typography>
    );

  return (
    <Stack spacing={2}>
      <Stack component="ol" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {draft.map((filter, index) => (
          <Stack
            component="li"
            direction="row"
            key={filter.attributeId}
            spacing={1}
            sx={{
              alignItems: 'center',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              px: 1.5,
              py: 1,
            }}
          >
            <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
                {filter.name}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                Товарів зі значенням: {filter.productCount}
              </Typography>
            </Stack>
            {canEdit ? (
              <>
                <Tooltip title="Вище">
                  <span>
                    <IconButton
                      aria-label={`Перемістити ${filter.name} вище`}
                      disabled={index === 0 || saving}
                      onClick={() => setDraft((current) => moveFilter(current, index, -1))}
                      size="small"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Нижче">
                  <span>
                    <IconButton
                      aria-label={`Перемістити ${filter.name} нижче`}
                      disabled={index === draft.length - 1 || saving}
                      onClick={() => setDraft((current) => moveFilter(current, index, 1))}
                      size="small"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Switch
                  checked={filter.isFilterable}
                  disabled={saving}
                  onChange={(_event, checked) =>
                    setDraft((current) =>
                      current.map((item) =>
                        item.attributeId === filter.attributeId
                          ? { ...item, isFilterable: checked }
                          : item,
                      ),
                    )
                  }
                  slotProps={{ input: { 'aria-label': `Показувати фільтр ${filter.name}` } }}
                />
              </>
            ) : (
              <Typography color="text.secondary" variant="body2">
                {filter.isFilterable ? 'Показується' : 'Приховано'}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {canEdit ? (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={!changed || saving} onClick={() => setDraft([...filters])}>
            Скасувати
          </Button>
          <Button disabled={!changed || saving} onClick={() => onSave(draft)} variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
