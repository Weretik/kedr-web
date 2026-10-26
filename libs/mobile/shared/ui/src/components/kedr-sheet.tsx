import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoundIconButton } from './round-icon-button';
import { useKedrTheme } from '../theme/kedr-theme';

export interface KedrSheetProps {
  children: ReactNode;
  onDismiss: () => void;
  testID?: string;
  title: string;
  visible: boolean;
}

/** The single bottom sheet of the app: handle, title row with close, scrim, safe-area padding. */
export function KedrSheet({
  children,
  onDismiss,
  testID,
  title,
  visible,
}: Readonly<KedrSheetProps>) {
  const ref = useRef<ActionSheetRef>(null);
  const wasVisible = useRef(false);
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) ref.current?.show();
    else if (wasVisible.current) ref.current?.hide();
    wasVisible.current = visible;
  }, [visible]);

  return (
    <ActionSheet
      closeOnTouchBackdrop
      containerStyle={{
        backgroundColor: kedr.colors.surface,
        borderTopLeftRadius: kedr.radius.xl,
        borderTopRightRadius: kedr.radius.xl,
        paddingBottom: insets.bottom,
      }}
      gestureEnabled
      indicatorStyle={{
        backgroundColor: kedr.colors.outlineVariant,
        height: 4,
        marginTop: 10,
        width: 36,
      }}
      keyboardHandlerEnabled
      onClose={onDismiss}
      ref={ref}
      testID={testID}
    >
      <View style={styles.header}>
        <Text
          accessibilityRole="header"
          style={[kedr.type.screenTitle, styles.title, { color: kedr.colors.onSurface }]}
        >
          {title}
        </Text>
        <RoundIconButton
          accessibilityLabel="Закрити"
          icon="close"
          onPress={() => ref.current?.hide()}
          tone="surface"
        />
      </View>
      {children}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: { flex: 1, fontSize: 18 },
});
