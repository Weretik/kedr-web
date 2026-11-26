import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { SiteFinalCategorySelect } from './site-final-category-select';

import type { SiteFinalCategory } from '@admin/site-models/model';

interface SiteModelCategoryFormProps {
  categories: readonly SiteFinalCategory[];
  loading: boolean;
  initialCategoryId: number;
  proposed: boolean;
  saving: boolean;
  error: string | null;
  onSubmit: (categoryId: number) => void;
}

/** «Категорія на сайті» block of the edit panel: moves every product of the model on the site. */
export function SiteModelCategoryForm(props: SiteModelCategoryFormProps) {
  const [categoryId, setCategoryId] = useState<number | undefined>(props.initialCategoryId);
  const changed = categoryId !== undefined && categoryId !== props.initialCategoryId;
  return (
    <Stack
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (changed) props.onSubmit(categoryId);
      }}
      spacing={1.5}
    >
      <SiteFinalCategorySelect
        categories={props.categories}
        disabled={props.saving}
        loading={props.loading}
        onChange={setCategoryId}
        value={categoryId}
      />
      <Alert severity="info">
        На сайті в цю категорію переходять усі товари моделі; в 1С і «Товарах» їхня категорія не
        змінюється.{props.proposed ? ' Пропозицію буде погоджено.' : ''}
      </Alert>
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      <Button
        disabled={props.saving || !changed}
        sx={{ alignSelf: 'flex-start' }}
        type="submit"
        variant="contained"
      >
        Зберегти категорію
      </Button>
    </Stack>
  );
}
