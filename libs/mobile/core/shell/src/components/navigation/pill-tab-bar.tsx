import { useKedrTheme, useReducedMotion } from '@mobile/shared/ui';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface PillTab {
  focusedIcon: string;
  label: string;
  unfocusedIcon: string;
}

interface TabRoute {
  key: string;
  name: string;
}

export interface PillTabBarProps {
  /** Count badges by route name, e.g. `{ cart: 3 }`. */
  badges?: Readonly<Record<string, number>>;
  navigation: {
    emit: (event: { canPreventDefault: true; target: string; type: 'tabPress' }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
  state: { index: number; routes: readonly TabRoute[] };
  tabs: Readonly<Record<string, PillTab>>;
}

/** Floating dark pill navigation; the active tab expands into a green pill with its label. */
export function PillTabBar({ badges = {}, navigation, state, tabs }: Readonly<PillTabBarProps>) {
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: kedr.colors.background,
        paddingBottom: insets.bottom + 10,
        paddingHorizontal: kedr.layout.navInset,
        paddingTop: 6,
      }}
    >
      <View
        accessibilityRole="tablist"
        style={[
          styles.bar,
          { backgroundColor: kedr.colors.inverseSurface, height: kedr.layout.navHeight },
        ]}
        testID="mobile-bottom-navigation"
      >
        {state.routes.map((route, index) => {
          const tab = tabs[route.name];
          if (!tab) return null;
          return (
            <PillTabItem
              badge={badges[route.name]}
              focused={state.index === index}
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: 'tabPress',
                });
                if (!event.defaultPrevented && state.index !== index)
                  navigation.navigate(route.name);
              }}
              tab={tab}
            />
          );
        })}
      </View>
    </View>
  );
}

function PillTabItem({
  badge,
  focused,
  onPress,
  tab,
}: Readonly<{ badge?: number; focused: boolean; onPress: () => void; tab: PillTab }>) {
  const { kedr } = useKedrTheme();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;
  const previousBadge = useRef(badge);

  useEffect(() => {
    if (reduced) progress.setValue(focused ? 1 : 0);
    else
      Animated.spring(progress, {
        ...kedr.motion.spring.snappy,
        toValue: focused ? 1 : 0,
        useNativeDriver: false,
      }).start();
  }, [focused, kedr.motion.spring.snappy, progress, reduced]);

  useEffect(() => {
    if (!reduced && badge && previousBadge.current !== undefined && badge > previousBadge.current) {
      badgeScale.setValue(1.35);
      Animated.spring(badgeScale, {
        ...kedr.motion.spring.bouncy,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    previousBadge.current = badge;
  }, [badge, badgeScale, kedr.motion.spring.bouncy, reduced]);

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
        {badge ? (
          <Animated.View
            accessibilityElementsHidden
            accessibilityLabel={label}
            style={[
              styles.badge,
              {
                backgroundColor: focused ? kedr.colors.inverseSurface : kedr.colors.primary,
                transform: [{ scale: badgeScale }],
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: focused ? kedr.colors.inverseOnSurface : kedr.colors.onPrimary },
              ]}
            >
              {badge > 99 ? '99+' : badge}
            </Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
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
  bar: {
    alignItems: 'center',
    borderRadius: 999,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
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
