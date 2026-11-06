import { categoryChoice, shortCategoryPath, toCodeDecision } from '@admin/catalog-attributes/model';
import { StatusPill } from '@admin/shared/ui';
import { Alert, Box, Button, MenuItem, Select, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CodeInName } from './code-in-name';

import type {
  CatalogAttributeValue,
  CodeCategory,
  CodeChoice,
  CodeDecision,
  CodeProducts,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';

/** Products shown per category before «Показати всі». */
const previewSize = 5;

interface CodeWorkspaceProps {
  code: UnresolvedCode;
  products: CodeProducts | undefined;
  productsLoading: boolean;
  productsError: boolean;
  values: readonly CatalogAttributeValue[];
  canEdit: boolean;
  saving: boolean;
  error: string | null;
  onRetry: () => void;
  onSave: (decision: CodeDecision) => void;
  onSkip: () => void;
}

function ValueOptions({ values }: { values: readonly CatalogAttributeValue[] }) {
  return values.map((value) => (
    <MenuItem key={value.id} value={String(value.id)}>
      {value.nameUk} ({value.code})
    </MenuItem>
  ));
}

function CategoryGroup(props: {
  code: string;
  category: CodeCategory;
  choice: CodeChoice;
  values: readonly CatalogAttributeValue[];
  canEdit: boolean;
  onChange: (choice: CodeChoice) => void;
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
            aria-label={`Значення в категорії ${path}`}
            onChange={(event) => props.onChange(event.target.value as CodeChoice)}
            size="small"
            sx={{ minWidth: 220 }}
            value={props.choice}
          >
            <MenuItem value="inherit">Як для всіх</MenuItem>
            {ValueOptions({ values: props.values })}
            <MenuItem value="none">Без значення</MenuItem>
          </Select>
        ) : category.hasOwnValue ? (
          <Typography variant="body2">Тут: {category.valueName ?? 'без значення'}</Typography>
        ) : null}
      </Stack>
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
 * One code of «Не розшифровані коди» (spec catalog/008): its products grouped by category, with the code highlighted
 * in each name, one value for all products and, where the code means something else, a value per category.
 */
export function CodeWorkspace(props: CodeWorkspaceProps) {
  const { code, products, values } = props;
  const [all, setAll] = useState<CodeChoice | ''>(code.valueId === null ? '' : `${code.valueId}`);
  const [own, setOwn] = useState<Record<number, CodeChoice>>({});
  const categories = products?.categories ?? [];
  const choices = Object.fromEntries(
    categories.map((category) => [
      category.categoryId,
      own[category.categoryId] ?? categoryChoice(category),
    ]),
  ) as Record<number, CodeChoice>;
  const nothingChosen =
    all === '' && Object.values(choices).every((choice) => choice === 'inherit');

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
        {code.valueId === null ? (
          <StatusPill label="Не розшифровано" tone="error" />
        ) : (
          <StatusPill label={`Припущення: ${code.valueName ?? ''}`} tone="warning" />
        )}
      </Stack>

      {props.canEdit ? (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            bgcolor: 'background.default',
            borderRadius: 3,
            flexWrap: 'wrap',
            gap: 1.5,
            p: 1.5,
          }}
          useFlexGap
        >
          <Typography sx={{ fontWeight: 700 }} variant="body2">
            Для всіх товарів:
          </Typography>
          <Select
            aria-label="Значення для всіх товарів"
            displayEmpty
            onChange={(event) => setAll(event.target.value as CodeChoice | '')}
            size="small"
            sx={{ minWidth: 240 }}
            value={all}
          >
            <MenuItem value="">— не вибрано —</MenuItem>
            {ValueOptions({ values })}
            <MenuItem value="none">Без значення (не фільтрувати)</MenuItem>
          </Select>
          <Typography color="text.secondary" variant="caption">
            Значення категорії має пріоритет.
          </Typography>
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
              choice={choices[category.categoryId]}
              code={code.rawValue}
              key={category.categoryId}
              onChange={(choice) => setOwn({ ...own, [category.categoryId]: choice })}
              values={values}
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
            onClick={() => props.onSave(toCodeDecision(all, choices))}
            variant="contained"
          >
            {props.saving ? 'Збереження…' : 'Зберегти і далі'}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
