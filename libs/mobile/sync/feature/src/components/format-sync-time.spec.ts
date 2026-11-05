import { formatSyncTime } from './format-sync-time';

describe('formatSyncTime', () => {
  it('shows only the time for today and the date for an earlier day', () => {
    const now = new Date(2026, 10, 5, 16, 0).getTime();

    expect(formatSyncTime(new Date(2026, 10, 5, 9, 5).getTime(), now)).toBe('09:05');
    expect(formatSyncTime(new Date(2026, 10, 3, 14, 30).getTime(), now)).toBe('03.11 14:30');
  });
});
