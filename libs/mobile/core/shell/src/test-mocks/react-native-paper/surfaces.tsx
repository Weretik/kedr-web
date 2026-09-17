import { Text, View, type ViewProps } from 'react-native';

export { Text };

export function Divider() {
  return <View />;
}

export function Surface({ children, ...props }: Readonly<ViewProps>) {
  return <View {...props}>{children}</View>;
}

function CardComponent({
  children,
  ...props
}: Readonly<ViewProps & { mode?: 'contained' | 'elevated' | 'outlined' }>) {
  return <View {...props}>{children}</View>;
}

CardComponent.Content = function CardContent({ children, ...props }: Readonly<ViewProps>) {
  return <View {...props}>{children}</View>;
};

export const Card = CardComponent;
