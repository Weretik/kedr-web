import { useCallback, useState } from 'react';

export const navigationCollapsedStorageKey = 'kedr-admin:navigation-collapsed';

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(navigationCollapsedStorageKey) === 'true';
  } catch {
    return false;
  }
}

function writeCollapsed(isCollapsed: boolean) {
  try {
    window.localStorage.setItem(navigationCollapsedStorageKey, String(isCollapsed));
  } catch {
    // Storage may be unavailable (private mode, blocked site data); the choice then lasts for this visit only.
  }
}

/** Collapsed state of the desktop navigation, remembered in this browser. */
export function useNavigationCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((current) => {
      const next = !current;
      writeCollapsed(next);
      return next;
    });
  }, []);

  return { isCollapsed, toggleCollapsed };
}
