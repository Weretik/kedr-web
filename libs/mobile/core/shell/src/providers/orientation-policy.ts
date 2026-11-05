import { breakpointFor } from '@mobile/shared/ui';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';

/** Phones stay in portrait; tablets (shorter side ≥ 600 dp) turn freely. */
export const isTabletDevice = (width: number, height: number): boolean =>
  breakpointFor(Math.min(width, height)) !== 'phone';

export function useOrientationPolicy(): void {
  useEffect(() => {
    const { height, width } = Dimensions.get('screen');
    const change = isTabletDevice(width, height)
      ? ScreenOrientation.unlockAsync()
      : ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    void change.catch(() => undefined);
  }, []);
}
