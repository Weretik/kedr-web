import { connectivityAdapter, type ConnectivityState } from '@mobile/core/connectivity';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

const ConnectivityContext = createContext<ConnectivityState | null>(null);

export function useConnectivity(): ConnectivityState | null {
  return use(ConnectivityContext);
}

export function ConnectivityProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [connectivity, setConnectivity] = useState<ConnectivityState | null>(null);

  useEffect(() => {
    let isActive = true;

    void connectivityAdapter.getCurrent().then((state) => {
      if (isActive) {
        setConnectivity(state);
      }
    });

    const unsubscribe = connectivityAdapter.subscribe(setConnectivity);

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={connectivity}>{children}</ConnectivityContext.Provider>
  );
}
