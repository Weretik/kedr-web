import { AppText, Avatar, BrandMark, createStyles, useStyles } from '@mobile/shared/ui';
import { Pressable, View } from 'react-native';

import { NavIcon } from './nav-icon';
import { navItemAccessibilityLabel, type WorkNavItem } from './work-nav-item';

import type { ReactNode } from 'react';

export interface RailAccount {
  name: string;
  photoUrl?: string | null;
}

/** Tablet: 76 dp rail on the left with the logo, the sections and the account at the bottom. */
export function NavRail({
  account,
  items,
  statusStrip,
}: Readonly<{ account?: RailAccount; items: readonly WorkNavItem[]; statusStrip?: ReactNode }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View style={styles.rail} testID="work-nav-rail">
      <BrandMark />
      <View accessibilityRole="tablist" style={styles.items}>
        {items.map((item) => (
          <Pressable
            accessibilityLabel={navItemAccessibilityLabel(item)}
            accessibilityRole="tab"
            accessibilityState={{ disabled: item.locked, selected: item.focused }}
            key={item.key}
            onPress={item.onPress}
            style={styles.item(item.focused)}
          >
            <NavIcon item={item} />
            <AppText
              align="center"
              numberOfLines={2}
              tone={item.locked ? 'disabled' : item.focused ? 'accent' : 'secondary'}
              variant="tabLabel"
            >
              {item.tab.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      {statusStrip}
      {account ? <Avatar name={account.name} photoUrl={account.photoUrl} size={40} /> : null}
    </View>
  );
}

const stylesSheet = createStyles((theme, rt) => ({
  item: (focused: boolean) => ({
    alignItems: 'center',
    backgroundColor: focused ? theme.colors.accentContainer : 'transparent',
    borderRadius: theme.radius.md,
    gap: 2,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: theme.space.xs,
    paddingVertical: theme.space.sm,
    width: theme.sizes.rail - theme.space.md,
  }),
  items: { alignItems: 'center', flex: 1, gap: theme.space.sm, paddingTop: theme.space.xl },
  rail: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRightColor: theme.colors.outlineVariant,
    borderRightWidth: theme.sizes.border,
    paddingBottom: rt.insets.bottom + theme.space.lg,
    paddingLeft: rt.insets.left,
    paddingTop: rt.insets.top + theme.space.lg,
    width: theme.sizes.rail + rt.insets.left,
  },
}));
