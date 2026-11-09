import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { createStyles, useStyles } from '../../theme/create-styles';
import { AppText } from '../text/app-text';
import { Icon } from '../text/icon';

export interface ListRowProps {
  accessibilityHint?: string;
  leading?: ReactNode;
  onPress?: () => void;
  /** Shows a chevron: the row opens another screen. */
  opensDetail?: boolean;
  subtitle?: string;
  title: string;
  trailing?: ReactNode;
}

/** White row with a 1 px border; grows with font scaling instead of clipping. */
export function ListRow({
  accessibilityHint,
  leading,
  onPress,
  opensDetail = false,
  subtitle,
  title,
  trailing,
}: Readonly<ListRowProps>) {
  const styles = useStyles(stylesSheet);
  const content = (
    <>
      {leading}
      <View style={styles.text}>
        <AppText numberOfLines={2} variant="bodyStrong">
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={2} tone="secondary" variant="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {opensDetail ? <Icon name="chevron-right" size={20} tone="secondary" /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row(false)}>{content}</View>;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => styles.row(pressed)}
    >
      {content}
    </Pressable>
  );
}

const stylesSheet = createStyles((theme) => ({
  row: (pressed: boolean) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    borderWidth: theme.sizes.border,
    flexDirection: 'row',
    gap: theme.space.md,
    minHeight: 56,
    opacity: pressed ? theme.motion.pressedOpacity : 1,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  }),
  text: { flex: 1, gap: 2 },
}));
