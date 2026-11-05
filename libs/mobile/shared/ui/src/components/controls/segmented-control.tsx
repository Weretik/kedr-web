import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppText } from '../text/app-text';

export interface Segment<TValue extends string> {
  label: string;
  value: TValue;
}

export interface SegmentedControlProps<TValue extends string> {
  accessibilityLabel: string;
  onChange: (value: TValue) => void;
  segments: readonly Segment<TValue>[];
  value: TValue;
}

/** Two or three segments on `surfaceMuted`; the selected one is a white card. */
export function SegmentedControl<TValue extends string>({
  accessibilityLabel,
  onChange,
  segments,
  value,
}: Readonly<SegmentedControlProps<TValue>>) {
  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="tablist" style={styles.track}>
      {segments.map((segment) => {
        const selected = segment.value === value;

        return (
          <Pressable
            accessibilityLabel={segment.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={segment.value}
            onPress={() => onChange(segment.value)}
            style={styles.segment(selected)}
          >
            <AppText
              numberOfLines={1}
              tone={selected ? 'default' : 'secondary'}
              variant={selected ? 'bodyStrong' : 'body'}
            >
              {segment.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  segment: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.surface : 'transparent',
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: theme.space.sm,
  }),
  track: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.space.xs,
    padding: theme.space.xs,
  },
}));
