import { createContext, useContext, type ReactNode } from 'react';
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  View,
  type ViewProps,
} from 'react-native';

const ThemeContext = createContext({ dark: false });

export const MD3LightTheme = { dark: false, colors: {} };
export const MD3DarkTheme = { dark: true, colors: {} };

export function PaperProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: { dark: boolean };
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function Snackbar({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export const Text = NativeText;
export function Divider() {
  return <View />;
}
export const RadioButton = {
  Android: ({
    accessibilityLabel,
    status,
  }: {
    accessibilityLabel?: string;
    color?: string;
    status: 'checked' | 'unchecked';
    value: string;
  }) => <NativeText accessibilityLabel={accessibilityLabel}>{status}</NativeText>,
};
export function ActivityIndicator({
  accessibilityLabel,
}: {
  accessibilityLabel?: string;
  color?: string;
  size?: 'small' | 'large' | number;
}) {
  return <NativeText accessibilityLabel={accessibilityLabel}>Завантаження</NativeText>;
}
export function TextInput({
  left,
  right,
  ...props
}: ViewProps & { left?: ReactNode; right?: ReactNode }) {
  return (
    <View>
      {left}
      <NativeTextInput {...props} />
      {right}
    </View>
  );
}
TextInput.Icon = function TextInputIcon({
  accessibilityLabel,
  onPress,
}: {
  accessibilityLabel?: string;
  color?: string;
  icon: string;
  onPress?: () => void;
}) {
  return (
    <NativeText
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
    >
      Дія
    </NativeText>
  );
};
export function Chip({
  accessibilityLabel,
  children,
  onClose,
  onPress,
}: {
  accessibilityLabel?: string;
  children: ReactNode;
  onClose?: () => void;
  onPress?: () => void;
}) {
  return (
    <NativeText accessibilityLabel={accessibilityLabel} onLongPress={onClose} onPress={onPress}>
      {children}
    </NativeText>
  );
}
export function Button({
  accessibilityLabel,
  children,
  onPress,
}: {
  accessibilityLabel?: string;
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <NativeText
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
    >
      {children}
    </NativeText>
  );
}
export function Switch({
  accessibilityLabel,
  onValueChange,
  value,
}: {
  accessibilityLabel?: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <NativeTextInput
      accessibilityLabel={accessibilityLabel}
      onChangeText={() => onValueChange(!value)}
      value={String(value)}
    />
  );
}
export function Portal({ children }: { children: ReactNode }) {
  return children;
}
export function Modal({ children, visible }: { children: ReactNode; visible: boolean }) {
  return visible ? <View>{children}</View> : null;
}
export function Menu({ anchor, children }: { anchor: ReactNode; children: ReactNode }) {
  return (
    <View>
      {anchor}
      {children}
    </View>
  );
}
Menu.Item = MenuItem;

function MenuItem({ onPress, title }: { onPress: () => void; title: string }) {
  return (
    <NativeText accessibilityRole="menuitem" onPress={onPress}>
      {title}
    </NativeText>
  );
}

export function Searchbar({
  accessibilityLabel,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: {
  accessibilityLabel?: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <TextInput
      accessibilityLabel={accessibilityLabel}
      maxLength={maxLength}
      onChangeText={onChangeText}
      placeholder={placeholder}
      value={value}
    />
  );
}

function AppbarHeader({ children, ...props }: Readonly<ViewProps>) {
  return <View {...props}>{children}</View>;
}

function AppbarContent({ title }: Readonly<{ title: string }>) {
  return <NativeText accessibilityRole="header">{title}</NativeText>;
}

function AppbarAction({
  accessibilityLabel,
  onPress,
}: Readonly<{ accessibilityLabel?: string; icon: string; onPress: () => void }>) {
  return (
    <NativeText
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
    >
      Дія
    </NativeText>
  );
}

export const Appbar = { Action: AppbarAction, Content: AppbarContent, Header: AppbarHeader };

function CardComponent({
  children,
  ...props
}: Readonly<ViewProps & { mode?: 'contained' | 'elevated' | 'outlined' }>) {
  return <View {...props}>{children}</View>;
}

CardComponent.Content = function CardContent({ children, ...props }: Readonly<ViewProps>) {
  return <View {...props}>{children}</View>;
};

export const Card = CardComponent;

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
        <NativeText
          accessibilityLabel={getAccessibilityLabel?.({ route })}
          accessibilityRole="button"
          key={route.key}
          onPress={() => onTabPress({ preventDefault: () => undefined, route })}
        >
          {getLabelText?.({ route })}
        </NativeText>
      ))}
    </View>
  );
}

export const BottomNavigation = { Bar: BottomNavigationBar };

export function IconButton({
  accessibilityLabel,
  onPress,
}: {
  accessibilityLabel?: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <NativeText
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
    >
      Дія
    </NativeText>
  );
}
