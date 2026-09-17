import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

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

Menu.Item = function MenuItem({ onPress, title }: { onPress: () => void; title: string }) {
  return (
    <Text accessibilityRole="menuitem" onPress={onPress}>
      {title}
    </Text>
  );
};
