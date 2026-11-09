import { AppText, createStyles, Icon, useStyles } from '@mobile/shared/ui';
import { Pressable, View } from 'react-native';

import { navItemAccessibilityLabel, navItemLabel, type WorkNavItem } from './work-nav-item';

import type { ReactNode } from 'react';

/** Phone: white bottom bar with five tabs; locked tabs show a lock and do not open. */
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
            <Icon
              name={
                item.locked ? 'lock-outline' : item.focused ? item.tab.activeIcon : item.tab.icon
              }
              size={24}
              tone={item.locked ? 'disabled' : item.focused ? 'accent' : 'secondary'}
            />
            <AppText
              numberOfLines={1}
              tone={item.locked ? 'disabled' : item.focused ? 'accent' : 'secondary'}
              variant="tabLabel"
            >
              {navItemLabel(item)}
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
