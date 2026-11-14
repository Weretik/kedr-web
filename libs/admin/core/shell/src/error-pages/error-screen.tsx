import { Box, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface ErrorScreenProps {
  /** HTTP-style code shown above the title, for example 404 or 500. */
  code: string;
  title: string;
  description: string;
  /** Buttons under the text. */
  actions: ReactNode;
  /** Full screen outside the admin layout, otherwise inside the content area. */
  fullScreen?: boolean;
}

/** One look for every admin error page: code, title, explanation, and actions. */
export function ErrorScreen({
  code,
  title,
  description,
  actions,
  fullScreen = false,
}: ErrorScreenProps) {
  return (
    <Box
      role="alert"
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : 360,
        p: 3,
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 440, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ fontFamily: 'monospace' }} variant="body2">
          {code}
        </Typography>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
        <Stack direction="row" spacing={1}>
          {actions}
        </Stack>
      </Stack>
    </Box>
  );
}
