import {
  initialCategoryMeanings,
  initialMeanings,
  isMeaningsDecided,
  shortCategoryPath,
  toCodeDecision,
} from '@admin/catalog-attributes/model';
import { StatusPill } from '@admin/shared/ui';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { CodeInName } from './code-in-name';
import { CodeMeaningsEditor } from './code-meanings-editor';

import type { MeaningRowSlotProps } from './code-meanings-editor';
import type {
  CategoryMeaningsDraft,
  CodeCategory,
  CodeDecision,
  CodeMeaning,
  CodeProducts,
  MeaningsDraft,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';
import type { ComponentType } from 'react';

/** Products shown per category before «Показати всі». */
const previewSize = 5;

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

/** «Колір: Золото · Конфігурація: Z» */
function meaningsText(meanings: readonly CodeMeaning[]): string {
  return meanings.map((meaning) => `${meaning.attributeName}: ${meaning.valueName}`).join(' · ');
}

function CategoryGroup(props: {
  code: string;
  category: CodeCategory;
  draft: CategoryMeaningsDraft;
  MeaningRow: ComponentType<MeaningRowSlotProps>;
  canEdit: boolean;
  onChange: (draft: CategoryMeaningsDraft) => void;
}) {
  const { category } = props;
  const [all, setAll] = useState(false);
  const shown = all ? category.products : category.products.slice(0, previewSize);
  const path = shortCategoryPath(category.categoryPath);
  return (
    <Box
      component="section"
      aria-label={path}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 3, display: 'grid', gap: 1, p: 1.5 }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
        useFlexGap
      >
        <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }} variant="body1">
          {path}{' '}
          <Typography color="text.secondary" component="span" variant="body2">
            · {category.products.length} тов.
          </Typography>
        </Typography>
        {props.canEdit ? (
          <Select
            aria-label={`Розшифровка в категорії ${path}`}
            onChange={(event) =>
              props.onChange({
                ...props.draft,
                mode: event.target.value as CategoryMeaningsDraft['mode'],
              })
            }
            size="small"
            sx={{ minWidth: 220 }}
            value={props.draft.mode}
          >
            <MenuItem value="inherit">Як для всіх</MenuItem>
            <MenuItem value="own">Своя розшифровка</MenuItem>
            <MenuItem value="none">Нічого не означає</MenuItem>
          </Select>
        ) : category.hasOwnValue ? (
          <Typography variant="body2">
            Тут:{' '}
            {category.meanings.length > 0 ? meaningsText(category.meanings) : 'нічого не означає'}
          </Typography>
        ) : null}
      </Stack>
      {props.canEdit && props.draft.mode === 'own' ? (
        <CodeMeaningsEditor
          label={`у категорії ${path}`}
          onChange={(rows) => props.onChange({ ...props.draft, rows })}
          Row={props.MeaningRow}
          rows={props.draft.rows}
        />
      ) : null}
      <Box component="ul" sx={{ display: 'grid', gap: 0.5, listStyle: 'none', m: 0, p: 0 }}>
        {shown.map((product) => (
          <Box
            component="li"
            key={product.productId}
            sx={{ display: 'flex', gap: 1.5, typography: 'body2', minWidth: 0 }}
          >
            <Typography
              color="text.secondary"
              sx={{ flex: '0 0 52px', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}
              variant="caption"
            >
              {product.productId}
            </Typography>
            <Box component="span" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              <CodeInName code={props.code} name={product.name} />
            </Box>
          </Box>
        ))}
      </Box>
      {category.products.length > previewSize ? (
        <Button onClick={() => setAll(!all)} size="small" sx={{ justifySelf: 'start' }}>
          {all ? 'Згорнути' : `Показати всі ${category.products.length}`}
        </Button>
      ) : null}
    </Box>
  );
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
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'space-between',
        }}
        useFlexGap
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}
            variant="h5"
          >
            <Box component="span" sx={{ fontFamily: 'monospace', mr: 1 }}>
              {code.rawValue}
            </Box>
            {code.attributeName}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Трапляється в {code.productCount} тов. на сайті
            {products ? `, ${categories.length} категоріях` : ''}.{code.note ? ` ${code.note}` : ''}
          </Typography>
        </Box>
        {code.meanings.length === 0 ? (
          <StatusPill label="Не розшифровано" tone="error" />
        ) : (
          <StatusPill label={`Припущення: ${meaningsText(code.meanings)}`} tone="warning" />
        )}
      </Stack>

      {props.canEdit ? (
        <Stack
          component="section"
          aria-label="Розшифровка для всіх товарів"
          spacing={1}
          sx={{ bgcolor: 'background.default', borderRadius: 3, p: 1.5 }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
            useFlexGap
          >
            <Typography sx={{ fontWeight: 700 }} variant="body2">
              Що означає код для всіх товарів
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Оберіть ознаку, потім значення. Розшифровка категорії має пріоритет.
            </Typography>
          </Stack>
          {all.nothing ? null : (
            <CodeMeaningsEditor
              label="для всіх товарів"
              onChange={(rows) => setAll({ ...all, rows })}
              Row={props.MeaningRow}
              rows={all.rows}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={all.nothing}
                onChange={(event) => setAll({ ...all, nothing: event.target.checked })}
                size="small"
              />
            }
            label="Код нічого не означає (не фільтрувати)"
            slotProps={{ typography: { variant: 'body2' } }}
          />
        </Stack>
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
            <CategoryGroup
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
