import { registerApiErrorNotifier } from '@mobile/shared/api-client';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { Snackbar } from 'react-native-paper';

interface AppNotifier {
  showError(message: string): void;
}

const AppNotifierContext = createContext<AppNotifier | null>(null);

export function useAppNotifier(): AppNotifier {
  const notifier = use(AppNotifierContext);

  if (!notifier) {
    throw new Error('useAppNotifier має використовуватися всередині AppNotificationProvider.');
  }

  return notifier;
}

export function AppNotificationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => registerApiErrorNotifier((error) => setErrorMessage(error.message)), []);

  return (
    <AppNotifierContext.Provider
      value={{
        showError: setErrorMessage,
      }}
    >
      {children}
      <Snackbar
        action={{
          label: 'Закрити',
          onPress: () => setErrorMessage(null),
        }}
        onDismiss={() => setErrorMessage(null)}
        visible={errorMessage !== null}
      >
        {errorMessage}
      </Snackbar>
    </AppNotifierContext.Provider>
  );
}
