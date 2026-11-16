import { pauseWarning } from './task-pause-warning';

describe('pauseWarning', () => {
  it('warns when the 1C orders task is switched off', () => {
    expect(pauseWarning('one-c-orders', { enabled: false, kind: 'interval' })).toContain('у 1С');
  });

  it('warns when the 1C orders task is manual only', () => {
    expect(pauseWarning('one-c-orders', { enabled: true, kind: 'manual' })).not.toBeNull();
  });

  it('is silent while the 1C orders task runs by schedule', () => {
    expect(pauseWarning('one-c-orders', { enabled: true, kind: 'interval' })).toBeNull();
  });

  it('is silent for other tasks', () => {
    expect(pauseWarning('stocks', { enabled: false, kind: 'manual' })).toBeNull();
  });
});
