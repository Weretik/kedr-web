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

export const navItemLabel = (item: WorkNavItem): string =>
  item.badge ? `${item.tab.label} · ${item.badge}` : item.tab.label;

export const navItemAccessibilityLabel = (item: WorkNavItem): string =>
  item.locked ? `${navItemLabel(item)}, спочатку оберіть клієнта` : navItemLabel(item);
