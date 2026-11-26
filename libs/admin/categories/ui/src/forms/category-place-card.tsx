import { SectionCard } from '@admin/shared/ui';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { CategoryParentPicker } from '../components/category-parent-picker';

import type { CategoryParentOption } from '@admin/categories/model';
import type { FormEvent } from 'react';

interface CategoryPlaceCardProps {
  options: readonly CategoryParentOption[];
  /** The parent chosen in the picker. */
  draft: number | null;
  dirty: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  busy: boolean;
  error?: string;
  onDraftChange: (parentId: number | null) => void;
  onSave: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

/** «Розташування»: where the category sits and its place among neighbours (spec 002 R-003). */
export function CategoryPlaceCard(props: CategoryPlaceCardProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSave();
  };

  return (
    <SectionCard title="Розташування">
      <Stack component="form" noValidate onSubmit={submit} spacing={2}>
        <Typography color="text.secondary" variant="body2">
          Куди вкласти категорію разом з її підкатегоріями. Зміни тут важливіші за 1С.
        </Typography>
        <CategoryParentPicker
          disabled={props.busy}
          onChange={props.onDraftChange}
          options={props.options}
          value={props.draft}
        />
        {props.error ? <Alert severity="error">{props.error}</Alert> : null}
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={props.busy || !props.canMoveUp}
              onClick={() => props.onMove('up')}
              startIcon={<ArrowUpwardIcon />}
            >
              Вище
            </Button>
            <Button
              disabled={props.busy || !props.canMoveDown}
              onClick={() => props.onMove('down')}
              startIcon={<ArrowDownwardIcon />}
            >
              Нижче
            </Button>
          </Stack>
          <Button disabled={props.busy || !props.dirty} type="submit" variant="contained">
            Зберегти
          </Button>
        </Stack>
      </Stack>
    </SectionCard>
  );
}
