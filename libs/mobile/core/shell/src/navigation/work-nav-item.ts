import type { WorkTab } from './work-tabs';

/** One section as the tab bar and the rail draw it. */
export interface WorkNavItem {
  badge?: number;
  focused: boolean;
  key: string;
  locked: boolean;
  onPress: () => void;
  tab: WorkTab;
}

/** «Розрахунок · 3» for screen readers; the count itself is drawn as a badge on the icon. */
export const navItemAccessibilityLabel = (item: WorkNavItem): string => {
  const label = item.badge ? `${item.tab.label} · ${item.badge}` : item.tab.label;
  return item.locked ? `${label}, спочатку оберіть клієнта` : label;
};
