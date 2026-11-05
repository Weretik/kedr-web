import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '../text/app-text';

import type { StatusKind } from '../../theme/palette';

export interface StatusPillProps {
  kind: StatusKind;
  label: string;
}

/** A problem or state with its word; never an «all OK» badge. */
export function StatusPill({ kind, label }: Readonly<StatusPillProps>) {
  return (
    <View style={styles.pill(kind)}>
      <AppText numberOfLines={1} tone={kind} variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  pill: (kind: StatusKind) => ({
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.status[kind].background,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  }),
}));
