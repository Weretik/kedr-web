import { AppText, createStyles, useStyles } from '@mobile/shared/ui';
import { Pressable, View } from 'react-native';

import { NavIcon } from './nav-icon';
import { navItemAccessibilityLabel, type WorkNavItem } from './work-nav-item';

import type { ReactNode } from 'react';

/** Phone: white bottom bar with four tabs; a locked tab shows a lock and opens customer choice. */
export function TabBar({
  items,
  statusStrip,
}: Readonly<{ items: readonly WorkNavItem[]; statusStrip?: ReactNode }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View>
      {statusStrip}
      <View accessibilityRole="tablist" style={styles.bar} testID="work-tab-bar">
        {items.map((item) => (
          <Pressable
            accessibilityLabel={navItemAccessibilityLabel(item)}
            accessibilityRole="tab"
            accessibilityState={{ disabled: item.locked, selected: item.focused }}
            key={item.key}
            onPress={item.onPress}
            style={styles.item}
          >
            <NavIcon item={item} />
            <AppText
              numberOfLines={1}
              tone={item.locked ? 'disabled' : item.focused ? 'accent' : 'secondary'}
              variant="tabLabel"
            >
              {item.tab.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const stylesSheet = createStyles((theme, rt) => ({
  bar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.outlineVariant,
    borderTopWidth: theme.sizes.border,
    flexDirection: 'row',
    paddingBottom: rt.insets.bottom,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: theme.space.sm,
  },
}));
