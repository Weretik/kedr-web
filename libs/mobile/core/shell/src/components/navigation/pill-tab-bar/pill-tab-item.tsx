import { useKedrTheme } from '@mobile/shared/ui';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { PillTabBadge } from './pill-tab-badge';
import { usePillTabProgress } from './use-pill-tab-progress';

import type { PillTab } from './pill-tab';

export function PillTabItem({
  badge,
  focused,
  onPress,
  tab,
}: Readonly<{ badge?: number; focused: boolean; onPress: () => void; tab: PillTab }>) {
  const { kedr } = useKedrTheme();
  const progress = usePillTabProgress(focused);

  const foreground = focused ? kedr.colors.onPrimary : kedr.colors.inverseOnSurface;
  const label = badge ? `${tab.label}, ${badge}` : tab.label;

  return (
    <Pressable
      accessibilityLabel={tab.label}
      accessibilityHint={badge ? `Позицій: ${badge}` : undefined}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      hitSlop={4}
      onPress={onPress}
      style={styles.item}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: focused ? kedr.colors.primary : 'transparent',
            borderRadius: kedr.radius.pill,
            opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
          },
        ]}
      >
        <Icon color={foreground} size={22} source={focused ? tab.focusedIcon : tab.unfocusedIcon} />
        {focused ? (
          <Animated.View
            style={{
              maxWidth: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 110] }),
            }}
          >
            <Text
              accessibilityElementsHidden
              numberOfLines={1}
              style={{ color: foreground }}
              variant="labelMedium"
            >
              {tab.label}
            </Text>
          </Animated.View>
        ) : null}
        {badge ? <PillTabBadge count={badge} focused={focused} label={label} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  pill: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 46,
    overflow: 'visible',
    paddingHorizontal: 12,
  },
});
