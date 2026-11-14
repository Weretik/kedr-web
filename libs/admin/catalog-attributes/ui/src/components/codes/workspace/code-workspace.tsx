import {
  initialCategoryMeanings,
  initialMeanings,
  isMeaningsDecided,
  toCodeDecision,
} from '@admin/catalog-attributes/model';
import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CodeCategoryGroup } from './code-category-group';
import { CodeHeader } from './code-header';
import { CodeMeaningsForAll } from '../meanings/code-meanings-for-all';

import type { MeaningRowSlotProps } from '../meanings/code-meanings-editor';
import type {
  CategoryMeaningsDraft,
  CodeDecision,
  CodeProducts,
  MeaningsDraft,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';
import type { ComponentType } from 'react';

interface CodeWorkspaceProps {
  code: UnresolvedCode;
  products: CodeProducts | undefined;
  productsLoading: boolean;
  productsError: boolean;
  /** A meaning row connected to the attribute values. */
  MeaningRow: ComponentType<MeaningRowSlotProps>;
  canEdit: boolean;
  saving: boolean;
  error: string | null;
  onRetry: () => void;
  onSave: (decision: CodeDecision) => void;
  onSkip: () => void;
}

/**
 * One code of «Не розшифровані коди» (spec catalog/008, 009): its products grouped by category, with the code
 * highlighted in each name; what the code means for all products as «ознака → значення» rows in any attributes
 * and, where the code means something else, a decoding per category.
 */
export function CodeWorkspace(props: CodeWorkspaceProps) {
  const { code, products } = props;
  const [all, setAll] = useState<MeaningsDraft>(() => initialMeanings(code));
  const [own, setOwn] = useState<Record<number, CategoryMeaningsDraft>>({});
  const categories = products?.categories ?? [];
  const drafts = Object.fromEntries(
    categories.map((category) => [
      category.categoryId,
      own[category.categoryId] ?? initialCategoryMeanings(category, code.attributeId),
    ]),
  ) as Record<number, CategoryMeaningsDraft>;
  const nothingChosen =
    !isMeaningsDecided(all) && Object.values(drafts).every((draft) => draft.mode === 'inherit');

  return (
    <Stack spacing={2} sx={{ minWidth: 0 }}>
      <CodeHeader categoryCount={products ? categories.length : null} code={code} />
      {props.canEdit ? (
        <CodeMeaningsForAll MeaningRow={props.MeaningRow} onChange={setAll} value={all} />
      ) : null}

      {props.productsError ? (
        <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error">
          Не вдалося завантажити товари з цим кодом.
        </Alert>
      ) : props.productsLoading && !products ? (
        <Skeleton aria-label="Завантаження товарів" height={240} variant="rounded" />
      ) : categories.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          На сайті немає товарів із цим кодом у назві.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {categories.map((category) => (
            <CodeCategoryGroup
              canEdit={props.canEdit}
              category={category}
              code={code.rawValue}
              draft={drafts[category.categoryId]}
              key={category.categoryId}
              MeaningRow={props.MeaningRow}
              onChange={(draft) => setOwn({ ...own, [category.categoryId]: draft })}
            />
          ))}
        </Stack>
      )}

      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      {props.canEdit ? (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={props.saving} onClick={props.onSkip}>
            Пропустити
          </Button>
          <Button
            disabled={props.saving || nothingChosen || !products}
            onClick={() => props.onSave(toCodeDecision(all, drafts))}
            variant="contained"
          >
            {props.saving ? 'Збереження…' : 'Зберегти і далі'}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
