import { useBump, useKedrTheme } from '@mobile/shared/ui';
import { Animated, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

/** Count badge on a tab; bumps when the count changes. */
export function PillTabBadge({
  count,
  focused,
  label,
}: Readonly<{ count: number; focused: boolean; label: string }>) {
  const { kedr } = useKedrTheme();
  const scale = useBump(count);

  return (
    <Animated.View
      accessibilityElementsHidden
      accessibilityLabel={label}
      style={[
        styles.badge,
        {
          backgroundColor: focused ? kedr.colors.inverseSurface : kedr.colors.primary,
          transform: [{ scale }],
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: focused ? kedr.colors.inverseOnSurface : kedr.colors.onPrimary },
        ]}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 4,
    position: 'absolute',
    right: 2,
    top: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700', lineHeight: 12 },
});
