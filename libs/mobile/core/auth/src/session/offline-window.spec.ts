import { isWithinOfflineWindow } from './offline-window';

const day = 24 * 60 * 60 * 1000;
const refreshedAt = Date.UTC(2026, 10, 1, 9, 0);

describe('offline window (R-014)', () => {
  it.each([
    [0, true],
    [6 * day, true],
    [7 * day, true],
    [7 * day + 1, false],
    [-1, false],
  ])('after %i ms the saved session works: %s', (age, expected) => {
    expect(isWithinOfflineWindow(refreshedAt, refreshedAt + age)).toBe(expected);
  });
});
