import { siteProblemLabel } from '@admin/site-models/model';
import {
  Alert,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import type { SiteShowcaseRow } from '@admin/site-models/model';
import type { KeyboardEvent } from 'react';

interface SiteQueueListProps {
  rows: readonly SiteShowcaseRow[];
  totalCount: number;
  selectedKey: string | undefined;
  loading: boolean;
  error: boolean;
  /** Shown when the view is empty, for example «Усі моделі перевірено». */
  emptyText: string;
  onSelect: (key: string) => void;
  onRetry: () => void;
}

/** What the dot of a row means: blue waits for review, amber has a problem; a fine row has none. */
function rowMark(row: SiteShowcaseRow): { color: string; label: string } | null {
  if (row.model === null) return { color: 'error.main', label: siteProblemLabel('no_model') };
  if (row.model.status === 'proposed') return { color: 'info.main', label: 'Не перевірена' };
  if (row.problems.length > 0) return { color: 'warning.main', label: 'Є проблеми' };
  return null;
}

/**
 * The «Моделі» queue: one line per model (or per product in no model) with its name and product count, no photo.
 * ↑ and ↓ move through it.
 */
export function SiteQueueList(props: SiteQueueListProps) {
  const { rows, selectedKey } = props;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = rows.findIndex((row) => row.key === selectedKey);
    const next = rows[event.key === 'ArrowDown' ? index + 1 : Math.max(index - 1, 0)];
    if (next) props.onSelect(next.key);
  };

  if (props.error)
    return (
      <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити список.
      </Alert>
    );
  if (props.loading && rows.length === 0)
    return <Skeleton aria-label="Завантаження списку" height={320} variant="rounded" />;
  if (rows.length === 0)
    return (
      <Typography color="text.secondary" sx={{ p: 2 }} variant="body2">
        {props.emptyText}
      </Typography>
    );

  return (
    <Stack spacing={1} sx={{ minHeight: 0 }}>
      <List
        aria-label="Черга моделей"
        dense
        disablePadding
        onKeyDown={onKeyDown}
        sx={{ overflowY: 'auto' }}
      >
        {rows.map((row) => {
          const mark = rowMark(row);
          const selected = row.key === selectedKey;
          return (
            <ListItemButton
              aria-current={selected ? 'true' : undefined}
              key={row.key}
              onClick={() => props.onSelect(row.key)}
              selected={selected}
              sx={{ borderRadius: 2, gap: 1.5, py: 1 }}
            >
              <Box
                aria-label={mark?.label}
                role={mark ? 'img' : undefined}
                sx={{
                  bgcolor: mark?.color ?? 'transparent',
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: 8,
                  width: 8,
                }}
              />
              <ListItemText
                primary={row.name}
                secondary={
                  row.model === null
                    ? `Код 1С ${row.products[0]?.productId ?? ''}`
                    : `${row.products.length} тов. · ${row.categoryName}`
                }
                slotProps={{
                  primary: { sx: { fontWeight: selected ? 700 : 500, overflowWrap: 'anywhere' } },
                  secondary: { noWrap: true },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      {props.totalCount > rows.length ? (
        <Typography color="text.secondary" sx={{ px: 1 }} variant="caption">
          Показано {rows.length} з {props.totalCount}. Виберіть категорію, щоб звузити список.
        </Typography>
      ) : null}
    </Stack>
  );
}
