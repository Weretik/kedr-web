import { isTabletDevice } from './orientation-policy';

describe('orientation policy', () => {
  it('treats a device by its shorter side', () => {
    expect(isTabletDevice(390, 844)).toBe(false);
    expect(isTabletDevice(844, 390)).toBe(false);
    expect(isTabletDevice(820, 1180)).toBe(true);
  });
});
