import { galleryErrorMessage } from './gallery-error-message';

describe('galleryErrorMessage', () => {
  it('words a conflict for the action', () => {
    expect(galleryErrorMessage({ status: 409 }, 'addVideo')).toBe('Це відео вже є в галереї.');
    expect(galleryErrorMessage({ status: 409 }, 'reorder')).toMatch(/Оновіть сторінку/);
  });

  it('explains rejected input and falls back to a retry', () => {
    expect(galleryErrorMessage({ code: 'Validation' }, 'addPhotos')).toMatch(/медіатеці/);
    expect(galleryErrorMessage({ code: 'Forbidden' }, 'remove')).toBe(
      'Недостатньо прав для цієї дії.',
    );
    expect(galleryErrorMessage(new Error('x'), 'save')).toBe(
      'Не вдалося зберегти. Спробуйте ще раз.',
    );
  });
});
