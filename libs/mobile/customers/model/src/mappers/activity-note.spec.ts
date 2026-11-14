import { activityNote } from './activity-note';

describe('activityNote', () => {
  it('says nothing online with fresh lists', () => {
    expect(activityNote(Date.now(), true, false)).toBeNull();
  });

  it('explains a failed refresh and an offline start without lists', () => {
    expect(activityNote(null, true, true)).toBe('Не вдалося завантажити замовлення.');
    expect(activityNote(null, false, false)).toBe('Без мережі замовлення ще не завантажені.');
  });

  it('names the date of the lists shown offline', () => {
    expect(activityNote(Date.UTC(2026, 10, 14, 12), false, false)).toMatch(
      /^Без мережі, показано станом на .+\.$/,
    );
  });
});
