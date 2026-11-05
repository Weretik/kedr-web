import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppText } from '../text/app-text';

export interface SheetProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title?: string;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
);

/** The one bottom sheet of the app; sized by its content. Needs `SheetHost` in the providers. */
export function Sheet({ children, onClose, open, title }: Readonly<SheetProps>) {
  const ref = useRef<BottomSheetModal>(null);
  const { theme } = useUnistyles();

  useEffect(() => {
    if (open) ref.current?.present();
    else ref.current?.dismiss();
  }, [open]);

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      enableDynamicSizing
      handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
      onDismiss={onClose}
      ref={ref}
    >
      <BottomSheetView style={styles.content}>
        {title ? (
          <View style={styles.header}>
            <AppText accessibilityRole="header" variant="sectionTitle">
              {title}
            </AppText>
          </View>
        ) : null}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  content: {
    gap: theme.space.md,
    paddingBottom: rt.insets.bottom + theme.space.lg,
    paddingHorizontal: theme.space.lg,
  },
  header: { paddingTop: theme.space.xs },
}));
