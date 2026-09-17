import { Image as NativeImage, type ImageProps } from 'react-native';

export function Image(props: ImageProps) {
  return <NativeImage {...props} />;
}
