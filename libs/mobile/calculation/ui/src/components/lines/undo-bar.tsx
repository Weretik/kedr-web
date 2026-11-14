import { AppText, createStyles, useStyles } from '@mobile/shared/ui';
import { Pressable, View } from 'react-native';

export interface UndoBarProps {
  message: string;
  onUndo: () => void;
}

/** A dark bar over the list: what was just done and «Скасувати». */
export function UndoBar({ message, onUndo }: Readonly<UndoBarProps>) {
  const styles = useStyles(stylesSheet);
  return (
    <View accessibilityLiveRegion="polite" style={styles.bar}>
      <AppText numberOfLines={2} style={styles.message} variant="secondary">
        {message}
      </AppText>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onUndo}>
        <AppText style={styles.action} variant="secondaryStrong">
          Скасувати
        </AppText>
      </Pressable>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  action: { color: theme.colors.accentContainer },
  bar: {
    alignItems: 'center',
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.space.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm + 2,
  },
  message: { color: theme.colors.background, flex: 1 },
}));
