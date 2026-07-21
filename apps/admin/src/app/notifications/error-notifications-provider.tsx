import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

import { subscribeToErrorNotifications } from '../services/notification-service';

import type { ErrorNotification } from '../services/notification-service';
import type { PropsWithChildren } from 'react';

const AUTO_HIDE_DURATION = 6000;

export function ErrorNotificationsProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState<ErrorNotification | null>(null);

  useEffect(() => subscribeToErrorNotifications(setNotification), []);

  const message = notification?.traceId
    ? `${notification.message} Код ошибки: ${notification.traceId}`
    : notification?.message;

  return (
    <>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={AUTO_HIDE_DURATION}
        open={notification !== null}
        onClose={() => setNotification(null)}
      >
        <Alert severity="error" variant="filled" onClose={() => setNotification(null)}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
