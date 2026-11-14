import { AppText, createStyles, Icon, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import type { WorkNavItem } from '../work/work-nav-item';

/** The section icon with its count as a small badge, so the label stays short enough for a phone. */
export function NavIcon({ item }: Readonly<{ item: WorkNavItem }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View>
      <Icon
        name={item.locked ? 'lock-outline' : item.focused ? item.tab.activeIcon : item.tab.icon}
        size={24}
        tone={item.locked ? 'disabled' : item.focused ? 'accent' : 'secondary'}
      />
      {item.badge && !item.locked ? (
        <View style={styles.badge}>
          <AppText numeric style={styles.count} tone="onAction" variant="tabLabel">
            {item.badge > 99 ? '99+' : item.badge.toString()}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  badge: {
    alignItems: 'center',
    backgroundColor: theme.colors.action,
    borderColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -12,
    top: -6,
  },
  count: { fontSize: 10, lineHeight: 13 },
}));
