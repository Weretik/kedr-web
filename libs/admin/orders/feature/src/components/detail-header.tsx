import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import type { ReactNode } from 'react';

export function safeReturnTo(value: string | null): string {
  if (!value || !/^\/(orders(?:\?|$)|customers\/[^/?#]+(?:\?|$))/.test(value) || value.startsWith('//')) return '/orders';
  return value;
}
export function DetailHeader({ title, children }: { title: string; children?: ReactNode }) {
  const [params] = useSearchParams();
  return <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={2}>
    <Stack sx={{ alignItems: 'flex-start' }} spacing={2}>
      <MuiLink component={RouterLink} to={safeReturnTo(params.get('from'))} underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}><ArrowBackIcon fontSize="small" />Назад до списку</MuiLink>
      <Typography component="h1" variant="h4">{title}</Typography>
    </Stack>
    {children && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignSelf: { sm: 'flex-end' } }}>{children}</Stack>}
  </Stack>;
}
