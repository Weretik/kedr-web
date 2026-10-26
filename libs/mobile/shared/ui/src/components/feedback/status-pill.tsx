import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useKedrTheme } from '../../theme/kedr-theme';
import { type KedrStatusKind } from '../../theme/palette';

export interface StatusPillProps {
  kind: KedrStatusKind;
  label: string;
  testID?: string;
}

/** Soft status pill with a dot and a text label; color never carries the meaning alone. */
export function StatusPill({ kind, label, testID }: Readonly<StatusPillProps>) {
  const { kedr } = useKedrTheme();
  const colors = kedr.colors.status[kind];

  return (
    <View
      accessibilityLabel={label}
      style={[styles.pill, { backgroundColor: colors.background, borderRadius: kedr.radius.pill }]}
      testID={testID}
    >
      <View style={[styles.dot, { backgroundColor: colors.foreground }]} />
      <Text
        numberOfLines={1}
        style={[styles.label, { color: colors.foreground }]}
        variant="labelSmall"
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { borderRadius: 3, height: 6, width: 6 },
  label: { flexShrink: 1 },
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    maxWidth: '100%',
    minHeight: 24,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
