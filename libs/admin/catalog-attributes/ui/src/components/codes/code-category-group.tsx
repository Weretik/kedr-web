import { codeMeaningsText, shortCategoryPath } from '@admin/catalog-attributes/model';
import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CodeInName } from './code-in-name';
import { CodeMeaningsEditor } from './meanings/code-meanings-editor';

import type { MeaningRowSlotProps } from './meanings/code-meanings-editor';
import type { CategoryMeaningsDraft, CodeCategory } from '@admin/catalog-attributes/model';
import type { ComponentType } from 'react';

/** Products shown per category before «Показати всі». */
const previewSize = 5;

/** One category of a code: its products with the code highlighted and, when allowed, its own decoding. */
export function CodeCategoryGroup(props: {
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
            {category.meanings.length > 0
              ? codeMeaningsText(category.meanings)
              : 'нічого не означає'}
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
