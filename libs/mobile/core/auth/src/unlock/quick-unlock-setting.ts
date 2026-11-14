import { useCallback, useEffect, useState } from 'react';

import { confirmOwner, isQuickUnlockAvailable } from './quick-unlock';
import { readQuickUnlockEnabled, saveQuickUnlockEnabled } from '../storage/token-storage';

export interface QuickUnlockSetting {
  available: boolean;
  enabled: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
}

/** Turning quick unlock on asks the owner once, so a borrowed phone cannot enable it. */
export function useQuickUnlockSetting(): QuickUnlockSetting {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([isQuickUnlockAvailable(), readQuickUnlockEnabled().catch(() => false)]).then(
      ([canUse, isOn]) => {
        if (!active) return;
        setAvailable(canUse);
        setEnabledState(canUse && isOn);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const setEnabled = useCallback(async (next: boolean) => {
    if (next && !(await confirmOwner())) return;
    await saveQuickUnlockEnabled(next);
    setEnabledState(next);
  }, []);

  return { available, enabled, setEnabled };
}
