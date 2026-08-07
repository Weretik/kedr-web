import { View } from 'react-native';

export function RangeSlider({
  accessibilityLabel,
  testID,
}: Readonly<{ accessibilityLabel?: string; testID?: string }>) {
  return <View accessibilityLabel={accessibilityLabel} testID={testID} />;
}
