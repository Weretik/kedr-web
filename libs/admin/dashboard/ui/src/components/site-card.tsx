import { Card, CardContent, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

/** «Сайт»: how fast admin changes reach the site, with the app's refresh action. */
export function SiteCard({ action }: { action: ReactNode }) {
  return (
    <Card
      component="section"
      aria-label="Сайт"
      sx={{ bgcolor: 'grey.900', color: 'common.white' }}
      variant="outlined"
    >
      <CardContent>
        <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Typography component="h2" sx={{ color: 'grey.400', fontWeight: 600 }} variant="body2">
            Сайт
          </Typography>
          <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
            Зміни з адмінки з’являються на сайті протягом 10 хвилин
          </Typography>
          {action}
        </Stack>
      </CardContent>
    </Card>
  );
}
