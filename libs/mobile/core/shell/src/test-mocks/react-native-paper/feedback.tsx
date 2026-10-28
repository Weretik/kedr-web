import { type ReactNode } from 'react';
import { Text } from 'react-native';

export function Snackbar({ children, visible }: { children: ReactNode; visible: boolean }) {
  return visible ? <Text>{children}</Text> : null;
}

export function ActivityIndicator({
  accessibilityLabel,
}: {
  accessibilityLabel?: string;
  color?: string;
  size?: 'small' | 'large' | number;
}) {
  return <Text accessibilityLabel={accessibilityLabel}>Завантаження</Text>;
}

export function HelperText({
  children,
  visible = true,
}: {
  children: ReactNode;
  type?: string;
  visible?: boolean;
}) {
  return visible ? <Text>{children}</Text> : null;
}
