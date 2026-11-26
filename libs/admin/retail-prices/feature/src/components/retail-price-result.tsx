import { SectionCard } from '@admin/shared/ui';
import { Alert, Stack, Typography } from '@mui/material';

import { codesText } from '../model/retail-price-text';

import type { RetailPriceImportResultDto } from '@admin/retail-prices/data-access';

/** What the last file changed, and the codes it could not use (spec R-004). */
export function RetailPriceResult({ result }: { result: RetailPriceImportResultDto }) {
  return (
    <SectionCard title="Результат">
      <Stack spacing={1.5}>
        <Typography>
          Змінено: {result.changed} · Без змін: {result.unchanged}
        </Typography>
        {result.notFoundCount > 0 ? (
          <Alert severity="warning">
            Не знайдено товарів: {result.notFoundCount}. Коди:{' '}
            {codesText(result.notFoundCodes, result.notFoundCount)}
          </Alert>
        ) : null}
        {result.withoutPriceCount > 0 ? (
          <Alert severity="warning">
            Без ціни: {result.withoutPriceCount}. Коди:{' '}
            {codesText(result.withoutPriceCodes, result.withoutPriceCount)}
          </Alert>
        ) : null}
      </Stack>
    </SectionCard>
  );
}
