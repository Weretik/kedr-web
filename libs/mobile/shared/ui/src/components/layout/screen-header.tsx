import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKedrTheme } from '../../theme/kedr-theme';
import { RoundIconButton } from '../controls/round-icon-button';

export interface ScreenHeaderProps {
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
  title?: string;
  /** Adds the top safe-area inset; turn off when a parent already handles it. */
  withInset?: boolean;
}

/** Plain header on the screen ground with a round back button and display title. */
export function ScreenHeader({
  onBack,
  right,
  subtitle,
  title,
  withInset = true,
}: Readonly<ScreenHeaderProps>) {
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: (withInset ? insets.top : 0) + 8 }]}>
      {onBack ? (
        <RoundIconButton accessibilityLabel="Назад" icon="arrow-left" onPress={onBack} />
      ) : null}
      <View style={styles.titles}>
        {title ? (
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[kedr.type.screenTitle, { color: kedr.colors.onSurface }]}
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{ color: kedr.colors.onSurfaceVariant }}
            variant="labelSmall"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  titles: { flex: 1 },
});
