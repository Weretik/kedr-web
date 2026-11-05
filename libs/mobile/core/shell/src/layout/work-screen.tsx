import { AppText } from '@mobile/shared/ui';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface WorkScreenProps {
  children: ReactNode;
  /** Shown on the right of the title, e.g. a sync dot or an icon button. */
  headerRight?: ReactNode;
  title?: string;
}

/**
 * Screen frame: ground color, safe areas, 16 dp sides and the screen title. The rail takes the left inset and the
 * phone tab bar the bottom one, so a tablet in landscape pads the right side and the bottom here (R-017).
 */
export function WorkScreen({ children, headerRight, title }: Readonly<WorkScreenProps>) {
  return (
    <View style={styles.screen}>
      {title ? (
        <View style={styles.header}>
          <AppText accessibilityRole="header" style={styles.title} variant="screenTitle">
            {title}
          </AppText>
          {headerRight}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  body: { flex: 1, gap: theme.space.md },
  header: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md, minHeight: 48 },
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingBottom: rt.breakpoint === undefined || rt.breakpoint === 'phone' ? 0 : rt.insets.bottom,
    paddingLeft: theme.space.lg,
    paddingRight: rt.insets.right + theme.space.lg,
    paddingTop: rt.insets.top + theme.space.sm,
  },
  title: { flex: 1 },
}));
