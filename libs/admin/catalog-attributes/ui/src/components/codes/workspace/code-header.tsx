import { codeMeaningsText } from '@admin/catalog-attributes/model';
import { StatusPill } from '@admin/shared/ui';
import { Box, Stack, Typography } from '@mui/material';

import type { UnresolvedCode } from '@admin/catalog-attributes/model';

interface CodeHeaderProps {
  code: UnresolvedCode;
  /** Categories with products of the code, once they are loaded. */
  categoryCount: number | null;
}

/** The code, its attribute, where it occurs, and the current guess. */
export function CodeHeader({ categoryCount, code }: CodeHeaderProps) {
  return (
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
        <Typography component="h2" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }} variant="h5">
          <Box component="span" sx={{ fontFamily: 'monospace', mr: 1 }}>
            {code.rawValue}
          </Box>
          {code.attributeName}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Трапляється в {code.productCount} тов. на сайті
          {categoryCount === null ? '' : `, ${categoryCount} категоріях`}.
          {code.note ? ` ${code.note}` : ''}
        </Typography>
      </Box>
      {code.meanings.length === 0 ? (
        <StatusPill label="Не розшифровано" tone="error" />
      ) : (
        <StatusPill label={`Припущення: ${codeMeaningsText(code.meanings)}`} tone="warning" />
      )}
    </Stack>
  );
}
