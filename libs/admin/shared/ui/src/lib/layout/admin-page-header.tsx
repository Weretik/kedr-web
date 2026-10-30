import { Stack, Typography } from '@mui/material';

import type { ReactNode, Ref } from 'react';

interface AdminPageHeaderProps {
  title: string;
  /** Primary page actions, aligned to the end on wide screens. */
  actions?: ReactNode;
  /** Lets a page move focus to its heading after navigation. */
  headingRef?: Ref<HTMLHeadingElement>;
}

/** List page heading: one h1 and optional actions, stacked on phones. */
export function AdminPageHeader({ actions, headingRef, title }: AdminPageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
    >
      <Typography
        component="h1"
        ref={headingRef}
        sx={{ '&:focus': { outline: 'none' } }}
        tabIndex={headingRef ? -1 : undefined}
        variant="h4"
      >
        {title}
      </Typography>
      {actions ? (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}
