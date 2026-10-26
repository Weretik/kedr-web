import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKedrTheme } from '../theme/kedr-theme';

export interface HeroHeaderProps {
  /** Content under the title, usually a SearchField. */
  children?: ReactNode;
  eyebrow?: string;
  right?: ReactNode;
  title: string;
}

/** Brand-green header block for root tab screens. */
export function HeroHeader({ children, eyebrow, right, title }: Readonly<HeroHeaderProps>) {
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.hero,
        {
          backgroundColor: kedr.colors.primary,
          borderBottomLeftRadius: kedr.radius.xl,
          borderBottomRightRadius: kedr.radius.xl,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.titles}>
          {eyebrow ? (
            <Text style={{ color: kedr.colors.onPrimary, opacity: 0.85 }} variant="labelMedium">
              {eyebrow}
            </Text>
          ) : null}
          <Text
            accessibilityRole="header"
            style={[kedr.type.hero, { color: kedr.colors.onPrimary }]}
          >
            {title}
          </Text>
        </View>
        {right}
      </View>
      {children ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 14 },
  hero: { paddingBottom: 18, paddingHorizontal: 16 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  titles: { flex: 1, gap: 2 },
});
