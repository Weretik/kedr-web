import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { ReactNode, Ref } from 'react';

interface AdminDetailHeaderProps {
  backLabel: string;
  backTo: string;
  title: string;
  /** Page actions, aligned to the end on wide screens. */
  actions?: ReactNode;
  /** Lets a page move focus to its heading after navigation. */
  headingRef?: Ref<HTMLHeadingElement>;
}

/** Detail page heading: a back link to the list, one h1, and optional actions. */
export function AdminDetailHeader({
  actions,
  backLabel,
  backTo,
  headingRef,
  title,
}: AdminDetailHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}
    >
      <Stack spacing={1} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
        <Button
          component={RouterLink}
          size="small"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ color: 'text.secondary', ml: -1, '&:hover': { color: 'text.primary' } }}
          to={backTo}
          variant="text"
        >
          {backLabel}
        </Button>
        <Typography
          component="h1"
          ref={headingRef}
          sx={{ overflowWrap: 'anywhere', '&:focus': { outline: 'none' } }}
          tabIndex={headingRef ? -1 : undefined}
          variant="h4"
        >
          {title}
        </Typography>
      </Stack>
      {actions ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}
