import { Text, View, type ViewProps } from 'react-native';

function AppbarHeader({ children, ...props }: Readonly<ViewProps>) {
  return <View {...props}>{children}</View>;
}

function AppbarContent({ title }: Readonly<{ title: string }>) {
  return <Text accessibilityRole="header">{title}</Text>;
}

function AppbarAction({
  accessibilityLabel,
  onPress,
}: Readonly<{ accessibilityLabel?: string; icon: string; onPress: () => void }>) {
  return (
    <Text accessibilityLabel={accessibilityLabel} accessibilityRole="button" onPress={onPress}>
      Дія
    </Text>
  );
}

export const Appbar = { Action: AppbarAction, Content: AppbarContent, Header: AppbarHeader };

type BottomNavigationRoute = { key: string; name?: string };

function BottomNavigationBar({
  getAccessibilityLabel,
  getLabelText,
  navigationState,
  onTabPress,
  testID,
}: {
  getAccessibilityLabel?: ({ route }: { route: BottomNavigationRoute }) => string;
  getLabelText?: ({ route }: { route: BottomNavigationRoute }) => string;
  navigationState: { routes: BottomNavigationRoute[] };
  onTabPress: ({
    preventDefault,
    route,
  }: {
    preventDefault: () => void;
    route: BottomNavigationRoute;
  }) => void;
  testID?: string;
}) {
  return (
    <View testID={testID}>
      {navigationState.routes.map((route) => (
        <Text
          accessibilityLabel={getAccessibilityLabel?.({ route })}
          accessibilityRole="button"
          key={route.key}
          onPress={() => onTabPress({ preventDefault: () => undefined, route })}
        >
          {getLabelText?.({ route })}
        </Text>
      ))}
    </View>
  );
}

export const BottomNavigation = { Bar: BottomNavigationBar };

export function IconButton({
  accessibilityLabel,
  disabled,
  onPress,
}: {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon: string;
  onPress?: () => void;
}) {
  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : onPress}
    >
      Дія
    </Text>
  );
}
