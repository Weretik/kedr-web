import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { AppRouter } from './router/app-router';

interface AppProps {
  authInitialization: Promise<void>;
}

export function App({ authInitialization }: AppProps) {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void authInitialization.finally(() => {
      if (isMounted) {
        setIsAuthInitialized(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [authInitialization]);

  if (!isAuthInitialized) {
    return (
      <Box
        aria-label="Завантаження кабінету менеджера"
        role="status"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
        <Typography>Завантаження…</Typography>
      </Box>
    );
  }

  return (
    <AppRouter />
  );
}
