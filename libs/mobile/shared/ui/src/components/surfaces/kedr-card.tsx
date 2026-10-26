import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { useKedrTheme } from '../../theme/kedr-theme';

export interface KedrCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
}

/** Flat surface block separated from the ground by color, not shadow. */
export function KedrCard({ children, style, testID, title }: Readonly<KedrCardProps>) {
  const { kedr } = useKedrTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.lg },
        style,
      ]}
      testID={testID}
    >
      {title ? (
        <Text
          accessibilityRole="header"
          style={{ color: kedr.colors.onSurface }}
          variant="titleSmall"
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ card: { gap: 10, padding: 14 } });
