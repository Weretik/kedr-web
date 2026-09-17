import { View } from 'react-native';

export function Carousel<T>({
  data,
  renderItem,
  testID,
}: {
  data: T[];
  renderItem: (info: {
    item: T;
    index: number;
    relativeProgress: { value: number };
  }) => React.ReactElement;
  testID?: string;
}) {
  return (
    <View testID={testID}>
      {data.map((item, index) => (
        <View key={index}>{renderItem({ item, index, relativeProgress: { value: index } })}</View>
      ))}
    </View>
  );
}

export function Pagination({ count }: { count: number }) {
  return <View accessibilityLabel={`${count} зображення`} />;
}
