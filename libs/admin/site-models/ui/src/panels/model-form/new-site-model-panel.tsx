import { AdminEditPanel } from '@admin/shared/ui';
import { Alert, Button, Chip, Stack, TextField, Typography } from '@mui/material';

import { SiteFinalCategorySelect } from './site-final-category-select';
import { ProductCandidateList } from '../model-products/product-candidate-list';
import { ProductCandidateSearch } from '../model-products/product-candidate-search';

import type { ProductCandidateSearchProps } from '../model-products/product-candidate-search';
import type { SiteFinalCategory, SiteProductCandidate } from '@admin/site-models/model';

interface NewSiteModelPanelProps {
  open: boolean;
  name: string;
  categoryId: number | undefined;
  categories: readonly SiteFinalCategory[];
  categoriesLoading: boolean;
  search: ProductCandidateSearchProps;
  candidates: readonly SiteProductCandidate[];
  candidatesLoading: boolean;
  /** Picked products with the name to show; a product that came with the panel is here already. */
  selected: readonly { productId: number; name: string }[];
  saving: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onCategoryChange: (categoryId: number | undefined) => void;
  onToggle: (product: { productId: number; name: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const maxName = 300;

/** «Нова модель»: name, final site category and products of the whole catalog (spec 001 R-005). */
export function NewSiteModelPanel(props: NewSiteModelPanelProps) {
  const ready = props.name.trim().length > 0 && props.categoryId !== undefined;
  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={props.saving} onClick={props.onClose}>
            Скасувати
          </Button>
          <Button disabled={props.saving || !ready} type="submit" variant="contained">
            Створити модель
          </Button>
        </>
      }
      busy={props.saving}
      onClose={props.onClose}
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) props.onSubmit();
      }}
      open={props.open}
      title="Нова модель"
    >
      <TextField
        label="Назва моделі"
        onChange={(event) => props.onNameChange(event.target.value)}
        size="small"
        slotProps={{ htmlInput: { maxLength: maxName } }}
        value={props.name}
      />
      <SiteFinalCategorySelect
        categories={props.categories}
        loading={props.categoriesLoading}
        onChange={props.onCategoryChange}
        value={props.categoryId}
      />
      <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
        Товари{props.selected.length ? ` (${props.selected.length})` : ''}
      </Typography>
      {props.selected.length > 0 ? (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
          {props.selected.map((product) => (
            <Chip
              key={product.productId}
              label={product.name}
              onDelete={() => props.onToggle(product)}
            />
          ))}
        </Stack>
      ) : null}
      <ProductCandidateSearch {...props.search} />
      <ProductCandidateList
        candidates={props.candidates}
        emptyText={props.search.value.trim() ? 'Нічого не знайдено.' : 'Усі товари в моделях.'}
        loading={props.candidatesLoading}
        onToggle={props.onToggle}
        selectedIds={props.selected.map((product) => product.productId)}
      />
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
    </AdminEditPanel>
  );
}
