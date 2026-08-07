import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet';
import { Text, useTheme } from 'react-native-paper';

export function CatalogActionSheet({ children, onDismiss, title, visible }: Readonly<{ children: ReactNode; onDismiss: () => void; title: string; visible: boolean }>) {
  const ref = useRef<ActionSheetRef>(null);
  const wasVisible = useRef(false);
  const theme = useTheme();

  useEffect(() => {
    if (visible) ref.current?.show(); else if (wasVisible.current) ref.current?.hide();
    wasVisible.current = visible;
  }, [visible]);

  return (
    <ActionSheet closeOnTouchBackdrop containerStyle={{ backgroundColor: theme.colors.surface }} gestureEnabled indicatorStyle={{ backgroundColor: theme.colors.onSurface, height: 4, opacity: 0.9, width: 44 }} keyboardHandlerEnabled onClose={onDismiss} ref={ref}>
      <View style={styles.header}><Text accessibilityRole="header" variant="titleLarge">{title}</Text></View>
      {children}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({ header: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 } });
