import { AppText, createStyles, useStyles } from '@mobile/shared/ui';
import { type ReactNode } from 'react';
import { Pressable } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export interface SwipeToRemoveProps {
  children: ReactNode;
  /** Names the line for screen readers: «Прибрати Петля дверна». */
  itemLabel: string;
  onRemove: () => void;
}

/** A swipe to the left shows a red «Прибрати»; the removal itself can be undone from the list. */
export function SwipeToRemove({ children, itemLabel, onRemove }: Readonly<SwipeToRemoveProps>) {
  const styles = useStyles(stylesSheet);
  return (
    <ReanimatedSwipeable
      friction={2}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          accessibilityLabel={`Прибрати ${itemLabel}`}
          accessibilityRole="button"
          onPress={onRemove}
          style={styles.action}
        >
          <AppText style={styles.label} variant="secondaryStrong">
            Прибрати
          </AppText>
        </Pressable>
      )}
      rightThreshold={48}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const stylesSheet = createStyles((theme) => ({
  action: {
    alignItems: 'center',
    backgroundColor: theme.colors.status.error.text,
    justifyContent: 'center',
    width: 96,
  },
  label: { color: theme.colors.background },
}));
