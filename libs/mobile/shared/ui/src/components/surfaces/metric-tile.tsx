import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useKedrTheme } from '../../theme/kedr-theme';
import { type KedrStatusKind } from '../../theme/palette';
import { tabularNumbers } from '../../theme/typography';

export interface MetricTileProps {
  label: string;
  tone?: KedrStatusKind;
  value: string;
  /** Highlight tile spanning the full row. */
  wide?: boolean;
}

export function MetricTile({ label, tone, value, wide = false }: Readonly<MetricTileProps>) {
  const { kedr } = useKedrTheme();

  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={[
        styles.tile,
        wide && styles.wide,
        {
          backgroundColor: wide ? kedr.colors.highlight : kedr.colors.surface,
          borderRadius: kedr.radius.lg,
        },
      ]}
    >
      <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="labelSmall">
        {label}
      </Text>
      <Text
        style={[
          kedr.type.metric,
          tabularNumbers,
          { color: tone ? kedr.colors.status[tone].foreground : kedr.colors.onSurface },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flexBasis: '45%', flexGrow: 1, gap: 2, padding: 12 },
  wide: { flexBasis: '100%' },
});
