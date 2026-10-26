import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKedrTheme } from '../theme/kedr-theme';

export interface ActionBarProps {
  children: ReactNode;
  /** Extra bottom offset, e.g. the pill navigation height on tab screens. */
  bottomOffset?: number;
  /** Turn off inside tab screens, where the tab bar already clears the system inset. */
  respectBottomInset?: boolean;
  testID?: string;
}

/** Dark floating pill that holds the screen's primary action. */
export function ActionBar({
  bottomOffset = 0,
  children,
  respectBottomInset = true,
  testID,
}: Readonly<ActionBarProps>) {
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: kedr.colors.inverseSurface,
          borderRadius: kedr.radius.pill,
          bottom: (respectBottomInset ? insets.bottom : 0) + 12 + bottomOffset,
        },
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}

/** Height a scroll view must reserve at its end so content is not hidden under the bar. */
export const actionBarReservedHeight = 60 + 24;

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    elevation: 6,
    flexDirection: 'row',
    gap: 8,
    left: 12,
    minHeight: 60,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 6,
    position: 'absolute',
    right: 12,
    shadowColor: '#000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});
